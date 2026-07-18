package handler

import (
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"path"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/storage"
)

const maxUploadBytes int64 = 25 << 20

type MediaHandler struct {
	repo  repository.AdminRepository
	store storage.Store
}

func NewMediaHandler(repo repository.AdminRepository, store storage.Store) MediaHandler {
	return MediaHandler{repo: repo, store: store}
}

func (h MediaHandler) Upload(w http.ResponseWriter, r *http.Request) {
	if h.store == nil || !h.store.Ready() {
		Error(w, http.StatusServiceUnavailable, "storage_unavailable", "Media storage is not configured.")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxUploadBytes)
	if err := r.ParseMultipartForm(maxUploadBytes); err != nil {
		Error(w, http.StatusBadRequest, "invalid_upload", "Upload must be multipart form data under 25MB.")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		Error(w, http.StatusBadRequest, "missing_file", "File is required.")
		return
	}
	defer file.Close()

	contentType, err := uploadContentType(file, header)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid_file", err.Error())
		return
	}

	objectKey := uploadObjectKey(header.Filename)
	if err := h.store.PutObject(r.Context(), objectKey, file, header.Size, contentType); err != nil {
		HandleError(w, err)
		return
	}

	media, err := h.repo.CreateMedia(r.Context(), model.MediaUpload{
		FileName:  header.Filename,
		ObjectKey: objectKey,
		URL:       mediaURL(objectKey),
		MimeType:  contentType,
		SizeBytes: header.Size,
	})
	if err != nil {
		HandleError(w, err)
		return
	}

	JSON(w, http.StatusCreated, media)
}

func (h MediaHandler) List(w http.ResponseWriter, r *http.Request) {
	data, err := h.repo.ListMedia(
		r.Context(),
		intQuery(r, "page", 1),
		intQuery(r, "perPage", 24),
		r.URL.Query().Get("q"),
	)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, data)
}

func (h MediaHandler) Delete(w http.ResponseWriter, r *http.Request) {
	media, err := h.repo.DeleteMedia(r.Context(), chi.URLParam(r, "id"))
	if errors.Is(err, repository.ErrNotFound) {
		Error(w, http.StatusNotFound, "not_found", "Media was not found.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	// Best-effort: the row is already gone, so an orphaned object only wastes
	// storage — it can never be served again once the DB reference is removed.
	if h.store != nil && h.store.Ready() {
		_ = h.store.Remove(r.Context(), media.ObjectKey)
	}
	JSON(w, http.StatusNoContent, nil)
}

func (h MediaHandler) Serve(w http.ResponseWriter, r *http.Request) {
	if h.store == nil || !h.store.Ready() {
		Error(w, http.StatusServiceUnavailable, "storage_unavailable", "Media storage is not configured.")
		return
	}

	objectKey := strings.Trim(chi.URLParam(r, "*"), "/")
	if objectKey == "" || !strings.HasPrefix(objectKey, "uploads/") {
		Error(w, http.StatusNotFound, "not_found", "Media was not found.")
		return
	}

	object, info, err := h.store.GetObject(r.Context(), objectKey)
	if err != nil {
		Error(w, http.StatusNotFound, "not_found", "Media was not found.")
		return
	}
	defer object.Close()

	if info.ContentType != "" {
		w.Header().Set("Content-Type", info.ContentType)
	}
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	http.ServeContent(w, r, path.Base(objectKey), info.LastModified, object)
}

func uploadContentType(file multipart.File, header *multipart.FileHeader) (string, error) {
	buffer := make([]byte, 512)
	n, _ := file.Read(buffer)
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return "", errors.New("Uploaded file could not be read.")
	}

	contentType := http.DetectContentType(buffer[:n])
	contentType = strings.TrimSpace(strings.Split(contentType, ";")[0])
	
	// http.DetectContentType may return application/octet-stream, text/plain, text/xml or application/zip for SVG / Office / ZIP files
	ext := strings.ToLower(path.Ext(header.Filename))
	headerType := strings.TrimSpace(header.Header.Get("Content-Type"))
	headerType = strings.TrimSpace(strings.Split(headerType, ";")[0])

	if contentType == "application/octet-stream" || contentType == "text/plain" || contentType == "application/zip" || contentType == "text/xml" {
		switch ext {
		case ".svg":
			contentType = "image/svg+xml"
		case ".pdf":
			contentType = "application/pdf"
		case ".doc":
			contentType = "application/msword"
		case ".docx":
			contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		case ".xls":
			contentType = "application/vnd.ms-excel"
		case ".xlsx":
			contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		case ".zip":
			contentType = "application/zip"
		default:
			if headerType != "" {
				contentType = headerType
			}
		}
	} else if contentType == "image/svg" {
		contentType = "image/svg+xml"
	}

	switch contentType {
	case "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
		"application/pdf", "application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/zip", "application/x-zip-compressed":
		return contentType, nil
	default:
		return "", errors.New("Only JPG, PNG, WebP, GIF, SVG, PDF, DOC, DOCX, XLS, XLSX, or ZIP files are supported.")
	}
}

func uploadObjectKey(fileName string) string {
	ext := path.Ext(fileName)
	base := strings.TrimSuffix(path.Base(fileName), ext)
	base = slugFileName(base)
	if base == "" {
		base = "file"
	}
	return "uploads/" + time.Now().UTC().Format("2006/01") + "/" + uuid.NewString() + "-" + base + strings.ToLower(ext)
}

func mediaURL(objectKey string) string {
	parts := strings.Split(objectKey, "/")
	for i, part := range parts {
		parts[i] = url.PathEscape(part)
	}
	return "/api/v1/public/media/" + strings.Join(parts, "/")
}

func slugFileName(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	var builder strings.Builder
	lastHyphen := false
	for _, r := range value {
		isAlnum := (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9')
		if isAlnum {
			builder.WriteRune(r)
			lastHyphen = false
			continue
		}
		if builder.Len() > 0 && !lastHyphen {
			builder.WriteByte('-')
			lastHyphen = true
		}
	}
	return strings.Trim(builder.String(), "-")
}

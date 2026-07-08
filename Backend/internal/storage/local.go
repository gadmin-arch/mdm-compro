package storage

import (
	"context"
	"errors"
	"io"
	"mime"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

// LocalStorage keeps media in a directory on disk. Object keys mirror the S3
// layout (uploads/2026/07/uuid-name.ext) so switching drivers keeps URLs valid.
type LocalStorage struct {
	root string
}

func NewLocal(root string) (LocalStorage, error) {
	root = strings.TrimSpace(root)
	if root == "" {
		root = "./data/media"
	}
	absolute, err := filepath.Abs(root)
	if err != nil {
		return LocalStorage{}, err
	}
	if err := os.MkdirAll(absolute, 0o755); err != nil {
		return LocalStorage{}, err
	}
	return LocalStorage{root: absolute}, nil
}

func (s LocalStorage) Ready() bool {
	return s.root != ""
}

func (s LocalStorage) PutObject(_ context.Context, objectKey string, reader io.Reader, size int64, _ string) error {
	target, err := s.resolve(objectKey)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return err
	}
	file, err := os.CreateTemp(filepath.Dir(target), ".upload-*")
	if err != nil {
		return err
	}
	tempName := file.Name()
	if _, err := io.Copy(file, io.LimitReader(reader, size)); err != nil {
		file.Close()
		os.Remove(tempName)
		return err
	}
	if err := file.Close(); err != nil {
		os.Remove(tempName)
		return err
	}
	return os.Rename(tempName, target)
}

func (s LocalStorage) GetObject(_ context.Context, objectKey string) (io.ReadSeekCloser, ObjectInfo, error) {
	target, err := s.resolve(objectKey)
	if err != nil {
		return nil, ObjectInfo{}, err
	}
	file, err := os.Open(target)
	if err != nil {
		return nil, ObjectInfo{}, err
	}
	stat, err := file.Stat()
	if err != nil || stat.IsDir() {
		file.Close()
		if err == nil {
			err = errors.New("object is a directory")
		}
		return nil, ObjectInfo{}, err
	}
	return file, ObjectInfo{
		ContentType:  detectContentType(target, file),
		Size:         stat.Size(),
		LastModified: stat.ModTime(),
	}, nil
}

// resolve maps an object key to a path inside the media root and rejects
// traversal attempts like "uploads/../../etc/passwd".
func (s LocalStorage) resolve(objectKey string) (string, error) {
	cleaned := path.Clean("/" + strings.TrimSpace(objectKey))
	if cleaned == "/" || strings.Contains(cleaned, "..") {
		return "", errors.New("invalid object key")
	}
	target := filepath.Join(s.root, filepath.FromSlash(strings.TrimPrefix(cleaned, "/")))
	if !strings.HasPrefix(target, s.root+string(os.PathSeparator)) {
		return "", errors.New("invalid object key")
	}
	return target, nil
}

func detectContentType(name string, file io.ReadSeeker) string {
	if byExt := mime.TypeByExtension(strings.ToLower(filepath.Ext(name))); byExt != "" {
		return byExt
	}
	buffer := make([]byte, 512)
	n, _ := file.Read(buffer)
	_, _ = file.Seek(0, io.SeekStart)
	if n > 0 {
		return http.DetectContentType(buffer[:n])
	}
	return "application/octet-stream"
}

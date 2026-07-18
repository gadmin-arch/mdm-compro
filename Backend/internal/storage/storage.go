package storage

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/config"
)

type ObjectInfo struct {
	ContentType  string
	Size         int64
	LastModified time.Time
}

// Store abstracts media storage so deployments can pick S3/MinIO or a plain
// directory on disk (shared hosting like cPanel has no object storage).
type Store interface {
	Ready() bool
	PutObject(ctx context.Context, objectKey string, reader io.Reader, size int64, contentType string) error
	GetObject(ctx context.Context, objectKey string) (io.ReadSeekCloser, ObjectInfo, error)
	Remove(ctx context.Context, objectKey string) error
}

// New selects the media store from STORAGE_DRIVER: "s3" (default) or "local".
func New(cfg config.Config) (Store, error) {
	switch strings.ToLower(strings.TrimSpace(cfg.StorageDriver)) {
	case "", "s3", "minio":
		return NewS3(cfg)
	case "local", "disk", "fs":
		return NewLocal(cfg.MediaDir)
	default:
		return nil, fmt.Errorf("unknown STORAGE_DRIVER %q (use s3 or local)", cfg.StorageDriver)
	}
}

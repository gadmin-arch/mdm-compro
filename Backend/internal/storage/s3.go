package storage

import (
	"context"
	"io"
	"net/url"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/config"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type S3Storage struct {
	client *minio.Client
	bucket string
}

func NewS3(cfg config.Config) (S3Storage, error) {
	client, err := minio.New(cfg.S3Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.S3AccessKey, cfg.S3SecretKey, ""),
		Secure: cfg.S3UseSSL,
	})
	if err != nil {
		return S3Storage{}, err
	}
	return S3Storage{client: client, bucket: cfg.S3Bucket}, nil
}

func (s S3Storage) Ready() bool {
	return s.client != nil && s.bucket != ""
}

func (s S3Storage) EnsureBucket(ctx context.Context) error {
	exists, err := s.client.BucketExists(ctx, s.bucket)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	return s.client.MakeBucket(ctx, s.bucket, minio.MakeBucketOptions{})
}

func (s S3Storage) PutObject(ctx context.Context, objectKey string, reader io.Reader, size int64, contentType string) error {
	if err := s.EnsureBucket(ctx); err != nil {
		return err
	}
	_, err := s.client.PutObject(ctx, s.bucket, objectKey, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	return err
}

func (s S3Storage) GetObject(ctx context.Context, objectKey string) (io.ReadSeekCloser, ObjectInfo, error) {
	object, err := s.client.GetObject(ctx, s.bucket, objectKey, minio.GetObjectOptions{})
	if err != nil {
		return nil, ObjectInfo{}, err
	}
	info, err := object.Stat()
	if err != nil {
		_ = object.Close()
		return nil, ObjectInfo{}, err
	}
	return object, ObjectInfo{
		ContentType:  info.ContentType,
		Size:         info.Size,
		LastModified: info.LastModified,
	}, nil
}

func (s S3Storage) Remove(ctx context.Context, objectKey string) error {
	return s.client.RemoveObject(ctx, s.bucket, objectKey, minio.RemoveObjectOptions{})
}

func (s S3Storage) PresignedPutURL(ctx context.Context, objectKey string, expires time.Duration) (*url.URL, error) {
	return s.client.PresignedPutObject(ctx, s.bucket, objectKey, expires)
}

func (s S3Storage) PresignedGetURL(ctx context.Context, objectKey string, expires time.Duration) (*url.URL, error) {
	return s.client.PresignedGetObject(ctx, s.bucket, objectKey, expires, nil)
}

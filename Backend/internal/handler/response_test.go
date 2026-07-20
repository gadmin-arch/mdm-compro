package handler

import (
	"encoding/json"
	"errors"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/validator"
)

func TestHandleErrorValidation(t *testing.T) {
	v := validator.New().Add("title", "Title is required.")
	rec := httptest.NewRecorder()
	HandleError(rec, v)

	if rec.Code != 400 {
		t.Fatalf("status = %d, want 400", rec.Code)
	}
	var payload model.ErrorResponse
	if err := json.NewDecoder(rec.Body).Decode(&payload); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if payload.Error != "validation_error" {
		t.Errorf("error code = %q", payload.Error)
	}
	if payload.Fields["title"] != "Title is required." {
		t.Errorf("fields not propagated: %v", payload.Fields)
	}
}

func TestHandleErrorMasksInternal(t *testing.T) {
	rec := httptest.NewRecorder()
	HandleError(rec, errors.New("secret database detail"))

	if rec.Code != 500 {
		t.Fatalf("status = %d, want 500", rec.Code)
	}
	if body := rec.Body.String(); strings.Contains(body, "secret") {
		t.Errorf("internal error detail leaked: %s", body)
	}
}

func TestDecodeJSONRejectsUnknownFields(t *testing.T) {
	req := httptest.NewRequest("POST", "/", strings.NewReader(`{"known":"x","unknown":true}`))
	var dest struct {
		Known string `json:"known"`
	}
	if err := DecodeJSON(req, &dest); err == nil {
		t.Fatal("unknown fields must be rejected")
	}
}

package service

import (
	"testing"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
)

func TestSpamReason(t *testing.T) {
	cases := []struct {
		name  string
		input model.ContactInput
		want  string
	}{
		{
			name:  "genuine submission passes",
			input: model.ContactInput{Name: "Budi", Email: "budi@example.com", FormMs: 12000},
			want:  "",
		},
		{
			name:  "honeypot filled is a bot",
			input: model.ContactInput{Website: "http://spam.example", FormMs: 12000},
			want:  "honeypot",
		},
		{
			name:  "honeypot with only whitespace still passes",
			input: model.ContactInput{Website: "   ", FormMs: 12000},
			want:  "",
		},
		{
			name:  "submitted faster than a human could type",
			input: model.ContactInput{FormMs: 500},
			want:  "too_fast",
		},
		{
			name:  "exactly at the floor is allowed",
			input: model.ContactInput{FormMs: minContactFormMs},
			want:  "",
		},
		{
			// Older clients (and any non-form caller) omit the timing field;
			// the honeypot and the per-IP rate limit still apply to them.
			name:  "missing timing is not treated as spam",
			input: model.ContactInput{Name: "Budi"},
			want:  "",
		},
		{
			name:  "honeypot wins over timing",
			input: model.ContactInput{Website: "x", FormMs: 100},
			want:  "honeypot",
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := spamReason(tc.input); got != tc.want {
				t.Errorf("spamReason() = %q, want %q", got, tc.want)
			}
		})
	}
}

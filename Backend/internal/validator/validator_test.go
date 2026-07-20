package validator

import "testing"

func TestRequired(t *testing.T) {
	cases := []struct {
		value string
		want  bool
	}{
		{"hello", true},
		{"  x  ", true},
		{"", false},
		{"   ", false},
		{"\t\n", false},
	}
	for _, tc := range cases {
		if got := Required(tc.value); got != tc.want {
			t.Errorf("Required(%q) = %v, want %v", tc.value, got, tc.want)
		}
	}
}

func TestEmail(t *testing.T) {
	cases := []struct {
		value string
		want  bool
	}{
		{"user@example.com", true},
		{"  user@example.com  ", true},
		{"Name <user@example.com>", true},
		{"not-an-email", false},
		{"@example.com", false},
		{"", false},
	}
	for _, tc := range cases {
		if got := Email(tc.value); got != tc.want {
			t.Errorf("Email(%q) = %v, want %v", tc.value, got, tc.want)
		}
	}
}

func TestSlug(t *testing.T) {
	cases := []struct {
		value string
		want  bool
	}{
		{"fire-alarm", true},
		{"a", true},
		{"abc-123-def", true},
		{"Fire-Alarm", false},
		{"fire_alarm", false},
		{"-leading", false},
		{"trailing-", false},
		{"double--hyphen", false},
		{"", false},
	}
	for _, tc := range cases {
		if got := Slug(tc.value); got != tc.want {
			t.Errorf("Slug(%q) = %v, want %v", tc.value, got, tc.want)
		}
	}
}

func TestStrongPassword(t *testing.T) {
	cases := []struct {
		value string
		want  bool
	}{
		{"abcdefg123", true},
		{"A1bcdefghi", true},
		{"short1a", false},      // < 10 chars
		{"abcdefghij", false},   // no digit
		{"1234567890", false},   // no letter
		{"!!!!!!!!!!12", false}, // symbols+digits, no letter
		{"", false},
	}
	for _, tc := range cases {
		if got := StrongPassword(tc.value); got != tc.want {
			t.Errorf("StrongPassword(%q) = %v, want %v", tc.value, got, tc.want)
		}
	}
}

func TestValidationErrorAccumulates(t *testing.T) {
	v := New()
	if v.HasErrors() {
		t.Fatal("new validator should have no errors")
	}
	v = v.Add("title", "Title is required.").Add("slug", "Slug is required.")
	if !v.HasErrors() {
		t.Fatal("expected errors after Add")
	}
	if len(v.Fields) != 2 {
		t.Fatalf("expected 2 fields, got %d", len(v.Fields))
	}
	if v.Fields["title"] != "Title is required." {
		t.Errorf("unexpected title message: %q", v.Fields["title"])
	}
	if v.Error() == "" {
		t.Error("Error() must return a non-empty message")
	}
}

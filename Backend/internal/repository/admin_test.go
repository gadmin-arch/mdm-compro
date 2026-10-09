package repository

import "testing"

func TestCategorySlugSource(t *testing.T) {
	cases := map[string]string{
		"EN: Company News\nID: Berita Perusahaan": "Company News",
		"ID: Berita Perusahaan\nEN: Company News": "Company News",
		"Company News":      "Company News",
		"Berita Perusahaan": "Berita Perusahaan",
	}
	for name, want := range cases {
		if got := categorySlugSource(name); got != want {
			t.Errorf("categorySlugSource(%q) = %q, want %q", name, got, want)
		}
	}
}

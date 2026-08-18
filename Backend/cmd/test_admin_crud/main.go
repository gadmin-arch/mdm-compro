package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Claims struct {
	UserID      string   `json:"userId"`
	Email       string   `json:"email"`
	Role        string   `json:"role"`
	Permissions []string `json:"permissions"`
	jwt.RegisteredClaims
}

func generateToken(secret string) (string, error) {
	now := time.Now().UTC()
	claims := Claims{
		UserID:      "00000000-0000-0000-0000-000000000301",
		Email:       "irfanzuhdiabdillah@gmail.com",
		Role:        "owner",
		Permissions: []string{"admin:*", "content:read", "content:write", "media:write", "contacts:read", "users:manage"},
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        uuid.NewString(),
			Subject:   "00000000-0000-0000-0000-000000000301",
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(secret))
}

type Client struct {
	baseURL string
	token   string
	http    *http.Client
}

func (c *Client) req(method, path string, body any) (int, []byte, error) {
	var bodyReader io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return 0, nil, err
		}
		bodyReader = bytes.NewReader(b)
	}

	r, err := http.NewRequest(method, c.baseURL+path, bodyReader)
	if err != nil {
		return 0, nil, err
	}
	r.Header.Set("Content-Type", "application/json")
	if c.token != "" {
		r.Header.Set("Authorization", "Bearer "+c.token)
	}

	resp, err := c.http.Do(r)
	if err != nil {
		return 0, nil, err
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	return resp.StatusCode, respBytes, err
}

func main() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "change-me-in-production"
	}

	token, err := generateToken(secret)
	if err != nil {
		fmt.Printf("FAIL: generating token: %v\n", err)
		os.Exit(1)
	}

	client := &Client{
		baseURL: "http://localhost:8080/api/v1",
		token:   token,
		http:    &http.Client{Timeout: 10 * time.Second},
	}

	passCount := 0
	failCount := 0

	check := func(name string, code int, expectedCode int, body []byte) {
		if code == expectedCode {
			fmt.Printf(" [PASS] %s (status %d)\n", name, code)
			passCount++
		} else {
			fmt.Printf(" [FAIL] %s (expected %d, got %d): %s\n", name, expectedCode, code, string(body))
			failCount++
		}
	}

	fmt.Println("=== Starting Full Admin CRUD & Endpoints Verification ===")

	// 1. Dashboard
	code, b, _ := client.req("GET", "/admin/dashboard", nil)
	check("GET /admin/dashboard", code, 200, b)

	// 2. Navigation
	code, b, _ = client.req("GET", "/admin/navigation", nil)
	check("GET /admin/navigation", code, 200, b)

	// 3. Settings
	code, b, _ = client.req("GET", "/admin/settings", nil)
	check("GET /admin/settings", code, 200, b)

	// 4. Users
	code, b, _ = client.req("GET", "/admin/users", nil)
	check("GET /admin/users", code, 200, b)

	// 5. Analytics
	code, b, _ = client.req("GET", "/admin/analytics/dashboard", nil)
	check("GET /admin/analytics/dashboard", code, 200, b)
	code, b, _ = client.req("GET", "/admin/analytics/realtime", nil)
	check("GET /admin/analytics/realtime", code, 200, b)

	// 6. Pages CRUD
	fmt.Println("\n--- Testing Pages CRUD ---")
	pagePayload := map[string]any{
		"key":     "test-crud-page",
		"title":   "Test CRUD Page",
		"content": map[string]any{"sections": []any{}},
		"status":  "published",
		"seo":     map[string]any{"title": "Test Page", "description": "Description"},
	}
	code, b, _ = client.req("POST", "/admin/pages", pagePayload)
	check("POST /admin/pages (Create)", code, 201, b)
	var pageResp struct {
		ID      string `json:"id"`
		Version int    `json:"version"`
	}
	json.Unmarshal(b, &pageResp)

	if pageResp.ID != "" {
		code, b, _ = client.req("GET", "/admin/pages/"+pageResp.ID, nil)
		check("GET /admin/pages/{id} (Read)", code, 200, b)

		updatePayload := map[string]any{
			"key":     "test-crud-page",
			"title":   "Updated Test CRUD Page",
			"content": map[string]any{"sections": []any{}},
			"status":  "published",
			"seo":     map[string]any{"title": "Updated Test Page", "description": "Updated Description"},
			"version": pageResp.Version,
		}
		code, b, _ = client.req("PUT", "/admin/pages/"+pageResp.ID, updatePayload)
		check("PUT /admin/pages/{id} (Update)", code, 200, b)
		json.Unmarshal(b, &pageResp)

		code, b, _ = client.req("DELETE", fmt.Sprintf("/admin/pages/%s?version=%d", pageResp.ID, pageResp.Version), nil)
		check("DELETE /admin/pages/{id} (Soft Delete)", code, 204, b)

		code, b, _ = client.req("POST", "/admin/archive/page/"+pageResp.ID+"/restore", nil)
		check("POST /admin/archive/page/{id}/restore (Restore)", code, 200, b)

		code, b, _ = client.req("DELETE", "/admin/archive/page/"+pageResp.ID, nil)
		check("DELETE /admin/archive/page/{id} (Hard Delete Cleanup)", code, 204, b)
	}

	// 7. Services CRUD
	fmt.Println("\n--- Testing Services CRUD ---")
	servicePayload := map[string]any{
		"slug":         "test-crud-service",
		"title":        "Test CRUD Service",
		"summary":      "A test service for CRUD verification",
		"content":      map[string]any{"blocks": []any{}},
		"imageUrl":     "/placeholder.jpg",
		"gallery":      []any{},
		"specs":        map[string]string{},
		"datasheetUrl": "",
		"status":       "published",
		"sortOrder":    99,
		"seo":          map[string]any{"title": "Test Service", "description": "Service Desc"},
	}
	code, b, _ = client.req("POST", "/admin/services", servicePayload)
	check("POST /admin/services (Create)", code, 201, b)
	var servResp struct {
		ID      string `json:"id"`
		Version int    `json:"version"`
	}
	json.Unmarshal(b, &servResp)

	if servResp.ID != "" {
		code, b, _ = client.req("GET", "/admin/services/"+servResp.ID, nil)
		check("GET /admin/services/{id} (Read)", code, 200, b)

		servUpdate := map[string]any{
			"slug":         "test-crud-service",
			"title":        "Updated Test CRUD Service",
			"summary":      "Updated summary",
			"content":      map[string]any{"blocks": []any{}},
			"imageUrl":     "/placeholder.jpg",
			"gallery":      []any{},
			"specs":        map[string]string{},
			"datasheetUrl": "",
			"status":       "published",
			"sortOrder":    99,
			"seo":          map[string]any{"title": "Updated Service", "description": "Service Desc"},
			"version":      servResp.Version,
		}
		code, b, _ = client.req("PUT", "/admin/services/"+servResp.ID, servUpdate)
		check("PUT /admin/services/{id} (Update)", code, 200, b)
		json.Unmarshal(b, &servResp)

		code, b, _ = client.req("DELETE", fmt.Sprintf("/admin/services/%s?version=%d", servResp.ID, servResp.Version), nil)
		check("DELETE /admin/services/{id} (Soft Delete)", code, 204, b)

		code, b, _ = client.req("POST", "/admin/archive/service/"+servResp.ID+"/restore", nil)
		check("POST /admin/archive/service/{id}/restore (Restore)", code, 200, b)

		code, b, _ = client.req("DELETE", "/admin/archive/service/"+servResp.ID, nil)
		check("DELETE /admin/archive/service/{id} (Hard Delete Cleanup)", code, 204, b)
	}

	// 8. Products CRUD
	fmt.Println("\n--- Testing Products CRUD ---")
	productPayload := map[string]any{
		"slug":         "test-crud-product",
		"title":        "Test CRUD Product",
		"summary":      "A test product for CRUD verification",
		"content":      map[string]any{"blocks": []any{}},
		"specs":        map[string]string{"brand": "TestBrand"},
		"imageUrl":     "/placeholder.jpg",
		"gallery":      []any{},
		"datasheetUrl": "",
		"status":       "published",
		"sortOrder":    99,
		"seo":          map[string]any{"title": "Test Product", "description": "Product Desc"},
	}
	code, b, _ = client.req("POST", "/admin/products", productPayload)
	check("POST /admin/products (Create)", code, 201, b)
	var prodResp struct {
		ID      string `json:"id"`
		Version int    `json:"version"`
	}
	json.Unmarshal(b, &prodResp)

	if prodResp.ID != "" {
		code, b, _ = client.req("GET", "/admin/products/"+prodResp.ID, nil)
		check("GET /admin/products/{id} (Read)", code, 200, b)

		prodUpdate := map[string]any{
			"slug":         "test-crud-product",
			"title":        "Updated Test CRUD Product",
			"summary":      "Updated product summary",
			"content":      map[string]any{"blocks": []any{}},
			"specs":        map[string]string{"brand": "UpdatedBrand"},
			"imageUrl":     "/placeholder.jpg",
			"gallery":      []any{},
			"datasheetUrl": "",
			"status":       "published",
			"sortOrder":    99,
			"seo":          map[string]any{"title": "Updated Product", "description": "Product Desc"},
			"version":      prodResp.Version,
		}
		code, b, _ = client.req("PUT", "/admin/products/"+prodResp.ID, prodUpdate)
		check("PUT /admin/products/{id} (Update)", code, 200, b)
		json.Unmarshal(b, &prodResp)

		code, b, _ = client.req("DELETE", fmt.Sprintf("/admin/products/%s?version=%d", prodResp.ID, prodResp.Version), nil)
		check("DELETE /admin/products/{id} (Soft Delete)", code, 204, b)

		code, b, _ = client.req("POST", "/admin/archive/product/"+prodResp.ID+"/restore", nil)
		check("POST /admin/archive/product/{id}/restore (Restore)", code, 200, b)

		code, b, _ = client.req("DELETE", "/admin/archive/product/"+prodResp.ID, nil)
		check("DELETE /admin/archive/product/{id} (Hard Delete Cleanup)", code, 204, b)
	}

	// 9. News CRUD
	fmt.Println("\n--- Testing News CRUD ---")
	newsPayload := map[string]any{
		"slug":             "test-crud-news",
		"title":            "Test CRUD News Article",
		"excerpt":          "Test news article excerpt",
		"body":             map[string]any{"blocks": []any{}},
		"category":         "Industry News",
		"featuredImageUrl": "/placeholder.jpg",
		"featured":         false,
		"status":           "published",
		"seo":              map[string]any{"title": "Test News", "description": "News Desc"},
	}
	code, b, _ = client.req("POST", "/admin/news", newsPayload)
	check("POST /admin/news (Create)", code, 201, b)
	var newsResp struct {
		ID      string `json:"id"`
		Version int    `json:"version"`
	}
	json.Unmarshal(b, &newsResp)

	if newsResp.ID != "" {
		code, b, _ = client.req("GET", "/admin/news/"+newsResp.ID, nil)
		check("GET /admin/news/{id} (Read)", code, 200, b)

		newsUpdate := map[string]any{
			"slug":             "test-crud-news",
			"title":            "Updated Test CRUD News Article",
			"excerpt":          "Updated excerpt",
			"body":             map[string]any{"blocks": []any{}},
			"category":         "Industry News",
			"featuredImageUrl": "/placeholder.jpg",
			"featured":         true,
			"status":           "published",
			"seo":              map[string]any{"title": "Updated News", "description": "News Desc"},
			"version":          newsResp.Version,
		}
		code, b, _ = client.req("PUT", "/admin/news/"+newsResp.ID, newsUpdate)
		check("PUT /admin/news/{id} (Update)", code, 200, b)
		json.Unmarshal(b, &newsResp)

		code, b, _ = client.req("DELETE", fmt.Sprintf("/admin/news/%s?version=%d", newsResp.ID, newsResp.Version), nil)
		check("DELETE /admin/news/{id} (Soft Delete)", code, 204, b)

		code, b, _ = client.req("POST", "/admin/archive/news/"+newsResp.ID+"/restore", nil)
		check("POST /admin/archive/news/{id}/restore (Restore)", code, 200, b)

		code, b, _ = client.req("DELETE", "/admin/archive/news/"+newsResp.ID, nil)
		check("DELETE /admin/archive/news/{id} (Hard Delete Cleanup)", code, 204, b)
	}

	// 10. Careers CRUD
	fmt.Println("\n--- Testing Careers CRUD ---")
	careerPayload := map[string]any{
		"slug":           "test-crud-career",
		"title":          "Test Senior Engineer Position",
		"summary":        "Position summary for test",
		"description":    map[string]any{"blocks": []any{}},
		"department":     "Engineering",
		"location":       "Surabaya / Sidoarjo",
		"employmentType": "full_time",
		"applyUrl":       "https://example.com/apply",
		"status":         "published",
		"seo":            map[string]any{"title": "Career Test", "description": "Career Desc"},
	}
	code, b, _ = client.req("POST", "/admin/careers", careerPayload)
	check("POST /admin/careers (Create)", code, 201, b)
	var carResp struct {
		ID      string `json:"id"`
		Version int    `json:"version"`
	}
	json.Unmarshal(b, &carResp)

	if carResp.ID != "" {
		code, b, _ = client.req("GET", "/admin/careers/"+carResp.ID, nil)
		check("GET /admin/careers/{id} (Read)", code, 200, b)

		carUpdate := map[string]any{
			"slug":           "test-crud-career",
			"title":          "Updated Test Senior Engineer",
			"summary":        "Updated summary",
			"description":    map[string]any{"blocks": []any{}},
			"department":     "Engineering",
			"location":       "Surabaya / Sidoarjo",
			"employmentType": "full_time",
			"applyUrl":       "https://example.com/apply",
			"status":         "published",
			"seo":            map[string]any{"title": "Career Test Updated", "description": "Career Desc"},
			"version":        carResp.Version,
		}
		code, b, _ = client.req("PUT", "/admin/careers/"+carResp.ID, carUpdate)
		check("PUT /admin/careers/{id} (Update)", code, 200, b)
		json.Unmarshal(b, &carResp)

		code, b, _ = client.req("DELETE", fmt.Sprintf("/admin/careers/%s?version=%d", carResp.ID, carResp.Version), nil)
		check("DELETE /admin/careers/{id} (Soft Delete)", code, 204, b)

		code, b, _ = client.req("POST", "/admin/archive/career/"+carResp.ID+"/restore", nil)
		check("POST /admin/archive/career/{id}/restore (Restore)", code, 200, b)

		code, b, _ = client.req("DELETE", "/admin/archive/career/"+carResp.ID, nil)
		check("DELETE /admin/archive/career/{id} (Hard Delete Cleanup)", code, 204, b)
	}

	// 11. Redirects CRUD
	fmt.Println("\n--- Testing Redirects CRUD ---")
	redirectPayload := map[string]any{
		"name":         "Test Redirect",
		"slug":         "test-landing-slug",
		"destination":  "https://example.com/products",
		"description":  "Test redirect description",
		"redirectType": 301,
		"isActive":     true,
	}
	code, b, _ = client.req("POST", "/admin/redirects", redirectPayload)
	check("POST /admin/redirects (Create)", code, 201, b)
	var redirResp struct {
		ID      string `json:"id"`
		Version int    `json:"version"`
	}
	json.Unmarshal(b, &redirResp)

	if redirResp.ID != "" {
		code, b, _ = client.req("GET", "/admin/redirects/"+redirResp.ID, nil)
		check("GET /admin/redirects/{id} (Read)", code, 200, b)

		redirUpdate := map[string]any{
			"name":         "Updated Test Redirect",
			"slug":         "test-landing-slug-updated",
			"destination":  "https://example.com/services",
			"description":  "Updated redirect description",
			"redirectType": 302,
			"isActive":     true,
			"version":      redirResp.Version,
		}
		code, b, _ = client.req("PUT", "/admin/redirects/"+redirResp.ID, redirUpdate)
		check("PUT /admin/redirects/{id} (Update)", code, 200, b)
		json.Unmarshal(b, &redirResp)

		code, b, _ = client.req("DELETE", fmt.Sprintf("/admin/redirects/%s?version=%d", redirResp.ID, redirResp.Version), nil)
		check("DELETE /admin/redirects/{id} (Delete)", code, 204, b)
	}

	// 12. Contacts Workflow
	fmt.Println("\n--- Testing Contacts Inquiry & Status Workflow ---")
	contactPublic := map[string]any{
		"name":    "Test Client",
		"email":   "client@testcorp.com",
		"phone":   "+628123456789",
		"company": "Test Corp Industries",
		"subject": "Electrical Substation Quotation Inquiry",
		"message": "We need a quotation for 20kV transformer maintenance and testing.",
	}
	pubClient := &Client{baseURL: "http://localhost:8080/api/v1", http: &http.Client{Timeout: 5 * time.Second}}
	code, b, _ = pubClient.req("POST", "/public/contacts", contactPublic)
	check("POST /public/contacts (Submit Inquiry)", code, 201, b)

	code, b, _ = client.req("GET", "/admin/contacts?perPage=5", nil)
	check("GET /admin/contacts (List Inquiries)", code, 200, b)
	var contactsResp struct {
		Data []struct {
			ID      string `json:"id"`
			Status  string `json:"status"`
			Version int    `json:"version"`
		} `json:"data"`
	}
	json.Unmarshal(b, &contactsResp)

	if len(contactsResp.Data) > 0 {
		firstContact := contactsResp.Data[0]
		statusUpdate := map[string]any{
			"status":  "resolved",
			"version": firstContact.Version,
		}
		code, b, _ = client.req("PUT", "/admin/contacts/"+firstContact.ID+"/status", statusUpdate)
		check("PUT /admin/contacts/{id}/status (Update Status to Resolved)", code, 200, b)
	}

	fmt.Printf("\n=== Results: %d Passed, %d Failed ===\n", passCount, failCount)
	if failCount > 0 {
		os.Exit(1)
	}
}

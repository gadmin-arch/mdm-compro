package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/validator"
)

type AdminService struct {
	repo repository.AdminRepository
}

func NewAdminService(repo repository.AdminRepository) AdminService {
	return AdminService{repo: repo}
}

func (s AdminService) Dashboard(ctx context.Context) (map[string]int, map[string]map[string]int, error) {
	counts, err := s.repo.DashboardCounts(ctx)
	if err != nil {
		return nil, nil, err
	}
	statuses, err := s.repo.DashboardStatusCounts(ctx)
	if err != nil {
		return nil, nil, err
	}
	return counts, statuses, nil
}

func (s AdminService) RecentContacts(ctx context.Context) ([]model.ContactInquiry, error) {
	return s.repo.ListContacts(ctx, 25)
}

// contactStatuses mirrors the contacts_status_check constraint in the schema.
var contactStatuses = []string{"new", "in_progress", "resolved", "spam"}

func (s AdminService) Contacts(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.ContactInquiry], error) {
	if status != "" && !slices.Contains(contactStatuses, status) {
		return model.ListResponse[model.ContactInquiry]{}, validator.New().Add("status", "Unknown status filter.")
	}
	return s.repo.PageContacts(ctx, page, perPage, strings.TrimSpace(search), status)
}

func (s AdminService) UpdateContactStatus(ctx context.Context, id, status, actorID string, version int) (model.ContactInquiry, error) {
	v := validator.New()
	if !slices.Contains(contactStatuses, status) {
		v = v.Add("status", "Status must be new, in_progress, resolved, or spam.")
	}
	if version < 1 {
		v = v.Add("version", "A current version is required.")
	}
	if v.HasErrors() {
		return model.ContactInquiry{}, v
	}
	return s.repo.UpdateContactStatus(ctx, id, status, actorID, version)
}

func (s AdminService) RecordActivityDiff(ctx context.Context, actorID, action, entityType, entityID string, before, after map[string]string) error {
	return s.repo.RecordActivityDiff(ctx, actorID, action, entityType, entityID, before, after)
}

func (s AdminService) RecordActivity(ctx context.Context, actorID, action, entityType, entityID, label string) error {
	return s.repo.RecordActivity(ctx, actorID, action, entityType, entityID, label)
}

func (s AdminService) RecentActivity(ctx context.Context) ([]model.ActivityEntry, error) {
	return s.repo.RecentActivity(ctx, 12)
}

func (s AdminService) Pages(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.Page], error) {
	search = strings.TrimSpace(search)
	status = strings.TrimSpace(status)
	if status != "" && !validStatus(status) {
		status = ""
	}
	return s.repo.ListPages(ctx, page, perPage, search, status)
}

func (s AdminService) Page(ctx context.Context, id string) (model.Page, error) {
	return s.repo.PageByID(ctx, id)
}

func (s AdminService) CreatePage(ctx context.Context, input model.PageCreateInput) (model.Page, error) {
	input.Key = strings.TrimSpace(input.Key)
	input.Title = strings.TrimSpace(input.Title)
	input.Status = strings.TrimSpace(input.Status)
	input.SEO = cleanSEO(input.SEO)

	v := validator.New()
	if !validator.Slug(input.Key) {
		v = v.Add("key", "Page slug must use lowercase letters, numbers, and hyphens.")
	}
	if !validator.Required(input.Title) {
		v = v.Add("title", "Title is required.")
	}
	if !validStatus(input.Status) {
		v = v.Add("status", "Status must be draft, published, scheduled, or archived.")
	}
	if len(input.Content) == 0 {
		input.Content = json.RawMessage(`{"blocks":[]}`)
	}
	if !json.Valid(input.Content) {
		v = v.Add("content", "Content must be valid JSON.")
	}
	input.PublishedAt = normalizePublishedAt(input.Status, input.PublishedAt)
	if v.HasErrors() {
		return model.Page{}, v
	}
	return s.repo.CreatePage(ctx, input)
}

func (s AdminService) UpdatePage(ctx context.Context, id string, input model.PageInput) (model.Page, error) {
	input.Key = strings.TrimSpace(input.Key)
	input.Title = strings.TrimSpace(input.Title)
	input.Status = strings.TrimSpace(input.Status)
	input.SEO = cleanSEO(input.SEO)
	v := validator.New()
	if !validator.Slug(input.Key) {
		v = v.Add("key", "Page slug must use lowercase letters, numbers, and hyphens.")
	}
	if !validator.Required(input.Title) {
		v = v.Add("title", "Title is required.")
	}
	if !validStatus(input.Status) {
		v = v.Add("status", "Status must be draft, published, scheduled, or archived.")
	}
	if input.Version < 1 {
		v = v.Add("version", "A valid version is required.")
	}
	if len(input.Content) == 0 {
		input.Content = json.RawMessage(`{}`)
	}
	if !json.Valid(input.Content) {
		v = v.Add("content", "Content must be valid JSON.")
	}
	input.PublishedAt = normalizePublishedAt(input.Status, input.PublishedAt)
	current, err := s.repo.PageByID(ctx, id)
	if err != nil {
		return model.Page{}, err
	}
	if model.IsSystemPageKey(current.Key) && input.Key != current.Key {
		v = v.Add("key", "System page slug cannot be changed.")
	}
	if v.HasErrors() {
		return model.Page{}, v
	}
	return s.repo.UpdatePage(ctx, id, input)
}

func (s AdminService) DeletePage(ctx context.Context, id string, version int) error {
	if version < 1 {
		return validator.New().Add("version", "A valid version is required.")
	}
	current, err := s.repo.PageByID(ctx, id)
	if err != nil {
		return err
	}
	if model.IsSystemPageKey(current.Key) {
		return validator.New().Add("key", "System pages cannot be archived.")
	}
	return s.repo.DeletePage(ctx, id, version)
}

func (s AdminService) Content(ctx context.Context, table string, page, perPage int, search, status string) (model.ListResponse[model.ContentNode], error) {
	search = strings.TrimSpace(search)
	status = strings.TrimSpace(status)
	if status != "" && !validStatus(status) {
		status = ""
	}
	return s.repo.ListContent(ctx, table, page, perPage, search, status)
}

func (s AdminService) ContentItem(ctx context.Context, table, id string) (model.ContentNode, error) {
	return s.repo.ContentByID(ctx, table, id)
}

func (s AdminService) CreateContent(ctx context.Context, table string, input model.ContentNodeInput) (model.ContentNode, error) {
	input = normalizeContentInput(input)
	v := validateContentInput(input, false)
	if v.HasErrors() {
		return model.ContentNode{}, v
	}
	return s.repo.CreateContent(ctx, table, input)
}

func (s AdminService) UpdateContent(ctx context.Context, table, id string, input model.ContentNodeInput) (model.ContentNode, error) {
	input = normalizeContentInput(input)
	v := validateContentInput(input, true)
	if v.HasErrors() {
		return model.ContentNode{}, v
	}
	return s.repo.UpdateContent(ctx, table, id, input)
}

func (s AdminService) DeleteContent(ctx context.Context, table, id string, version int) error {
	if version < 1 {
		return validator.New().Add("version", "A valid version is required.")
	}
	return s.repo.DeleteContent(ctx, table, id, version)
}

func (s AdminService) News(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.NewsItem], error) {
	search = strings.TrimSpace(search)
	status = strings.TrimSpace(status)
	if status != "" && !validStatus(status) {
		status = ""
	}
	return s.repo.ListNews(ctx, page, perPage, search, status)
}

func (s AdminService) NewsItem(ctx context.Context, id string) (model.NewsItem, error) {
	return s.repo.NewsByID(ctx, id)
}

func (s AdminService) CreateNews(ctx context.Context, input model.NewsInput) (model.NewsItem, error) {
	input = normalizeNewsInput(input)
	v := validateNewsInput(input, false)
	if v.HasErrors() {
		return model.NewsItem{}, v
	}
	return s.repo.CreateNews(ctx, input)
}

func (s AdminService) UpdateNews(ctx context.Context, id string, input model.NewsInput) (model.NewsItem, error) {
	input = normalizeNewsInput(input)
	v := validateNewsInput(input, true)
	if v.HasErrors() {
		return model.NewsItem{}, v
	}
	return s.repo.UpdateNews(ctx, id, input)
}

func (s AdminService) DeleteNews(ctx context.Context, id string, version int) error {
	if version < 1 {
		return validator.New().Add("version", "A valid version is required.")
	}
	return s.repo.DeleteNews(ctx, id, version)
}

func (s AdminService) Careers(ctx context.Context, page, perPage int, search, status string) (model.ListResponse[model.Career], error) {
	search = strings.TrimSpace(search)
	status = strings.TrimSpace(status)
	if status != "" && !validStatus(status) {
		status = ""
	}
	return s.repo.ListCareers(ctx, page, perPage, search, status)
}

func (s AdminService) Career(ctx context.Context, id string) (model.Career, error) {
	return s.repo.CareerByID(ctx, id)
}

func (s AdminService) CreateCareer(ctx context.Context, input model.CareerInput) (model.Career, error) {
	input = normalizeCareerInput(input)
	v := validateCareerInput(input, false)
	if v.HasErrors() {
		return model.Career{}, v
	}
	return s.repo.CreateCareer(ctx, input)
}

func (s AdminService) UpdateCareer(ctx context.Context, id string, input model.CareerInput) (model.Career, error) {
	input = normalizeCareerInput(input)
	v := validateCareerInput(input, true)
	if v.HasErrors() {
		return model.Career{}, v
	}
	return s.repo.UpdateCareer(ctx, id, input)
}

func (s AdminService) DeleteCareer(ctx context.Context, id string, version int) error {
	if version < 1 {
		return validator.New().Add("version", "A valid version is required.")
	}
	return s.repo.DeleteCareer(ctx, id, version)
}

func validStatus(status string) bool {
	switch status {
	case "draft", "published", "scheduled", "archived":
		return true
	default:
		return false
	}
}

func normalizePublishedAt(status string, value *time.Time) *time.Time {
	if status == "published" && value == nil {
		now := time.Now().UTC()
		return &now
	}
	if status != "published" && status != "scheduled" {
		return nil
	}
	return value
}

func cleanSEO(seo model.SEO) model.SEO {
	seo.Title = strings.TrimSpace(seo.Title)
	seo.Description = strings.TrimSpace(seo.Description)
	seo.Canonical = strings.TrimSpace(seo.Canonical)
	return seo
}

func normalizeContentInput(input model.ContentNodeInput) model.ContentNodeInput {
	if input.ParentID != nil {
		parentID := strings.TrimSpace(*input.ParentID)
		if parentID == "" {
			input.ParentID = nil
		} else {
			input.ParentID = &parentID
		}
	}
	input.Slug = strings.TrimSpace(input.Slug)
	input.Title = strings.TrimSpace(input.Title)
	input.Summary = strings.TrimSpace(input.Summary)
	input.ImageURL = strings.TrimSpace(input.ImageURL)
	input.DatasheetURL = strings.TrimSpace(input.DatasheetURL)
	input.Status = strings.TrimSpace(input.Status)
	input.SEO = cleanSEO(input.SEO)
	if len(input.Content) == 0 {
		input.Content = json.RawMessage(`{"blocks":[]}`)
	}
	input.PublishedAt = normalizePublishedAt(input.Status, input.PublishedAt)
	cleanSpecs := map[string]string{}
	for key, value := range input.Specs {
		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		if key != "" && value != "" {
			cleanSpecs[key] = value
		}
	}
	input.Specs = cleanSpecs
	return input
}

func validateContentInput(input model.ContentNodeInput, requireVersion bool) validator.ValidationError {
	v := validator.New()
	if !validator.Slug(input.Slug) {
		v = v.Add("slug", "Slug must use lowercase letters, numbers, and hyphens.")
	}
	if !validator.Required(input.Title) {
		v = v.Add("title", "Title is required.")
	}
	if !validStatus(input.Status) {
		v = v.Add("status", "Status must be draft, published, scheduled, or archived.")
	}
	if !json.Valid(input.Content) {
		v = v.Add("content", "Content must be valid JSON.")
	}
	if requireVersion && input.Version < 1 {
		v = v.Add("version", "A valid version is required.")
	}
	return v
}

func normalizeNewsInput(input model.NewsInput) model.NewsInput {
	input.Slug = strings.TrimSpace(input.Slug)
	input.Title = strings.TrimSpace(input.Title)
	input.Excerpt = strings.TrimSpace(input.Excerpt)
	input.Category = strings.TrimSpace(input.Category)
	input.FeaturedImageURL = strings.TrimSpace(input.FeaturedImageURL)
	input.Status = strings.TrimSpace(input.Status)
	input.SEO = cleanSEO(input.SEO)
	if len(input.Body) == 0 {
		input.Body = json.RawMessage(`{"blocks":[]}`)
	}
	input.PublishedAt = normalizePublishedAt(input.Status, input.PublishedAt)
	if input.Status != "scheduled" {
		input.ScheduledAt = nil
	}
	return input
}

func validateNewsInput(input model.NewsInput, requireVersion bool) validator.ValidationError {
	v := validator.New()
	if !validator.Slug(input.Slug) {
		v = v.Add("slug", "Slug must use lowercase letters, numbers, and hyphens.")
	}
	if !validator.Required(input.Title) {
		v = v.Add("title", "Title is required.")
	}
	if !validStatus(input.Status) {
		v = v.Add("status", "Status must be draft, published, scheduled, or archived.")
	}
	if !json.Valid(input.Body) {
		v = v.Add("body", "Body must be valid JSON.")
	}
	if requireVersion && input.Version < 1 {
		v = v.Add("version", "A valid version is required.")
	}
	return v
}

func normalizeCareerInput(input model.CareerInput) model.CareerInput {
	input.Slug = strings.TrimSpace(input.Slug)
	input.Title = strings.TrimSpace(input.Title)
	input.Summary = strings.TrimSpace(input.Summary)
	input.Department = strings.TrimSpace(input.Department)
	input.Location = strings.TrimSpace(input.Location)
	input.EmploymentType = strings.TrimSpace(input.EmploymentType)
	input.ApplyURL = strings.TrimSpace(input.ApplyURL)
	input.Status = strings.TrimSpace(input.Status)
	input.SEO = cleanSEO(input.SEO)
	if input.EmploymentType == "" {
		input.EmploymentType = "full_time"
	}
	if len(input.Description) == 0 {
		input.Description = json.RawMessage(`{"blocks":[]}`)
	}
	input.PublishedAt = normalizePublishedAt(input.Status, input.PublishedAt)
	return input
}

func validateCareerInput(input model.CareerInput, requireVersion bool) validator.ValidationError {
	v := validator.New()
	if !validator.Slug(input.Slug) {
		v = v.Add("slug", "Slug must use lowercase letters, numbers, and hyphens.")
	}
	if !validator.Required(input.Title) {
		v = v.Add("title", "Title is required.")
	}
	if !validator.Required(input.Department) {
		v = v.Add("department", "Department is required.")
	}
	if !validator.Required(input.Location) {
		v = v.Add("location", "Location is required.")
	}
	if !validEmploymentType(input.EmploymentType) {
		v = v.Add("employmentType", "Employment type is invalid.")
	}
	if !validStatus(input.Status) {
		v = v.Add("status", "Status must be draft, published, scheduled, or archived.")
	}
	if !json.Valid(input.Description) {
		v = v.Add("description", "Description must be valid JSON.")
	}
	if requireVersion && input.Version < 1 {
		v = v.Add("version", "A valid version is required.")
	}
	return v
}

func validEmploymentType(value string) bool {
	switch value {
	case "full_time", "contract", "internship", "part_time":
		return true
	default:
		return false
	}
}

func (s AdminService) ListSettings(ctx context.Context) (map[string]json.RawMessage, error) {
	list, err := s.repo.ListSettings(ctx)
	if err != nil {
		return nil, err
	}
	res := make(map[string]json.RawMessage)
	for _, item := range list {
		res[item.Key] = item.Value
	}
	return res, nil
}

func (s AdminService) SaveSettings(ctx context.Context, settings map[string]json.RawMessage, userID string) error {
	return s.repo.SaveSettings(ctx, settings, userID)
}

// Setting returns one setting; a missing key comes back as an empty object
// with version 0 so the admin UI can render a blank form (save creates it).
func (s AdminService) Setting(ctx context.Context, key string) (model.Setting, error) {
	setting, err := s.repo.SettingByKey(ctx, key)
	if errors.Is(err, repository.ErrNotFound) {
		return model.Setting{Key: key, Value: json.RawMessage(`{}`), Version: 0}, nil
	}
	return setting, err
}

const maxSettingBytes = 64 << 10

func (s AdminService) SaveSetting(ctx context.Context, key string, value json.RawMessage, version int, userID string) (model.Setting, error) {
	if !model.IsEditableSettingKey(key) {
		return model.Setting{}, validator.New().Add("key", "This setting cannot be edited here.")
	}
	if len(value) == 0 || !json.Valid(value) {
		return model.Setting{}, validator.New().Add("value", "Setting value must be valid JSON.")
	}
	if len(value) > maxSettingBytes {
		return model.Setting{}, validator.New().Add("value", "Setting value is too large.")
	}
	if version < 0 {
		return model.Setting{}, validator.New().Add("version", "A valid version is required.")
	}
	return s.repo.SaveSettingWithVersion(ctx, key, value, version, userID)
}

func (s AdminService) Navigation(ctx context.Context) (model.NavigationMenu, error) {
	setting, err := s.repo.SettingByKey(ctx, model.NavigationSettingKey)
	if errors.Is(err, repository.ErrNotFound) {
		return model.NavigationMenu{Items: model.DefaultMenuItems(), Version: 0}, nil
	}
	if err != nil {
		return model.NavigationMenu{}, err
	}
	items, ok := model.ParseMenuItems(setting.Value)
	if !ok {
		items = model.DefaultMenuItems()
	}
	return model.NavigationMenu{Items: items, Version: setting.Version}, nil
}

func (s AdminService) SaveNavigation(ctx context.Context, input model.NavigationMenu, userID string) (model.NavigationMenu, error) {
	items, verr := normalizeMenuItems(input.Items, 1, map[string]bool{})
	if verr.HasErrors() {
		return model.NavigationMenu{}, verr
	}
	if len(items) == 0 {
		return model.NavigationMenu{}, validator.New().Add("items", "Menu must contain at least one item.")
	}

	value, err := json.Marshal(map[string]any{"items": items})
	if err != nil {
		return model.NavigationMenu{}, err
	}
	setting, err := s.repo.SaveSettingWithVersion(ctx, model.NavigationSettingKey, value, input.Version, userID)
	if err != nil {
		return model.NavigationMenu{}, err
	}
	saved, _ := model.ParseMenuItems(setting.Value)
	return model.NavigationMenu{Items: saved, Version: setting.Version}, nil
}

const menuMaxDepth = 2

func normalizeMenuItems(items []model.MenuItem, depth int, seen map[string]bool) ([]model.MenuItem, validator.ValidationError) {
	v := validator.New()
	out := make([]model.MenuItem, 0, len(items))
	for index, item := range items {
		item.Label = strings.TrimSpace(item.Label)
		item.Href = strings.TrimSpace(item.Href)
		item.PageKey = strings.TrimSpace(item.PageKey)
		if item.ID == "" {
			item.ID = uuid.NewString()
		}
		// Drop duplicate nodes silently — the menu editor can only produce
		// them through bugs, and duplicated ids break drag-and-drop.
		if seen[item.ID] {
			continue
		}
		seen[item.ID] = true
		if item.Label == "" {
			v = v.Add(menuField(depth, index, "label"), "Label is required.")
			continue
		}

		switch item.Kind {
		case "system":
			if !strings.HasPrefix(item.Href, "/") {
				v = v.Add(menuField(depth, index, "href"), "System items need an internal path.")
				continue
			}
		case "page":
			if !validator.Slug(item.PageKey) {
				v = v.Add(menuField(depth, index, "pageKey"), "Page link needs a valid page slug.")
				continue
			}
			item.Href = "/" + item.PageKey
		default:
			item.Kind = "custom"
			if !validMenuHref(item.Href) {
				v = v.Add(menuField(depth, index, "href"), "Link must start with /, http(s)://, mailto: or tel:.")
				continue
			}
		}

		if item.Auto != "services" && item.Auto != "products" {
			item.Auto = ""
		}

		if len(item.Children) > 0 {
			if depth >= menuMaxDepth {
				v = v.Add(menuField(depth, index, "children"), "Menu supports two levels only.")
				continue
			}
			children, childErr := normalizeMenuItems(item.Children, depth+1, seen)
			for field, message := range childErr.Fields {
				v = v.Add(field, message)
			}
			item.Children = children
		}

		out = append(out, item)
	}
	return out, v
}

func validMenuHref(href string) bool {
	return strings.HasPrefix(href, "/") ||
		strings.HasPrefix(href, "http://") ||
		strings.HasPrefix(href, "https://") ||
		strings.HasPrefix(href, "mailto:") ||
		strings.HasPrefix(href, "tel:")
}

func menuField(depth, index int, field string) string {
	return fmt.Sprintf("items[%d][depth %d].%s", index, depth, field)
}

func (s AdminService) ArchivedItems(ctx context.Context, search string) ([]model.ArchivedItem, error) {
	return s.repo.ListArchivedItems(ctx, search)
}

func (s AdminService) RestoreItem(ctx context.Context, itemType, id string) error {
	return s.repo.RestoreItem(ctx, itemType, id)
}

func (s AdminService) HardDeleteItem(ctx context.Context, itemType, id string) error {
	return s.repo.HardDeleteItem(ctx, itemType, id)
}



package service

import (
	"context"
	"encoding/json"
	"errors"
	"strings"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/validator"
)

type PublicService struct {
	repo repository.PublicRepository
}

func NewPublicService(repo repository.PublicRepository) PublicService {
	return PublicService{repo: repo}
}

func (s PublicService) Navigation(ctx context.Context) (model.Navigation, error) {
	nav, err := s.repo.Navigation(ctx)
	if err != nil {
		return model.Navigation{}, err
	}

	items := model.DefaultMenuItems()
	raw, err := s.repo.SettingValue(ctx, model.NavigationSettingKey)
	switch {
	case err == nil:
		if parsed, ok := model.ParseMenuItems(raw); ok {
			items = parsed
		}
	case !errors.Is(err, repository.ErrNotFound):
		return model.Navigation{}, err
	}

	nav.Menu = model.VisibleMenuItems(items)
	return nav, nil
}

func (s PublicService) Page(ctx context.Context, key string) (model.Page, error) {
	return s.repo.PageByKey(ctx, key)
}

// SiteSettings returns the public site settings document ({} when unset).
// Only the whitelisted "site" key is ever exposed publicly.
func (s PublicService) SiteSettings(ctx context.Context) (json.RawMessage, error) {
	raw, err := s.repo.SettingValue(ctx, model.SiteSettingKey)
	if errors.Is(err, repository.ErrNotFound) {
		return json.RawMessage(`{}`), nil
	}
	return raw, err
}

func (s PublicService) Services(ctx context.Context, page, perPage int, search, category, sort string) (model.ListResponse[model.ContentNode], error) {
	return s.repo.ListServices(ctx, page, perPage, search, category, sort)
}

func (s PublicService) ServicesTree(ctx context.Context) ([]model.ContentNode, error) {
	return s.repo.ListContentTree(ctx, "services")
}

func (s PublicService) Service(ctx context.Context, path string) (model.ContentNode, error) {
	return s.repo.ContentByPath(ctx, "services", path)
}

func (s PublicService) Products(ctx context.Context, page, perPage int, search, category, sort string) (model.ListResponse[model.ContentNode], error) {
	return s.repo.ListProducts(ctx, page, perPage, search, category, sort)
}

func (s PublicService) ProductsTree(ctx context.Context) ([]model.ContentNode, error) {
	return s.repo.ListContentTree(ctx, "products")
}

func (s PublicService) Product(ctx context.Context, path string) (model.ContentNode, error) {
	return s.repo.ContentByPath(ctx, "products", path)
}

func (s PublicService) News(ctx context.Context, page, perPage int, search, category, featured, publishedDate, sort string) (model.ListResponse[model.NewsItem], error) {
	return s.repo.ListNews(ctx, page, perPage, search, category, featured, publishedDate, sort)
}

func (s PublicService) NewsItem(ctx context.Context, slug string) (model.NewsItem, error) {
	return s.repo.NewsBySlug(ctx, slug)
}

func (s PublicService) Careers(ctx context.Context, page, perPage int, search, location, department, empType, sort string) (model.ListResponse[model.Career], error) {
	return s.repo.ListCareers(ctx, page, perPage, search, location, department, empType, sort)
}

func (s PublicService) Career(ctx context.Context, slug string) (model.Career, error) {
	return s.repo.CareerBySlug(ctx, slug)
}

func (s PublicService) Pages(ctx context.Context, page, perPage int, search, category, sort string) (model.ListResponse[model.Page], error) {
	return s.repo.ListPages(ctx, page, perPage, search, category, sort)
}

func (s PublicService) Search(ctx context.Context, query string) (map[string]any, error) {
	products, err := s.repo.ListProducts(ctx, 1, 10, query, "", "")
	if err != nil {
		return nil, err
	}
	services, err := s.repo.ListServices(ctx, 1, 10, query, "", "")
	if err != nil {
		return nil, err
	}
	careers, err := s.repo.ListCareers(ctx, 1, 10, query, "", "", "", "")
	if err != nil {
		return nil, err
	}
	news, err := s.repo.ListNews(ctx, 1, 10, query, "", "", "", "")
	if err != nil {
		return nil, err
	}
	pages, err := s.repo.ListPages(ctx, 1, 10, query, "", "")
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"products": products.Data,
		"services": services.Data,
		"careers":  careers.Data,
		"news":     news.Data,
		"pages":    pages.Data,
	}, nil
}

func (s PublicService) CreateContact(ctx context.Context, input model.ContactInput) (model.ContactInquiry, error) {
	v := validator.New()
	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)
	input.Subject = strings.TrimSpace(input.Subject)
	input.Message = strings.TrimSpace(input.Message)
	if !validator.Required(input.Name) {
		v = v.Add("name", "Name is required.")
	}
	if !validator.Email(input.Email) {
		v = v.Add("email", "A valid email is required.")
	}
	if !validator.Required(input.Subject) {
		v = v.Add("subject", "Subject is required.")
	}
	if !validator.Required(input.Message) {
		v = v.Add("message", "Message is required.")
	}
	if v.HasErrors() {
		return model.ContactInquiry{}, v
	}
	return s.repo.CreateContact(ctx, input)
}

package model

import "encoding/json"

const NavigationSettingKey = "navigation"

// MenuItem is one entry in the public site's top navigation tree.
// Kind "system" items map to fixed module routes and cannot be deleted,
// "page" items link to a CMS page by key, and "custom" items hold a free URL.
type MenuItem struct {
	ID       string     `json:"id"`
	Label    string     `json:"label"`
	Href     string     `json:"href,omitempty"`
	Kind     string     `json:"kind"`
	PageKey  string     `json:"pageKey,omitempty"`
	Auto     string     `json:"auto,omitempty"`
	Visible  bool       `json:"visible"`
	Children []MenuItem `json:"children,omitempty"`
}

type NavigationMenu struct {
	Items   []MenuItem `json:"items"`
	Version int        `json:"version"`
}

// DefaultMenuItems mirrors the frontend's built-in navigation so a fresh
// install renders the same menu before an admin ever saves one.
func DefaultMenuItems() []MenuItem {
	return []MenuItem{
		{ID: "home", Label: "Home", Href: "/", Kind: "system", Visible: true},
		{ID: "about", Label: "About Us", Href: "/about", Kind: "system", Visible: true},
		{ID: "services", Label: "Services", Href: "/services", Kind: "system", Auto: "services", Visible: true},
		{ID: "products", Label: "Products", Href: "/products", Kind: "system", Auto: "products", Visible: true},
		{ID: "news", Label: "News", Href: "/news", Kind: "system", Visible: true},
		{ID: "career", Label: "Careers", Href: "/career", Kind: "system", Visible: true},
		{ID: "contact", Label: "Contact Us", Href: "/contact", Kind: "system", Visible: true},
	}
}

func ParseMenuItems(raw json.RawMessage) ([]MenuItem, bool) {
	var stored struct {
		Items []MenuItem `json:"items"`
	}
	if err := json.Unmarshal(raw, &stored); err != nil || len(stored.Items) == 0 {
		return nil, false
	}
	return stored.Items, true
}

// VisibleMenuItems strips hidden entries for public consumption.
func VisibleMenuItems(items []MenuItem) []MenuItem {
	out := make([]MenuItem, 0, len(items))
	for _, item := range items {
		if !item.Visible {
			continue
		}
		item.Children = VisibleMenuItems(item.Children)
		out = append(out, item)
	}
	return out
}

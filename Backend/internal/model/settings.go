package model

// SiteSettingKey stores the global site document (contact info, footer text,
// social links) edited on the admin Site Settings page and served publicly.
const SiteSettingKey = "site"

// editableSettingKeys lists the settings the generic admin settings endpoint
// may write. Navigation is deliberately excluded: it has a dedicated endpoint
// that validates and normalizes the menu tree.
var editableSettingKeys = map[string]bool{
	SiteSettingKey:      true,
	AnalyticsSettingKey: true,
	SecuritySettingKey:  true,
}

// IsEditableSettingKey reports whether the generic settings endpoint may
// write the given key.
func IsEditableSettingKey(key string) bool {
	return editableSettingKeys[key]
}

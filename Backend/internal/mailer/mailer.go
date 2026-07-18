package mailer

import (
	"context"
	"fmt"
	"log/slog"
	"net/smtp"
	"strings"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/config"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
)

type Mailer struct {
	logger *slog.Logger
	cfg    config.Config
}

func New(logger *slog.Logger, cfg config.Config) Mailer {
	return Mailer{logger: logger, cfg: cfg}
}

func (m Mailer) NotifyContact(ctx context.Context, inquiry model.ContactInquiry) error {
	// SMTP integration is intentionally isolated here so contact intake can commit
	// before email delivery; production can swap this for a queue-backed sender.
	m.logger.InfoContext(ctx, "contact inquiry notification queued", "contactId", inquiry.ID, "email", inquiry.Email)
	return nil
}

func (m Mailer) SendInviteCode(ctx context.Context, email, name, code string) error {
	body := fmt.Sprintf(
		"Hello %s,\n\nYou have been invited to MDM CMS.\nYour verification code is: %s\n\nOpen %s/admin/verify-invite to activate your account. This code expires in 30 minutes.",
		name,
		code,
		strings.TrimRight(m.cfg.SiteURL, "/"),
	)
	return m.send(ctx, email, "Your MDM CMS invitation code", body, code)
}

func (m Mailer) SendPasswordResetCode(ctx context.Context, email, name, code string) error {
	body := fmt.Sprintf(
		"Hello %s,\n\nYour MDM CMS password reset code is: %s\n\nOpen %s/admin/reset-password to set a new password. This code expires in 15 minutes.",
		name,
		code,
		strings.TrimRight(m.cfg.SiteURL, "/"),
	)
	return m.send(ctx, email, "Reset your MDM CMS password", body, code)
}

// SendRaw delivers a pre-rendered plain-text email (used by the 2FA flow,
// whose subject/body come from admin-editable templates).
func (m Mailer) SendRaw(ctx context.Context, to, subject, body string) error {
	return m.send(ctx, to, subject, body, "")
}

func (m Mailer) send(ctx context.Context, to, subject, body, code string) error {
	m.logger.InfoContext(ctx, "authentication email queued", "to", to, "subject", subject, "code", code)
	from := emailAddress(m.cfg.EmailFrom)
	message := []byte(fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s\r\n",
		m.cfg.EmailFrom,
		to,
		subject,
		body,
	))
	address := m.cfg.SMTPHost + ":" + m.cfg.SMTPPort
	var auth smtp.Auth
	if m.cfg.SMTPUser != "" {
		auth = smtp.PlainAuth("", m.cfg.SMTPUser, m.cfg.SMTPPassword, m.cfg.SMTPHost)
	}
	return smtp.SendMail(address, auth, from, []string{to}, message)
}

func emailAddress(value string) string {
	if start := strings.LastIndex(value, "<"); start >= 0 {
		if end := strings.LastIndex(value, ">"); end > start {
			return strings.TrimSpace(value[start+1 : end])
		}
	}
	return strings.TrimSpace(value)
}

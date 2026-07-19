package mailer

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/smtp"
	"strings"
	"time"

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
	// Prefer Brevo's HTTP API (port 443) when configured: many hosts (e.g.
	// Render's free tier) block outbound SMTP ports entirely, so plain SMTP
	// silently fails there.
	if m.cfg.BrevoAPIKey != "" {
		return m.sendViaBrevo(ctx, to, subject, body)
	}
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
	// Port 465 speaks implicit TLS (SMTPS): the whole connection is wrapped in
	// TLS from the first byte. Go's smtp.SendMail only knows STARTTLS (587), so
	// dial the TLS socket ourselves. Some hosts (e.g. cPanel/idcloudhosting)
	// have a broken STARTTLS on 587 but a working 465, so this is the fallback.
	if m.cfg.SMTPPort == "465" {
		return m.sendImplicitTLS(address, auth, from, to, message)
	}
	return smtp.SendMail(address, auth, from, []string{to}, message)
}

func (m Mailer) sendImplicitTLS(address string, auth smtp.Auth, from, to string, message []byte) error {
	conn, err := tls.Dial("tcp", address, &tls.Config{ServerName: m.cfg.SMTPHost})
	if err != nil {
		return err
	}
	client, err := smtp.NewClient(conn, m.cfg.SMTPHost)
	if err != nil {
		return err
	}
	defer client.Close()
	if auth != nil {
		if err := client.Auth(tlsAuth{auth}); err != nil {
			return err
		}
	}
	if err := client.Mail(from); err != nil {
		return err
	}
	if err := client.Rcpt(to); err != nil {
		return err
	}
	writer, err := client.Data()
	if err != nil {
		return err
	}
	if _, err := writer.Write(message); err != nil {
		return err
	}
	if err := writer.Close(); err != nil {
		return err
	}
	return client.Quit()
}

// tlsAuth lets PlainAuth proceed over an already-encrypted (implicit-TLS)
// connection. Go's smtp.Client only marks TLS after STARTTLS, so without this
// PlainAuth refuses to send credentials on a 465 socket ("unencrypted
// connection") even though the socket is in fact TLS.
type tlsAuth struct{ smtp.Auth }

func (a tlsAuth) Start(server *smtp.ServerInfo) (string, []byte, error) {
	forced := *server
	forced.TLS = true
	return a.Auth.Start(&forced)
}

func (m Mailer) sendViaBrevo(ctx context.Context, to, subject, body string) error {
	name, email := senderNameEmail(m.cfg.EmailFrom)
	payload := map[string]any{
		"sender":      map[string]string{"name": name, "email": email},
		"to":          []map[string]string{{"email": to}},
		"subject":     subject,
		"textContent": body,
	}
	buf, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	reqCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(reqCtx, http.MethodPost, "https://api.brevo.com/v3/smtp/email", bytes.NewReader(buf))
	if err != nil {
		return err
	}
	req.Header.Set("api-key", m.cfg.BrevoAPIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		snippet, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return fmt.Errorf("brevo send failed: status %d: %s", resp.StatusCode, strings.TrimSpace(string(snippet)))
	}
	return nil
}

// senderNameEmail splits an EMAIL_FROM like "MDM CMS <no-reply@x.com>" into its
// display name and bare address; Brevo's API wants them as separate fields.
func senderNameEmail(value string) (name, email string) {
	email = emailAddress(value)
	if start := strings.LastIndex(value, "<"); start >= 0 {
		name = strings.TrimSpace(value[:start])
	}
	if name == "" {
		name = email
	}
	return name, email
}

func emailAddress(value string) string {
	if start := strings.LastIndex(value, "<"); start >= 0 {
		if end := strings.LastIndex(value, ">"); end > start {
			return strings.TrimSpace(value[start+1 : end])
		}
	}
	return strings.TrimSpace(value)
}

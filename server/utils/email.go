package utils

import (
	"fmt"
	"os"
	"bytes"
	"net/smtp"
	"text/template"
)

func SendResetPasswordEmail(recipient string, token string) error {
	// Configure email parameters
	from := os.Getenv("EMAIL")
	password := os.Getenv("EMAIL_PASSWORD")
	to := []string{recipient}
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	// Create auth
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Create subject and mime headers
	subject := "Reset Password"
	mimeHeaders := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	var body bytes.Buffer
	body.Write([]byte(fmt.Sprintf("Subject:%s\n%s\n\n", subject, mimeHeaders)))

	// Create email body
	t, err := template.ParseFiles("./templates/reset-password-email.html")
	if (err != nil) {
		return err
	}
	t.Execute(&body, struct { Token string } { Token: token })

	// Send email
	err = smtp.SendMail(smtpHost + ":" + smtpPort, auth, from, to, body.Bytes())
	return err
}
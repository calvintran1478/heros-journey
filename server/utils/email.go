package utils

import (
	"fmt"
	"log"
	"os"
	"net/smtp"
)

func SendEmail(recipient string, subject string, body string) error {
	// Configure email parameters
	from := os.Getenv("EMAIL")
	password := os.Getenv("EMAIL_PASSWORD")
	to := []string{recipient}
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	// Create auth
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send message
	message := fmt.Sprintf("Subject:%s\r\n\r\n%s", subject, body)
	err := smtp.SendMail(smtpHost + ":" + smtpPort, auth, from, to, []byte(message))
	if err != nil {
		log.Fatal(err)
	}

	return nil
}
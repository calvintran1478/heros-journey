package models

import (
	"gorm.io/gorm"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID uint `json:"id" gorm:"primaryKey;autoIncrement"`
	Email string `json:"email" gorm:"unique;not null"`
	Password string `json:"password" gorm:"not null"`
}

func (user *User) BeforeSave(db *gorm.DB) (err error) {
	// Hash user password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	return nil
}

type RegisterUserInput struct {
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginUserInput struct {
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SendResetPasswordEmailInput struct {
	Email string `json:"email" binding:"required"`
}

type ChangeUserPasswordInput struct {
	Password string `json:"password" binding:"required"`
}
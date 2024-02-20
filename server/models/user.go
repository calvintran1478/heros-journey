package models

import (
	"gorm.io/gorm"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email string `json:"email" gorm:"primaryKey"`
	Password string `json:"password" gorm:"not null"`
}

func (user *User) BeforeCreate(db *gorm.DB) (err error) {
	// Hash user password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	return nil
}

type RegisterInput struct {
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

package controllers

import (
	"heros-journey/server/models"
	"net/http"
	"net/mail"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
)

// POST /register
func Register(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	// Validate input bindings
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check that the email provided is valid
	if _, err := mail.ParseAddress(input.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
		return
	}

	// Check that the password is at least 8 characters
	if len(input.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must contain at least 8 characters"})
		return
	}

	// Register user into the database
	user := models.User{Email: input.Email, Password: input.Password}
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with provided email already exists"})
		return
	}

	c.Status(http.StatusCreated)
}

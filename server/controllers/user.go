package controllers

import (
	"heros-journey/server/models"
	"net/http"
	"net/mail"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"heros-journey/server/utils"
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

// POST /login
func Login(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var err error

	// Validate input bindings
	var input models.LoginInput
	if err = c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Look up user in database
	var user models.User
	if err = db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User with email not found"})
		return
	}

	// Verify user password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	// Generate JWT for the user
	token, err := utils.GenerateToken(user.Email)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

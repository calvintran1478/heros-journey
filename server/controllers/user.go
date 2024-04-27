package controllers

import (
	"heros-journey/server/models"
	"strings"
	"net/http"
	"net/mail"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"heros-journey/server/utils"
)

// POST /api/v1/users
func RegisterUser(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)

	// Validate input bindings
	var input models.RegisterUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check that the email provided is valid
	if _, err := mail.ParseAddress(input.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
		return
	}

	// Check if a user with the email already exists
	var user models.User
	if err := db.Where("email = ?", input.Email).First(&user).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with provided email already exists"})
		return
	}

	// Check that the password is at least 8 characters
	if len(input.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must contain at least 8 characters"})
		return
	}

	// Register user into the database
	user = models.User{Email: input.Email, Password: input.Password}
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}

// POST /api/v1/users/login
func LoginUser(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var err error

	// Validate input bindings
	var input models.LoginUserInput
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
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

// DELETE /api/v1/users
func DeleteUserAccount(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var err error

	// Get user token
	userID, err := utils.ExtractTokenID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Search for user
	var user models.User
	if err = db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User record not found"})
		return
	}

	// Remove user from database
	if err = db.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// POST /api/v1/users/reset-password-email
func SendResetPasswordEmail(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var err error

	// Validate input bindings
	var input models.SendResetPasswordEmailInput
	if err = c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Search for user
	var user models.User
	if err = db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User email not found"})
		return
	}

	// Generate JWT for the user
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// Send email to reset password
	subject := "Reset Password"

	var body strings.Builder
	body.WriteString("Hi, we have received a request to reset your password for your Hero's Journey account.")
	body.WriteString(" To change your password please click on the link below.\n\n")
	body.WriteString(token)	// Will later pass token through a verification link
	body.WriteString("\n\nIf this was not you kindly ignore this message.\n\n")
	body.WriteString("Regards,\nThe Hero's Journey Team")

	if err = utils.SendEmail(input.Email, subject, body.String()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

// PATCH /api/v1/users/password
func ChangeUserPassword(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var err error

	// Validate input bindings
	var input models.ChangeUserPasswordInput
	if err = c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user token
	userID, err := utils.ExtractTokenID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Search for user
	var user models.User
	if err = db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Check that the password is at least 8 characters
	if len(input.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must contain at least 8 characters"})
		return
	}

	// Update user password
	if err = db.Model(&user).Update("password", input.Password).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
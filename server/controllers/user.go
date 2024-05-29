package controllers

import (
	"heros-journey/server/models"
	"heros-journey/server/utils"
	"os"
	"strconv"
	"net/http"
	"net/mail"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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
	accessToken, err := utils.GenerateAccessToken(user.ID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// Add httponly cookie to response, which contains the refresh token
	tokenLifespan, err := strconv.Atoi(os.Getenv("REFRESH_TOKEN_HOUR_LIFESPAN"))
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh-token", refreshToken, tokenLifespan * 3600, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{"token": accessToken})
}

// GET /api/v1/users/token
func RefreshToken(c *gin.Context) {

	// Check if refresh token is present
	tokenString, err := c.Cookie("refresh-token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token required"})
		return
	}

	// Check if the refresh token is expired or invalid
	token, err := utils.ParseToken(tokenString)
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}

	// Generate new access token for the user
	userID, err := utils.ExtractUserID(token)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	accessToken, err := utils.GenerateAccessToken(userID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": accessToken})
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
		c.Status(http.StatusOK)
		return
	}

	// Generate JWT for the user
	token, err := utils.GenerateAccessToken(user.ID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// Send email to reset password
	if err = utils.SendResetPasswordEmail(input.Email, token); err != nil {
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
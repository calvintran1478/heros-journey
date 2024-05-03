package middleware

import (
	"net/http"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"heros-journey/server/utils"
)

func DatabaseMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken := utils.ExtractBearerToken(c)
		if !utils.TokenValid(accessToken) {
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			return
		}
		c.Next()
	}
}
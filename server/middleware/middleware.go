package middleware

import (
	"time"
	"net/http"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
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

func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization", "Access-Control-Allow-Headers", "Access-Control-Request-Method, Access-Control-Request-Headers"},
		ExposeHeaders: []string{"Content-Length", "Access-Control-Allow-Headers", "Access-Control-Request-Method, Access-Control-Request-Headers"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	})
}
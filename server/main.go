package main

import (
	"heros-journey/server/models"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	db := models.SetupModels()

	// Provide db variable to controllers
	router.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	router.Run("localhost:8080")
}

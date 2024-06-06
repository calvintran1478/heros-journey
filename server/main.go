package main

import (
	"heros-journey/server/middleware"
	"heros-journey/server/models"
	"heros-journey/server/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database
	db := models.SetupModels()

	// Initialize router and set up database middleware
	router := gin.Default()
	router.Use(middleware.DatabaseMiddleware(db))

	// Set up CORS middleware
	router.Use(middleware.CORSMiddleware())

	// Create routing groups
	v1 := router.Group("/api/v1")
	routes.AddUserRoutes(v1)

	router.Run("localhost:8080")
}

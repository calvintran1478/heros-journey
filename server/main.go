package main

import (
	"heros-journey/server/controllers"
	"heros-journey/server/middlewares"
	"heros-journey/server/models"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to database
	db := models.SetupModels()

	// Create routing groups and set up middlewares
	router := gin.Default()
	router.Use(middlewares.DatabaseMiddleware(db))

	public := router.Group("/")

	protected := router.Group("/u")
	protected.Use(middlewares.JwtAuthMiddleware())

	// Create endpoint routes
	public.POST("/register", controllers.Register)
	public.POST("/login", controllers.Login)

	protected.DELETE("/deleteAccount", controllers.DeleteAccount)
	protected.PATCH("/changePassword", controllers.ChangePassword)

	router.Run("localhost:8080")
}

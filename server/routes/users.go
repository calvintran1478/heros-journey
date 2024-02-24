package routes

import (
	"github.com/gin-gonic/gin"
	"heros-journey/server/controllers"
	"heros-journey/server/middleware"
)

func AddUserRoutes(rg *gin.RouterGroup) {
	// Public user endpoints
	public := rg.Group("/users")
	public.POST("", controllers.RegisterUser)
	public.POST("/login", controllers.LoginUser)
	public.POST("/reset-password-email", controllers.SendResetPasswordEmail)

	// Protected user endpoints
	protected := rg.Group("/users")
	protected.Use(middleware.JwtAuthMiddleware())
	protected.DELETE("", controllers.DeleteUserAccount)
	protected.PATCH("/password", controllers.ChangeUserPassword)
}
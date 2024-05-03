package routes

import (
	"github.com/gin-gonic/gin"
	"heros-journey/server/controllers"
)

func AddCharacterRoutes(rg *gin.RouterGroup) {
	characters := rg.Group("/characters")
	characters.POST("", controllers.CreateCharacter)
	characters.GET("", controllers.GetCharacters)
	characters.GET(":character-name", controllers.GetCharacter)
	characters.DELETE(":character-name", controllers.DeleteCharacter)
}
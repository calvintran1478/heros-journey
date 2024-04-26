package controllers

import (
	"heros-journey/server/models"
	"heros-journey/server/utils"
	"net/http"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
)

// POST /api/v1/users/characters
func CreateCharacter(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var err error

	// Get user token
	userID, err := utils.ExtractTokenID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Validate input bindings
	var input models.CreateCharacterInput
	if err = c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check that the slot number is valid
	if input.SlotNumber < 1 || input.SlotNumber > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Slot number must be an integer between 1 and 5 inclusive"})
		return
	}

	// Check that the slot is available
	var character_search models.Character
	if err = db.Where("user_id = ? AND slot_number = ?", userID, input.SlotNumber).First(&character_search).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Character at given slot number already exists"})
		return
	}

	// Check that the given character name does not already exist
	if err = db.Where("name = ?", input.CharacterName).First(&character_search).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Character with given name already exists"})
		return
	}

	// Create character for the user
	character := models.Character{
		SlotNumber: input.SlotNumber,
		Name: input.CharacterName,
		UserID: userID,
		Gender: input.Gender,
		HairColour: input.HairColour,
		SkinColour: input.SkinColour,
		EyeColour: input.EyeColour,
		Gold: 20,
		Health: 100,
		Mana: 80,
		Attack: 40,
		Defense: 40,
		Intelligence: 25,
		Speed: 35,
		Luck: 25,
		Dexterity: 25,
		SkillPoints: 20,
	}
	if err = db.Create(&character).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}
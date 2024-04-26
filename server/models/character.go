package models

type Gender string

const (
	Male Gender = "male"
	Female Gender = "female"
)

type HairColour string

const (
	BlackHair HairColour = "black"
	BrownHair HairColour = "brown"
	BlondeHair HairColour = "blonde"
	WhiteHair HairColour = "white"
	GrayHair HairColour = "gray"
)

type SkinColour string

const (
	PaleSkin SkinColour = "pale"
	TanSkin SkinColour = "tan"
	DarkSkin SkinColour = "dark"
)

type EyeColour string

const (
	BlackEye EyeColour = "black"
	BlueEye EyeColour = "blue"
	GreenEye EyeColour = "green"
	SilverEye EyeColour = "silver"
)

type Character struct {
	// Slot number
	SlotNumber int `json:"slot_number" gorm:"check:1 <= slot_number and slot_number <= 5;not null"`

	// Character customization
	Name string `json:"name" gorm:"primaryKey"`
	UserID uint `gorm:"not null"`
	User User `json:"user" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;not null"`
	Gender Gender `json:"gender" gorm:"type:gender;not null"`
	HairColour HairColour `json:"hair_colour" gorm:"type:hair_colour;not null"`
	SkinColour SkinColour `json:"skin_colour" gorm:"type:skin_colour;not null"`
	EyeColour EyeColour `json:"eye_colour" gorm:"type:eye_colour;not null"`

	// Character stats
	Level uint `json:"level" gorm:"check:level >= 1;default:1;not null"`
	Experience float32 `json:"experience" gorm:"check:experience >= 0;default:0;not null"`
	Gold uint `json:"gold" gorm:"check:gold >= 0;default:0;not null"`
	Health uint `json:"health" gorm:"check:health >= 0;not null"`
	Mana uint `json:"mana" gorm:"check:mana >= 0;not null"`
	Attack uint `json:"attack" gorm:"check:attack >= 0;not null"`
	Defense uint `json:"defense" gorm:"check:defense >= 0;not null"`
	Intelligence uint `json:"intelligence" gorm:"check:intelligence >= 0;not null"`
	Speed uint `json:"speed" gorm:"check:speed >= 0;not null"`
	Luck uint `json:"luck" gorm:"check:luck >= 0;not null"`
	Dexterity uint `json:"dexterity" gorm:"check:dexterity >= 0;not null"`
	AbilityPoints uint `json:"ability_points" gorm:"check:ability_points >= 0;default:0;not null"`
	SkillPoints uint `json:"skill_points" gorm:"check:skill_points >= 0;default:0;not null"`

	// Equipment
	HelmetName *string `json:"helmet"`
	BodyArmorName *string `json:"body_armor"`
	LegArmorName *string `json:"leg_armor"`
	BootsName *string `json:"boots"`
	WeaponName *string `json:"weapon"`

	Helmet Armor `gorm:"foreignKey:HelmetName;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	BodyArmor Armor `gorm:"foreignKey:BodyArmorName;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	LegArmor Armor `gorm:"foreignKey:LegArmorName;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Boots Armor `gorm:"foreignKey:BootsName;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Weapon Weapon `gorm:"foreignKey:WeaponName;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`

	// Weapon proficiency
	SwordProficiency uint `json:"sword_proficiency" gorm:"check:sword_proficiency >= 0;default:0;not null"`
	AxeProficiency uint `json:"axe_proficiency" gorm:"check:axe_proficiency >= 0;default:0;not null"`
	SpearProficiency uint `json:"spear_proficiency" gorm:"check:spear_proficiency >= 0;default:0;not null"`
	DaggerProficiency uint `json:"dagger_proficiency" gorm:"check:dagger_proficiency >= 0;default:0;not null"`
	StaffProficiency uint `json:"staff_proficiency" gorm:"check:staff_proficiency >= 0;default:0;not null"`
	BowProficiency uint `json:"bow_proficiency" gorm:"check:bow_proficiency >= 0;default:0;not null"`
}

// Specifies whether a character owns a particular item, and if so, how many
type Inventory struct {
	CharacterName string `json:"character_name" gorm:"primaryKey"`
	ItemName string `json:"item_name" gorm:"primaryKey"`
	Character Character `gorm:"foreignKey:CharacterName;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Item Item `gorm:"foreignKey:ItemName;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Count uint `json:"count" gorm:"check:count >= 1;not null"`
}

type CreateCharacterInput struct {
	SlotNumber int `json:"slot_number" binding:"required"`
	CharacterName string `json:"character_name" binding:"required"`
	Gender Gender `json:"gender" binding:"required"`
	HairColour HairColour `json:"hair_colour" binding:"required"`
	SkinColour SkinColour `json:"skin_colour" binding:"required"`
	EyeColour EyeColour `json:"eye_colour" binding:"required"`
}
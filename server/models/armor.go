package models

type ArmorType string

const (
	Helmet ArmorType = "helmet"
	BodyArmor ArmorType = "body_armor"
	LegArmor ArmorType = "leg_armor"
	Boots ArmorType = "boots"
)

type Armor struct {
	UserID uint `json:"user_id" gorm:"primaryKey"`
	ArmorName string `json:"name" gorm:"primaryKey"`
	Equipment Equipment `gorm:"foreignKey:UserID,ArmorName;references:UserID,EquipmentName;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ArmorType ArmorType `json:"armor_type" gorm:"type:armor_type;not null"`
}
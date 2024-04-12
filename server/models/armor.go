package models

type ArmorType string

const (
	Helmet ArmorType = "helmet"
	BodyArmor ArmorType = "body_armor"
	LegArmor ArmorType = "leg_armor"
	Boots ArmorType = "boots"
)

type Armor struct {
	ArmorName string `json:"armor_name" gorm:"primaryKey"`
	Equipment Equipment `gorm:"foreignKey:ArmorName;references:EquipmentName;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ArmorType ArmorType `json:"armor_type" gorm:"type:armor_type;not null"`
}
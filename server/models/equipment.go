package models

type Equipment struct {
	// Equipment properties
	UserID uint `json:"user_id" gorm:"primaryKey"`
	EquipmentName string `json:"name" gorm:"primaryKey"`
	Item Item `gorm:"ForeignKey:UserID,EquipmentName;References:UserID,ItemName;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	RequiredLevel uint `json:"required_level" gorm:"check:required_level >= 1;not null"`

	// Stat changes
	AttackChange int `json:"attack_change" gorm:"default:0;not null"`
	DefenseChange int `json:"defense_change" gorm:"default:0;not null"`
	MagicalAttackChange int `json:"magical_attack_change" gorm:"default:0;not null"`
	MagicalDefenseChange int `json:"magical_defense_change" gorm:"default:0;not null"`
	SpeedChange int `json:"speed_change" gorm:"default:0;not null"`
	LuckChange int `json:"luck_change" gorm:"default:0;not null"`
	DexterityChange int `json:"dexterity_change" gorm:"default:0;not null"`
}
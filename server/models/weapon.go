package models

type WeaponType string

const (
	Sword WeaponType = "sword"
	Axe WeaponType = "axe"
	Spear WeaponType = "spear"
	Dagger WeaponType = "dagger"
	Staff WeaponType = "staff"
	Bow WeaponType = "bow"
)

type Weapon struct {
	UserID uint `json:"user_id" gorm:"primaryKey"`
	WeaponName string `json:"name" gorm:"primaryKey"`
	Equipment Equipment `gorm:"foreignKey:UserID,WeaponName;references:UserID,EquipmentName;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	WeaponType WeaponType `json:"weapon_type" gorm:"type:weapon_type;not null"`
}
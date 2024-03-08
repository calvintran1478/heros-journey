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
	WeaponName string `json:"weapon_name" gorm:"primaryKey"`
	Equipment Equipment `gorm:"foreignKey:WeaponName;references:EquipmentName;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	WeaponType WeaponType `json:"weapon_type" gorm:"type:weapon_type;not null"`
}
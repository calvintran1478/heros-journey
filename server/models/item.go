package models

type Item struct {
	UserID uint `json:"user_id" gorm:"primaryKey"`
	ItemName string `json:"name" gorm:"primaryKey"`
	User User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Count uint `json:"count" gorm:"check:count >= 1;not null"`
}

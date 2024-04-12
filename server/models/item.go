package models

type Item struct {
	ItemName string `json:"item_name" gorm:"primaryKey"`
}

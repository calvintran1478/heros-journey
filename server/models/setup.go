package models

import (
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
)

func SetupModels() *gorm.DB {
	// Connect to database
	dsn := "host=localhost user=gorm password=gorm dbname=gorm_db port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	return db
}

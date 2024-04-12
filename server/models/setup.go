package models

import (
	"fmt"
	"log"
	"os"
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
	"github.com/joho/godotenv"
)

func SetupModels() *gorm.DB {
	// Load environment file
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Error loading .env file")
	}
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	// Connect to database
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", dbHost, dbUser, dbPassword, dbName, dbPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	// Create enum types
	setupFile, err := os.ReadFile("./database/setup.sql")
	if err != nil {
		log.Fatalf("Error loading SQL setup file")
	}
	db.Exec(string(setupFile))

	// Migrate schemas
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Character{})
	db.AutoMigrate(&Item{})
	db.AutoMigrate(&Inventory{})
	db.AutoMigrate(&Equipment{})
	db.AutoMigrate(&Weapon{})
	db.AutoMigrate(&Armor{})

	return db
}

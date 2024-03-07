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
		panic("failed to connect to database")
	}

	// Create enum types
	db.Exec("DROP TYPE IF EXISTS gender CASCADE;")
	db.Exec("DROP TYPE IF EXISTS hair_colour CASCADE;")
	db.Exec("DROP TYPE IF EXISTS skin_colour CASCADE;")
	db.Exec("DROP TYPE IF EXISTS eye_colour CASCADE;")
	db.Exec("DROP TYPE IF EXISTS weapon_type CASCADE;")
	db.Exec("DROP TYPE IF EXISTS armor_type CASCADE;")

	db.Exec("CREATE TYPE gender AS ENUM('male', 'female');")
	db.Exec("CREATE TYPE hair_colour AS ENUM('black', 'brown', 'blonde', 'white', 'gray');")
	db.Exec("CREATE TYPE skin_colour AS ENUM('pale', 'tan', 'dark');")
	db.Exec("CREATE TYPE eye_colour AS ENUM('black', 'blue', 'green', 'silver');")
	db.Exec("CREATE TYPE weapon_type AS ENUM('sword', 'axe', 'spear', 'dagger', 'staff', 'bow');")
	db.Exec("CREATE TYPE armor_type AS ENUM('helmet', 'body_armor', 'leg_armor', 'boots');")

	// Migrate schemas
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Character{})
	db.AutoMigrate(&Item{})
	db.AutoMigrate(&Equipment{})
	db.AutoMigrate(&Weapon{})
	db.AutoMigrate(&Armor{})

	return db
}

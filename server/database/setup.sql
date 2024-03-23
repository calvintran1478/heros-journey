-- Create types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
        CREATE TYPE gender AS ENUM('male', 'female');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hair_colour') THEN
        CREATE TYPE hair_colour AS ENUM('black', 'brown', 'blonde', 'white', 'gray');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skin_colour') THEN
        CREATE TYPE skin_colour AS ENUM('pale', 'tan', 'dark');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'eye_colour') THEN
        CREATE TYPE eye_colour AS ENUM('black', 'blue', 'green', 'silver');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weapon_type') THEN
        CREATE TYPE weapon_type AS ENUM('sword', 'axe', 'spear', 'dagger', 'staff', 'bow');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'armor_type') THEN
        CREATE TYPE weapon_type AS ENUM('helmet', 'body_armor', 'leg_armor', 'boots');
    END IF;
END$$;
DROP DATABASE IF EXISTS AuctionSystem;

CREATE DATABASE AuctionSystem;

CREATE TABLE AuctionSystem.Users (
    UserID INTEGER AUTO_INCREMENT,
    Email VARCHAR(64) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(16) UNIQUE,
    FirstName VARCHAR(64),
    LastName VARCHAR(64),
    UserPassword VARCHAR(64) NOT NULL,
    PasswordSalt VARCHAR(32) NOT NULL,
    Permission ENUM("Customer", "Administrator") NOT NULL DEFAULT("Customer"),

    CONSTRAINT PK_User PRIMARY KEY (UserID)
);

CREATE TABLE AuctionSystem.Cars (
    CarID INTEGER AUTO_INCREMENT,
    UserID INTEGER NOT NULL,
    Producent VARCHAR(32) NOT NULL,
    Model VARCHAR(32) NOT NULL,
    YearOfProduction INT NOT NULL,
    Kilometrage INT NOT NULL,
    DriveType ENUM ('RWD', 'FWD', '4WD', 'AWD','2WD') NOT NULL,
    Transmission ENUM ('Automatic' , 'Manual') NOT NULL,
    FuelType ENUM ('Petrol', 'Gasoline', 'Diesel', 'Propane', 'Gas', 'Ethanol', 'Biodiesel', 'Hybrid', 'Electric') NOT NULL,
    TorqueNm INT NOT NULL,
    Cylinders INT NOT NULL,
    EngineLitrage DECIMAL(5,2) NOT NULL,
    Price INTEGER NOT NULL,
    Descr VARCHAR(1024),
    DateAdded DATETIME DEFAULT NOW() NOT NULL,
    ApprovalState ENUM ('Approved', 'Waiting', 'Rejected') NOT NULL DEFAULT("Waiting"),

    CONSTRAINT PK_Car PRIMARY KEY (CarID)
);

CREATE TABLE AuctionSystem.CarsImages(
    ImageID INTEGER AUTO_INCREMENT,
    CarID INTEGER,
    ImagePath VARCHAR(1024) NOT NULL,

    CONSTRAINT PK_CarsImages PRIMARY KEY (ImageID)
);

CREATE TABLE AuctionSystem.UsersImages(
    ImageID INTEGER AUTO_INCREMENT,
    UserID INTEGER,
    ImagePath VARCHAR(1024) NOT NULL,

    CONSTRAINT PK_UsersImages PRIMARY KEY (ImageID)
);
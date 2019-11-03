var car = require("../orm/car");
var carImage = require("../orm/carImage");
var user = require("../orm/user");
var formidable = require("formidable");
var express = require("express");
var router = express.Router();

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

router.post("/addcar", function(req, res, next) {
    var username = req.session.passport.user.username;
    var form = new formidable.IncomingForm();
    var filesArray = [];
    //form.encoding = "binary";
    form.uploadDir = "./storage/images/cars";

    form.addListener("file", (field, file) => {
        filesArray.push({field, file, extension: path.extname(file.name)});
    });

    form.parse(req, (err, fields, files) => {
        user.getUser(username, (result) => {
            var newCar = new Object();
            newCar.Producent = fields.producent;
            newCar.Model = fields.model;
            newCar.YearOfProduction = fields.yearOfProduction;
            newCar.Kilometrage = fields.kilometrage;
            newCar.DriveType = fields.driveType;
            newCar.FuelType = fields.fuelType;
            newCar.Cylinders = fields.numberOfCylinders;
            newCar.EngineLitrage = fields.engineLitrage;
            newCar.Transmission = fields.transmission;
            newCar.TorqueNm = fields.torqueNm;
            newCar.Price = fields.price;
            newCar.Descr = fields.description;
            newCar.UserID = result.UserID;
        
            car.addCar(newCar, (result) => {
                //..
                let carID = result.id;
                console.log(carID);

                for (let file of filesArray) {
                    let filePath = path.dirname(file.file.path);
    
                    let data = fs.readFileSync(file.file.path, { encoding: "base64" });
                    let sha256 = crypto.createHash("sha256");
                    sha256.update(data  + new Date().getMilliseconds());
                    let digest = sha256.digest().toString("hex");
    
                    let newName = digest + file.extension;
                    let newPath = path.resolve(filePath, newName);
                    fs.renameSync(path.resolve(file.file.path), newPath);
                    let newCarImage = {
                        CarID: carID,
                        ImagePath: "./storage/images/cars/" + newName
                    }
                    new carImage.CarImage(newCarImage).save( null, {
                        method: "Insert"
                    }).then((result) => {
                        console.log(result);
                    }).catch((error) => {
                        console.log(error);
                        res.status(500).send("Server internal error");
                    });
                }

                res.redirect("/account");
            }, (error) => {
                console.error(error);
                res.status(500).send("Server internal error");
            });
        }, (error) => {
            console.log(error);
            res.status(500).send("Server internal error");
        });
    });
});

router.post("/editprofile", function(req, res, next) {
    let update = new Object();
    update.email = req.session.passport.user.username;
    update.firstName = req.body.firstName;
    update.lastName = req.body.lastName;
    update.phoneNumber = req.body.phoneNumber;
    console.log(update);
    
    user.updateUser(update, (result) => {
        // . .
        res.redirect("/account");
    }, (error) => {
        res.status(500).send("Server internal error");
    });
});

router.post("/removecar", function(req, res, next) {
    let carID = req.body;
    car.deleteCar(carID, (result) => {
        //..
        res.redirect("/account");
    }, (error) => {
        res.status(500).send("Server internal error");
    });
});

router.get("/getprofileinfo", function(req, res, next) {
    let userData = req.session.passport.user;
    user.getUser(userData.username, (result) => {
        res.send(result);
    }, (error) => {
        res.status(500).send("Server internal error");
    });
});

router.get("/getcarslist", function(req, res, next) {
    let userData = req.session.passport.user;
    user.getUser(userData.username, (resultUser) => {
        car.getCarsByUserId(resultUser.UserID, (resultCarList) => {
            res.status(200).send(resultCarList);
        }, (error) => {
            res.status(500).send("Server internal error");
        });
    }, (error) => {
        res.status(500).send("Server internal error");
    });
});

module.exports = router;
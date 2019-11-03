var car = require("../orm/car");
var router = require("express").Router();

router.get("/getcarslist", function(req, res, next) {
    car.getCarsByStatus("Waiting", (result) => {
        res.status(200).send(result);
    }, (error) => {
        res.status(500).send("Server internal error");
    });
});

router.post("/updatecarstatus", function(req, res, next) {
    let carInfo = req.body;
    car.updateCar(carInfo, (result) => {
        res.redirect("/account");
    }, (error) => {
        res.status(500).send("Server internal error");
    });
});

module.exports = router;
const bookshelf = require("./init.js");

const Car = bookshelf.model("Car", {
    tableName: "Cars",
    idAttribute: "CarID"
});

function addCar(car, processSuccess, processError) {
    new Car(car).save(
        null, { method: "insert" }
    ).then((result) => {
        processSuccess(result);
    }).catch((error) => {
        processError(error);
    });
}

function getCarsByStatus(status, processSuccess, processError) {
    Car.where({ 
        ApprovalState: status 
    }).fetchAll({
        require: false
    }).then((result) => {
        processSuccess(result == null ? result : result.toJSON());
    }).catch((error) => {
        processError(error);
    });
}

function getCarsByUserId(userID, processSuccess, processError) {
    Car.where({
        "UserID" : userID
    }).fetchAll({
        require: false
    }).then((result) => {
        processSuccess(result == null ? result : result.toJSON());
    }).catch((error) => {
        processError(error);
    });
}

function deleteCar(car, processSuccess, processError) {
    Car.where(car).destroy({
        require: false
    }).then((result) => {
        processSuccess(result);
    }).error((error) => {
        processError(error);
    });
}

function updateCar(car, processSuccess, processError) {
    new Car(car).save(
        null, { method: "update" }
    ).then((result) => {
        processSuccess(result);
    }).catch((error) => {
        processError(error);
    });
}

module.exports = {
    Car,
    addCar,
    getCarsByStatus,
    getCarsByUserId,
    deleteCar,
    updateCar
}
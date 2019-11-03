const timer = new (require("./auction-timer"))(45);
const car = require("../orm/car");
const carImage = require("../orm/carImage");

function sendCarList(websocket, carList) {
    let carListInfo = JSON.stringify({
        type: "carList",
        body: carList
    });
    websocket.send(carListInfo);
}

module.exports = (server) => {
    //Query 15 cars from database
    car.Car.where({ 
        ApprovalState: "Approved" 
    }).query((qb) => {
        qb.limit(15);
    }).fetchAll({
        require: false
    }).then(async (result) => {
        //when done, create an auction
        let cars = result.toJSON();

        for (let car of cars) {
            let images = await carImage.CarImage.where({
                CarID: car.CarID
            }).fetchAll({
                require: false
            });

            images = images.toJSON();

            car.images = [];
            for (let image of images) {
                car.images.push(image.ImagePath);
            }
        }
        let currentHighest = 0;
        timer.start();
        
        timer.on("secondPassed", () => {
            server.clients.forEach((client) => {
                var message = JSON.stringify({
                    type: "currentCountdown",
                    body: {
                        countdown: timer.getCountdown()
                    }
                });
                client.send(message);
            });
            console.log(timer.getCountdown());
        });

        timer.on("intervalPassed", () => {
            server.clients.forEach((client) => {
                if (currentHighest == 0) {
                    let message = JSON.stringify({
                        type: "carNotSold",
                        body: null
                    });
                    
                    client.send(message);
                } else {
                    let message = JSON.stringify({
                        type: "carSold",
                        body: null
                    });

                    client.send(message);
                }
            });

            car.deleteCar(cars[0], (result) => {
                //..
            }, (error) => {
                console.log(error);
            });
            cars.splice(0, 1);

            if (cars.length) {
                console.log("next lot, " + cars.length + " remained");
                currentHighest = 0;
                timer.start();
            } else {
                console.log("auction ended");
                timer.stop();
            }
        });

        server.on("connection", (websocket) => {
            sendCarList(websocket, cars);

            websocket.send(JSON.stringify({
                type: "newHighest",
                body: {
                    currentHighest: currentHighest == 0 ? cars[0].Price : currentHighest
                }
            }));
    
            websocket.on("message", (e) => {
                var message = JSON.parse(e);
                if (message.type === "bid") {
                    if (message.body.amount > currentHighest && message.body.amount > cars[0].Price) {
                        timer.reset();
                        currentHighest = message.body.amount;
                        server.clients.forEach((client) => {
                            client.send(JSON.stringify({
                                type: "newHighest",
                                body: {
                                    currentHighest: currentHighest
                                }
                            }));
                        });
                    }
                }
            });

            websocket.on("close", (e) => {
                console.log("closed");
            });
        });
    }, (error) => {
        console.log(error);
    });
}
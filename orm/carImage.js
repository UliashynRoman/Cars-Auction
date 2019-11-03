const bookshelf = require("./init.js");

const CarImage = bookshelf.model("CarImage", {
    idAttribute: "ImageID",
    tableName: "CarsImages"
});

module.exports = {
    CarImage
}
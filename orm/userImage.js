const bookshelf = require("./init.js");

const UserImage = bookshelf.model("UserImage", {
    idAttribute: "ImageID",
    tableName: "UsersImages"
});

module.exports = {
    UserImage
}
const bookshelf = require("./init.js");

const User = bookshelf.model("User", {
    tableName: "Users",
    idAttribute: "UserID"
});

//INSERT INTO
function addUser(user, processSuccess, processError) {
    new User(user).save(
        null, { method: "insert" }
    ).then((result) => {
        processSuccess(result);
    }).catch((error) => {
        processError(error);
    });
}

//SELECT FROM
function getUser(email, processSuccess, processError) {
    User.where({
        "Email" : email
    }).fetch({ 
        require : false
    }).then((result) => {
        processSuccess(result == null ? result : result.toJSON());
    }).catch((error) => {
        processError(error);
    });
}

//UPDATE SET WHERE
function updateUser(user, processSuccess, processError) {
    getUser(user.email, (result) => {
        new User({UserID: result.UserID}).save(
            user, { patch: true }
        ).then((result) => {
            processSuccess(result);
        }).catch((error) => {
            processError(error);
        });
    }, processError);
}

function getUsersList(processSuccess, processError) {
    User.where({}).fetch({
        require: false
    }).then((result) => {
        processSuccess(result == null ? result : result.toJSON());
    }).catch((error) => {
        processError(error);
    });
}

module.exports = {
    User,
    addUser,
    getUser,
    updateUser,
    getUsersList
}
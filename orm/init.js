const knex = require("knex")({
    client: "mysql",
    connection: {
        host     : '127.0.0.1',
        user     : 'root',
        password : 'password',
        database : 'AuctionSystem',
        charset  : 'utf8'
    }
});

const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
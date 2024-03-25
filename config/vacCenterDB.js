const mysql = require('mysql');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ballrockkk107',
    database: 'vaccenter'
});

module.exports = connection;

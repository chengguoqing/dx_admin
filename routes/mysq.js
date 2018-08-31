var express = require('express');
var mysql = require('mysql');
var d_iu = {
    host: 'localhost',
    user: 'root',
    password: 'kiss1001',
    database: 'duxing'
}

exports.sql = function (sql, suc) {
    s_xdf = 0
    lkj_s = 0
    var connection = mysql.createConnection(d_iu)
    connection.connect();
    connection.query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        if (rows) {
            try {
                suc(rows)
            } catch (e) {

            }

        }

    });


    connection.end();
}

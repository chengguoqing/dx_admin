var express = require('express');
var mysql = require('mysql');
var d_iu = {
    host: 'localhost',
    user: 'root',
    password: 'kiss1001',
    database: 'du_xing'
}
var connection = mysql.createConnection(d_iu)
connection.connect();

function sql(sql, suc, res) {

    connection.query(sql, function (err, rows, fields) {
        var sd_drt = {}

        if (err) {
            sd_drt.code = "-1"
            sd_drt.msg = "数据库请求异常"
            sd_drt.err = err
            res.json(sd_drt)

        }
        if (rows) {
            try {
                suc(rows)
            } catch (e) {
                sd_drt.code = "-2"
                sd_drt.msg = "数据格式异常"
                sd_drt.err = err
                res.json(sd_drt)
            }

        }

    });
}

exports.select = function (name, call_back, res) {
    sql("SELECT * FROM " + name, function (data) {
        var data_e = {}
        data_e.code = 0
        data_e.msg = "请求成功"
        data_e.data = data
        call_back(data_e)
    }, res)
}
/**
调用示列
user=表名
user_info json对象

  dx_sql.add('user',user_info, function () {

    }, res)
**/
exports.add = function (name, from_ert, call_back, res) {
    var sd_zsd_a = [],
        sd_zsd_b = []
    for (var key in from_ert) {
        if (from_ert[key]) {
            sd_zsd_a.push(key)
            sd_zsd_b.push('"' + from_ert[key] + '"')
        }
    }
    sd_zsd_a = sd_zsd_a.join(",")
    sd_zsd_b = sd_zsd_b.join(",")
    sql(`INSERT INTO ${name} (${sd_zsd_a}) VALUES(${sd_zsd_b})`, function (data) {
        var data_e = {}
        data_e.code = 0
        data_e.msg = "添加成功"
        res.json(data_e)
        call_back(data_e)
    }, res)
}

exports.xiugai = function (name, from_ert, where, res) {
    var sd_zsd_c = []
    for (var key in from_ert) {
        if (from_ert[key]) {
            sd_zsd_c.push(key + '="' + from_ert[key] + '"')
        }
    }
    sd_zsd_c = sd_zsd_c.join(",");

    sql(`UPDATE ${name}  SET ${sd_zsd_c} WHERE ${where}`, function (data) {
        var data_e = {}
        data_e.code = 0
        data_e.msg = "修改成功"
        res.json(data_e)
    })
}

exports.sql = sql

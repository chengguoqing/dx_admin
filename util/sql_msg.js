var express = require('express');
var comm = require('../routes/comm');
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

exports.select = function (name, res) {
    sql("SELECT * FROM " + name + " ORDER BY id DESC", function (data) {
        var data_e = {}
        data_e.code = 0
        data_e.msg = "请求成功"
        data_e.data = data
        res.json(data_e)
    }, res)
}
exports.select_w = function (name, from_ert, res, call_back) {
    from_ert = comm.parseParam(from_ert, 1)

    sql(`SELECT * FROM  ${name}   WHERE ${from_ert} ORDER BY id DESC`, function (data) {
        var data_e = {}
        data_e.code = 0
        data_e.msg = "请求成功"
        data_e.data = data

        if (data.length <= 0) {
            data_e.code = -1
            data_e.msg = "数据为空！"
            res.json(data_e)
            return
        }

        try {
            call_back(data[0])
        } catch (e) {
            res.json(data_e)
        }


    })
}
exports.del_w = function (name, from_ert, res) {
    from_ert = comm.parseParam(from_ert)

    sql(`DELETE FROM ${name} WHERE ${from_ert}`, function (data) {
        var data_e = {}
        data_e.code = 0
        data_e.msg = "删除成功！"
        data_e.data = data
        res.json(data_e)
    })
}


/**
调用示列
user=表名
user_info json对象

  dx_sql.add('user',user_info, function () {

    }, res)
**/
exports.add = function (name, from_ert, res, callback) {
    var sd_zsd_a = [],
        sd_zsd_b = []
    for (var key in from_ert) {

        sd_zsd_a.push(key)
        sd_zsd_b.push('"' + from_ert[key] + '"')

    }
    sd_zsd_a = sd_zsd_a.join(",")
    sd_zsd_b = sd_zsd_b.join(",")
    sql(`INSERT INTO ${name} (${sd_zsd_a}) VALUES(${sd_zsd_b})`, function (data) {
        var data_e = {}

        try {
            callback()
        } catch (e) {
            data_e.code = 0
            data_e.msg = "添加成功"
            res.json(data_e)
        }


    }, res)
}




/**
    var user_info = {}
    user_info.hyy = req.body.hyy
    user_info.jiesao = req.body.jiesao
    user_info.phone = req.body.phone
    user_info.weixin = req.body.weixin
    user_info.fengmian = req.body.fengmian
    user_info.banner = req.body.banner 
    dx_sql.xiugai('user', user_info, 'id=1', res)
**/

exports.xiugai = function (name, from_ert, where, res) {
    var sd_zsd_c = []
    for (var key in from_ert) {

        sd_zsd_c.push(key + '="' + from_ert[key] + '"')

    }
    sd_zsd_c = sd_zsd_c.join(",");
    console.log(`UPDATE ${name}  SET ${sd_zsd_c} WHERE ${where}`);

    sql(`UPDATE ${name}  SET ${sd_zsd_c} WHERE ${where}`, function (data) {
        var data_e = {}
        data_e.code = 0
        data_e.msg = "修改成功"
        res.json(data_e)
    })
}

exports.sql = sql

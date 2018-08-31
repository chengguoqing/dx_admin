var fs = require('fs');
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var request = require('request');
var comm = require('./comm');
var dx_sql = require('../util/sql_msg');
var tengxun_sc = require('../util/tengxun_sc');

var url_er = "http://localhost:8084"
router.get('/', function (req, res, next) {
    dx_sql.select('USER33', function (data) {
        res.json(data)
    }, res)
})

//设置店主的信息
router.post('/set_user', function (req, res, next) {
    var user_info = {}
    user_info.hyy = req.body.hyy
    user_info.jiesao = req.body.jiesao
    user_info.phone = req.body.phone
    user_info.weixin = req.body.weixin
    user_info.fengmian = req.body.fengmian
    user_info.banner = req.body.banner
    dx_sql.xiugai('user', user_info, 'id=1', res)
})




//上传图片
router.post('/up_img', function (req, res, next) {
    //    let msg
    var zt = {}
    zt.code = 0
    comm.up_img(req, res, function (data) {
        var path_s = data.replace(/\\/g, "/");
        zt.msg = "请求成功"
        //        zt.data =url_er+ path_s

        tengxun_sc.test_up(path_s.split("uploads/")[1], function (data_er) {
            zt.data = data_er
            res.json(zt)
        })

    })
})


module.exports = router;

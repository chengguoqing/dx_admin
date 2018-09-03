var fs = require('fs');
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var request = require('request');
var comm = require('./comm');
var dx_sql = require('../util/sql_msg');
var tengxun_sc = require('../util/tengxun_sc');
var token = require('../util/token');
var url_er = "http://localhost:8084"
router.get('/', function (req, res, next) {
    dx_sql.select('USER33', function (data) {
        res.json(data)
    }, res)
})
//登录
router.post('/load_in', function (req, res, next) {
    delete req.body.token;
    console.log(req.body);
    dx_sql.select_w('user', req.body, res, function (data) {
        let tome = {}
        tome.code = 0
        tome.msg = "登录成功"
        tome.token = token.createToken(data)
        res.json(tome)

    })
})
//退出登录
router.post('/out_load_in', function (req, res, next) {
//    let sd_drt=req.body.token
//    token.checkToken(req.body.token)
//        let tome = {}
//        tome.code = 0
//        tome.msg = "退出登录成功!"
//        res.json(tome)
  


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
    user_info.user_password = req.body.user_password
    dx_sql.xiugai('user', user_info, 'id=1', res)
})
//获取店主的信息
router.get('/get_user', function (req, res, next) {
    dx_sql.select('user', res)
})

//添加产品
router.post('/add_cp', function (req, res, next) {
    var add_cping = {
        fengmian: req.body.fengmian, //封面
        leixing: req.body.leixing, //类型
        leixing_text: req.body.leixing_text, //类型中文
        title: req.body.title, //标题
        jiner: req.body.jiner, //金额
        wangpan: req.body.wangpan, //网盘地址
        xiangqing: req.body.xiangqing,
        add_time: new Date().getTime()
    }
    dx_sql.add("dx_xiangqing", add_cping, res)
})
//获取产品
router.post('/get_cp', function (req, res, next) {
    dx_sql.select('dx_xiangqing', res)
})
//获取产品_加条件 
router.post('/get_cp_w', function (req, res, next) {
    delete req.body.token;
    dx_sql.select_w('dx_xiangqing', req.body, res)
})


//修改产品
router.post('/xiugai_cp_w', function (req, res, next) {
    var add_cping = {
        fengmian: req.body.fengmian, //封面
        leixing: req.body.leixing, //类型
        leixing_text: req.body.leixing_text, //类型中文
        title: req.body.title, //标题
        jiner: req.body.jiner, //金额
        wangpan: req.body.wangpan, //网盘地址
        xiangqing: req.body.xiangqing,
        add_time: new Date().getTime()
    }

    dx_sql.xiugai('dx_xiangqing', add_cping, 'id=' + req.body.id, res)
})

//删除产品
router.post('/delect_er', function (req, res, next) {
       delete req.body.token;
    dx_sql.del_w("dx_xiangqing", req.body, res)
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

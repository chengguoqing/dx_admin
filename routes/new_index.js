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
/**
 * @api {post} /load_in 后台登录
 * @apiGroup admin
 *
 * @apiParam {String} phone 用户的电话 
 * @apiParam {String} user_password 用户的密码
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 
 */

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
/**
 * @api {post} /set_user 设置店主的信息
 * @apiGroup admin
 *
 * @apiParam {String} hyy 欢迎语.
 * @apiParam {String} jiesao 介绍语.
* @apiParam {String} phone 电话.
* @apiParam {String} weixin 微信.
* @apiParam {String} fengmian 封面.
* @apiParam {String} banner 轮播图.
* @apiParam {String} user_password 登录密码.
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 
 */
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
/**
 * @api {get} /get_user 获取店主的信息
 * @apiGroup admin
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 
  * @apiSuccess {Object[]} data 数据.
  * @apiSuccess {String} data.hyy 欢迎语.
 * @apiSuccess {String} data.jiesao 介绍语.
* @apiSuccess {String} data.phone 电话.
* @apiSuccess {String} data.weixin 微信.
* @apiSuccess {String} data.fengmian 封面.
* @apiSuccess {String} data.banner 轮播图.
* @apiSuccess {String} data.user_password 登录密码.
 
 */
router.get('/get_user', function (req, res, next) {
    dx_sql.select('user', res)
})


/**
 * @api {post} /add_cp 添加产品
 * @apiGroup admin
 *
 * @apiParam {String} fengmian 封面
 * @apiParam {String} leixing 类型 1pc 2手机 3app
 * @apiParam {String} leixing_text 类型中文
 * @apiParam {String} title 标题
 * @apiParam {String} jiner 金额
 * @apiParam {String} wangpan 网盘地址
 * @apiParam {String} xiangqing 详情
 * @apiParam {String} yuexiaoliang 月销量
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 
 */

router.post('/add_cp', function (req, res, next) {
    var add_cping = {
        fengmian: req.body.fengmian, //封面
        leixing: req.body.leixing, //类型
        leixing_text: req.body.leixing_text, //类型中文
        title: req.body.title, //标题
        jiner: req.body.jiner, //金额
        wangpan: req.body.wangpan, //网盘地址
        xiangqing: req.body.xiangqing,
        is_index: 0,
        yuexiaoliang: req.body.yuexiaoliang,
        add_time: new Date().getTime()
    }
    dx_sql.add("dx_xiangqing", add_cping, res)
})

/**
 * @api {post} /get_cp 获取所有产品
 * @apiGroup admin
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 * @apiSuccess {Object[]} data 数据
 * @apiSuccess {String} data.fengmian 封面
 * @apiSuccess {String} data.leixing 类型 1pc 2手机 3app
 * @apiSuccess {String} data.leixing_text 类型中文
 * @apiSuccess {String} data.title 标题
 * @apiSuccess {String} data.jiner 金额
 * @apiSuccess {String} data.wangpan 网盘地址
 * @apiSuccess {String} data.xiangqing 详情
 * @apiSuccess {String} data.yuexiaoliang 月销量
 */


router.post('/get_cp', function (req, res, next) {
    dx_sql.select('dx_xiangqing', res)
})

/**
 * @api {post} /get_cp_w 获取产品 加条件的
 * @apiGroup admin
 * @apiParam {String} id 产品id
 * @apiParam {String} leixing 类型 1pc 2手机 3app
 * @apiParam {String} is_index 是否首页推荐 0不是 1是
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 * @apiSuccess {Object[]} data 数据
 * @apiSuccess {String} data.fengmian 封面
 * @apiSuccess {String} data.leixing 类型 1pc 2手机 3app
 * @apiSuccess {String} data.leixing_text 类型中文
 * @apiSuccess {String} data.title 标题
 * @apiSuccess {String} data.jiner 金额
 * @apiSuccess {String} data.wangpan 网盘地址
 * @apiSuccess {String} data.xiangqing 详情
 * @apiSuccess {String} data.yuexiaoliang 月销量
 */


//获取产品_加条件 
router.post('/get_cp_w', function (req, res, next) {
    delete req.body.token;
    dx_sql.select_w('dx_xiangqing', req.body, res)
})





/**
 * @api {post} /get_cp_w 修改产品
 * @apiGroup admin
 * @apiParam {String} id 产品id
 * @apiParam {String} type type=1设置首页推荐
 * @apiParam {String} fengmian 封面
 * @apiParam {String} leixing 类型 1pc 2手机 3app
 * @apiParam {String} leixing_text 类型中文
 * @apiParam {String} title 标题
 * @apiParam {String} jiner 金额
 * @apiParam {String} wangpan 网盘地址
 * @apiParam {String} xiangqing 详情
 * @apiParam {String} yuexiaoliang 月销量
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 * @apiSuccess {Object[]} data 数据
 * @apiSuccess {String} data.fengmian 封面
 * @apiSuccess {String} data.leixing 类型 1pc 2手机 3app
 * @apiSuccess {String} data.leixing_text 类型中文
 * @apiSuccess {String} data.title 标题
 * @apiSuccess {String} data.jiner 金额
 * @apiSuccess {String} data.wangpan 网盘地址
 * @apiSuccess {String} data.xiangqing 详情
 * @apiSuccess {String} data.yuexiaoliang 月销量
 */

router.post('/xiugai_cp_w', function (req, res, next) {
    var add_cping = {
        fengmian: req.body.fengmian, //封面
        leixing: req.body.leixing, //类型
        leixing_text: req.body.leixing_text, //类型中文
        title: req.body.title, //标题
        jiner: req.body.jiner, //金额 
        wangpan: req.body.wangpan, //网盘地址
        xiangqing: req.body.xiangqing,
        yuexiaoliang: req.body.yuexiaoliang,
        add_time: new Date().getTime()
    }
    if (req.body.type == 1) {
        add_cping = {
            is_index: req.body.is_index || 0
        }

    }
    console.log(add_cping);
    dx_sql.xiugai('dx_xiangqing', add_cping, 'id=' + req.body.id, res)
})


/**
 * @api {post} /delect_er 删除产品
 * @apiGroup admin
 *
 * @apiParam {String} id 产品id
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 
 */

router.post('/delect_er', function (req, res, next) {
    delete req.body.token;
    dx_sql.del_w("dx_xiangqing", req.body, res)
})

/**
 * @api {post} /up_img 上传图片到腾讯云
 * @apiGroup util
 *
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} data  图片数据.
 
 */

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



//添加需求
/**
 * @api {post} /add_xuqiu 添加需求
 * @apiGroup qianduan
 *
 * @apiParam {String} phone 电话
* @apiParam {String} weixin 微信
* @apiParam {String} xuqiu 需求
* @apiParam {String} user_id 用户id
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
 
 */
router.post('/add_xuqiu', function (req, res, next) {
    var add_cping = {
        phone: req.body.phone, //电话
        weixin: req.body.weixin, //微信
        xuqiu: req.body.xuqiu, //需求
        addtime: new Date().getTime(), //添加时间
        user_id: req.body.user_id
    }
    dx_sql.add("chakandingdan", add_cping, res)
})
//获取需求
/**
 * @api {post} /add_xuqiu 获取需求
 * @apiGroup admin
 *
 
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数.
   * @apiSuccess {Object[]} data 数据
  * @apiSuccess {String} data.phone 电话
  * @apiSuccess {String} data.weixin 微信
   * @apiSuccess {String} data.xuqiu 需求
    * @apiSuccess {String} data.user_id 用户id
 
 */
router.post('/get_xuqiu', function (req, res, next) {
    dx_sql.select('chakandingdan', res)
})
/**
 * @api {post} /add_xuqiu 设置需求的状态为已读
 * @apiGroup admin
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * @apiSuccess {String} token  验证接口的参数
 
 */
router.post('/xiugai_xuqiu', function (req, res, next) {
    dx_sql.xiugai('chakandingdan', {
            type: 1
        }, `id=${req.body.id}`,
        res)
})



module.exports = router;

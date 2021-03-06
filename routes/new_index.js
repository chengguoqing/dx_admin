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
var md5 = require('md5');
var xml2js = require('xml2js');
var appid = "wx30f2eb708506f491",
    secret = "62f7139e7b7df7f69bdd0b330b60c8b3"

router.get('/', function (req, res, next) {
    dx_sql.select('USER33', function (data) {
        res.json(data)
    }, res)
})
//小程序
router.post('/wx_load', function (req, res, next) {
    request({
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${req.body.code}&grant_type=authorization_code`,
        method: 'get'
    }, function (err, response, body) {

        res.json(body)

    });

})



//登录
/**
 * @api {post} /load_in 后台登录
 * @apiGroup admin
* @apiParam {String} token token(必填)
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
* @apiParam {String} token token(必填)
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
 * 
 
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
* @apiParam {String} token token(必填)
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * 
 
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
* @apiParam {String} token token(必填)
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
 * 
 
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
 * @apiParam {String} token token(必填)
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * 
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
 * @api {post} /get_cp_w 获取产品_加条件
 * @apiGroup admin
 * @apiParam {String} token token(必填)
 * @apiParam {String} id 产品id
 * @apiParam {String} leixing 类型 1pc 2手机 3app
 * @apiParam {String} is_index 是否首页推荐 0不是 1是
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * 
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
 * @api {post} /xiugai_cp_w 修改产品
 * @apiGroup admin
 * @apiParam {String} token token(必填)
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
 * 
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
* @apiParam {String} token token(必填)
 * @apiParam {String} id 产品id(必填)
 *
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * 
 
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
 * 
 
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

 * @apiParam {String} token token(必填)
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * 
   * @apiSuccess {Object[]} data 数据
  * @apiSuccess {String} data.phone 电话
  * @apiSuccess {String} data.weixin 微信
   * @apiSuccess {String} data.xuqiu 需求
    * @apiSuccess {String} data.user_id 用户id
 
 */
router.post('/get_xuqiu', function (req, res, next) {
    dx_sql.select('chakandingdan', res)
})



//获取需求 单用户的需求
/**
 * @api {post} /add_xuqiu 获取需求
 * @apiGroup admin

 * @apiParam {String} token token(必填)
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} msg  状态信息.
 * 
   * @apiSuccess {Object[]} data 数据
  * @apiSuccess {String} data.phone 电话
  * @apiSuccess {String} data.weixin 微信
   * @apiSuccess {String} data.xuqiu 需求
    * @apiSuccess {String} data.user_id 用户id
 
 */
router.post('/get_xuqiu_w', function (req, res, next) {
    dx_sql.select_w('chakandingdan', req.body, res)
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


//删除需求

router.post('/del_xuqiu', function (req, res, next) {
    delete req.body.token;
    dx_sql.del_w("chakandingdan", req.body, res)
})




//购买产品
router.post('/gm_cp_sd', function (req, res, next) {
    var add_cping = {
        fengmian: req.body.fengmian, //封面
        title: req.body.title, //标题
        jiner: req.body.jiner, //金额
        openid: req.body.openid,
        add_time: new Date().getTime()
    }
    dx_sql.add("gm_cp", add_cping, res)
})

//获取产品
router.post('/get_cp_sd', function (req, res, next) {
    dx_sql.select_w('gm_cp', req.body, res)
})

//获取所有产品
router.post('/get_cp_sd_sy', function (req, res, next) {
    dx_sql.select('gm_cp', res)
})

//删除购买的产品

router.post('/del_cmcp', function (req, res, next) {
    delete req.body.token;
    dx_sql.del_w("gm_cp", req.body, res)
})


router.get("/qianming", function (req, res, next) {
    var sd_sdf = {},
        timeStamp = String(new Date().getTime());
    sd_sdf.appid = "wx30f2eb708506f491"
    sd_sdf.mch_id = "1491259172"
    sd_sdf.body = "独行工匠"
    sd_sdf.timeStamp = timeStamp
    sd_sdf.nonce_str = comm.randomString()
    sd_sdf.out_trade_no = new Date().getTime()
    sd_sdf.total_fee = req.query.jiner * 100
    sd_sdf.spbill_create_ip = "218.17.251.186"
    sd_sdf.trade_type = "JSAPI"
    sd_sdf.notify_url = "http://duxinggj.com/"
    sd_sdf.openid = req.query.openid
    var stringA = Object.keys(sd_sdf),
        s_sdfs = ""
    stringA.sort()
    stringA.map(function (a) {
        s_sdfs += "&" + a + "=" + sd_sdf[a]
    })
    s_sdfs = s_sdfs.substring(1, s_sdfs.length)
    var stringSignTemp = s_sdfs + "&key=5E1B3F82F1D5CAA0C62DD42E6DAAACD4" //key为商户平台设置的密钥key
    var s = md5(stringSignTemp).toUpperCase()
    sd_sdf.sign = s

    var ssd_srr = res
    request({
        url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
        method: 'POST',
        body: comm.buildXML(sd_sdf)
    }, function (err, response, body) {
        xml2js.parseString(body, {
            explicitArray: false
        }, function (err, json) {
            console.log(json);
            let sd_das = json.xml,
                sd_drtsae = {}
            sd_drtsae.appId = sd_das.appid;
            sd_drtsae.nonceStr = sd_das.nonce_str;
            sd_drtsae.package = "prepay_id=" + sd_das.prepay_id
            sd_drtsae.signType = "MD5"
            sd_drtsae.timeStamp = timeStamp;
            sd_drtsae.key = "5E1B3F82F1D5CAA0C62DD42E6DAAACD4"
            console.log(comm.zx(sd_drtsae))
            sd_drtsae.paySign = md5(comm.zx(sd_drtsae))
            ssd_srr.end(JSON.stringify(sd_drtsae))
        });
    });
})



module.exports = router;

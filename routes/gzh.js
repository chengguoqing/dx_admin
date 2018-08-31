var fs = require('fs');
var express = require('express');
var router = express.Router(),
    sha1 = require('sha1'),
    cache = require('memory-cache'),
    comm = require('./comm');
var md5 = require('md5');
var request = require('request');
var xml2js = require('xml2js');
var appid = 'wxf8b0c920900b2663',
    secret = 'ccf8c624ec6613843ca3087371cea5b9',
    ticketUrl = "https://api.weixin.qq.com/cgi-bin/token",
    jsapi_ticket = "http://api.weixin.qq.com/cgi-bin/ticket/getticket",
    cache_duration = 1000 * 60 * 60 * 24, //缓存时长为24小时
    shkey = "EBMscpCKkn2znrfsMMCrweBGTCGDDrpR"
router.get('/test_w', function (req, res, next) {
    var qiurl = ticketUrl + `?grant_type=client_credential&appid=${appid}&secret=${secret}`,
        xsd_sd = req.query.sd_us
    res.header("Access-Control-Allow-Origin", "*"); //跨域
    if (cache.get('ticket')) {
        var sd_drtsae = kh_sd(cache.get('ticket'), xsd_sd)
        sd_drtsae.hc = true
        res.end(JSON.stringify(sd_drtsae))
    } else {
        request(qiurl, function (error, resp, json) {
            var ticketMap = JSON.parse(json);
            var jsapi = jsapi_ticket + "?type=jsapi&access_token=" + ticketMap.access_token
            request(jsapi, function (error, resp, jsoner) {
                var token_oe = JSON.parse(jsoner)
                if (token_oe.errcode != 0) {
                    res.end(jsoner)
                    return
                }
                cache.put('ticket', token_oe.ticket, cache_duration); //加入缓存
                var sd_drtsae = kh_sd(token_oe.ticket, xsd_sd)
                sd_drtsae.hc = false
                res.end(JSON.stringify(sd_drtsae))
            })
        })
    }

})
router.get('/zhifu', function (req, res, next) { //支付
    var code = req.query.code
    var url_sd = "https://api.weixin.qq.com/sns/oauth2/access_token" + `?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
    request(url_sd, function (error, resp, open_id) {
        var open_z_id=JSON.parse(open_id)
        var openid =  open_z_id.openid

        var sd_sdf = {},
            timeStamp = String(new Date().getTime());
        sd_sdf.appid = appid
        sd_sdf.mch_id = "1497380712"
        sd_sdf.nonce_str = comm.randomString()
        sd_sdf.body = "独行工匠工作室"
        sd_sdf.out_trade_no = new Date().getTime()
        sd_sdf.total_fee = req.query.jiner * 100
        sd_sdf.spbill_create_ip = "119.29.187.203"
        sd_sdf.notify_url = "http://www.duxinggj.com/phone/dx"
        sd_sdf.trade_type = "JSAPI"

        sd_sdf.openid = openid
        var stringA = Object.keys(sd_sdf),
            s_sdfs = ""
        stringA.sort()
        stringA.map(function (a) {
            s_sdfs += "&" + a + "=" + sd_sdf[a]
        })
        s_sdfs = s_sdfs.substring(1, s_sdfs.length)

        var stringSignTemp = s_sdfs + "&key=" + shkey //key为商户平台设置的密钥key
        var s = md5(stringSignTemp).toUpperCase()
        sd_sdf.sign = s
        console.log(stringSignTemp)
        var ssd_srr = res
        var sd_sr_ser = comm.buildXML(sd_sdf)
           console.log(sd_sr_ser)
        request({
            url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
            method: 'POST',
            body:  comm.buildXML(sd_sdf)
        }, function (err, response, body) {
            xml2js.parseString(body, {
                explicitArray: false
            }, function (err, json) {
                let sd_das = json.xml,
                    sd_drtsae = {}
                console.log(JSON.stringify(json))
                sd_drtsae.appId = appid;
                sd_drtsae.nonceStr = comm.randomString();
                sd_drtsae.package = "prepay_id=" + sd_das.prepay_id
                sd_drtsae.signType = "MD5"
                sd_drtsae.timeStamp = timeStamp;
                sd_drtsae.key = shkey
                sd_drtsae.paySign = md5(comm.zx(sd_drtsae))
                ssd_srr.end(JSON.stringify(sd_drtsae))
            });


        })

    })
})



//验证 服务器配置(已启用)

exports.getToken = function (url, callback) {
    var signature = url.query.signature,
        timestamp = url.query.timestamp,
        nonce = url.query.nonce,
        token = "o665p2sdo",
        echostr = url.query.echostr;


    var sd_derd = []
    sd_derd.push(nonce)
    sd_derd.push(timestamp)
    sd_derd.push(token)
    sd_derd.sort()
    var sd_sertx = ""
    sd_derd.map(function (a) {
        sd_sertx += a
    })
    sd_sertx = sha1(sd_sertx)
    console.log(sd_sertx + "  " + signature)
    var sd_ssrertx = {}
    sd_ssrertx.nonce = nonce
    sd_ssrertx.signature = signature
    sd_ssrertx.timestamp = timestamp
    sd_ssrertx.token = "o665p2sdo"
    if (sd_sertx == signature) {

        callback.send(echostr);

    } else {
        callback.send("失败");
    }

}




function kh_sd(ticket, url) {
    var sd_jh = {}
    sd_jh.appId = appid
    sd_jh.nonceStr = comm.randomString()
    sd_jh.timestamp = Math.floor(Date.now() / 1000) //精确到秒
    sd_jh.jsapi_ticket = ticket
    sd_jh.signature = sha1('jsapi_ticket=' + ticket + '&noncestr=' + sd_jh.nonceStr + '&timestamp=' + sd_jh.timestamp + '&url=' + url);

    return sd_jh;


}

function shiti() {
    var sds_se = {}
    sds_se.appId = appid
    sds_se.timeStamp = Math.floor(Date.now() / 1000) //精确到秒
    sds_se.nonceStr = comm.randomString()
}


module.exports = router;

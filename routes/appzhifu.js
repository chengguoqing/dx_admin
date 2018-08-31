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




router.get('/zhifu', function (req, res, next) { //支付
    var sd_sdf = {},
        timeStamp = String(new Date().getTime());
    sd_sdf.appid = appid
    sd_sdf.mch_id = "1497380712"
    sd_sdf.nonce_str = comm.randomString()
    sd_sdf.body = "独行工匠工作室"
    sd_sdf.out_trade_no = new Date().getTime()
    sd_sdf.total_fee = 10000
    sd_sdf.spbill_create_ip = "119.29.187.203"
    sd_sdf.notify_url = "http://www.duxinggj.com/"
    sd_sdf.trade_type = "APP"

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
        body: comm.buildXML(sd_sdf)
    }, function (err, response, body) {
        xml2js.parseString(body, {
            explicitArray: false
        }, function (err, json) {
            let sd_das = json.xml,
                sd_drtsae = {}
            console.log(JSON.stringify(json))

            ssd_srr.end(JSON.stringify(sd_drtsae))
        });


    })


})




module.exports = router;

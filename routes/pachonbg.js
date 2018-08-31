var fs = require('fs');
var express = require('express');
var router = express.Router(),
    comm = require('./comm');
var request = require('request');
var cheerio = require('cheerio')
router.get('/zhifu', function (req, res, next) { //支付
    res.header("Access-Control-Allow-Origin", "*"); //跨域
    var url_sd = "https://fcw52.com/?mode=async&function=get_block&block_id=list_videos_most_recent_videos&sort_by=post_date_and_rating&from=02&_="+new Date().getTime()
    request(url_sd, function (error, resp, json) {
        $ = cheerio.load(json);
        var sd_sdrt = []
        for (var i = 0; i < $('.item').length; i++) {
            var s_ssd = {}
            s_ssd.title = $('.item').eq(i).find("a").attr("title")
            s_ssd.href = $('.item').eq(i).find("a").attr("href")
            s_ssd.img = $('.thumb.lazy-load').eq(i).attr("data-original")
            sd_sdrt.push(s_ssd)
        }
        res.end(JSON.stringify(sd_sdrt))
    })

})

router.get('/xiangqing', function (req, res, next) { //支付
    var url_e = req.query.url_u
    res.header("Access-Control-Allow-Origin", "*"); //跨域

    request(url_e, function (error, resp, json) {
        $ = cheerio.load(json);
        var src = $(".block-details .item").eq(4).find("a").attr("href")
        var sd_sdrt = {}
        sd_sdrt.src = src
           res.end(JSON.stringify(sd_sdrt))
    })

})

module.exports = router;

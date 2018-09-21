var fs = require('fs');
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var qr = require('qr-image')
var mysql = require('./mysq');
var comm = require('./comm');
var crypto = require('crypto');
var md5 = require('md5');
var request = require('request');
var xml2js = require('xml2js');
var urlToImage = require('url2img');
var sender = require('./SmsSender'); 
sender.config.sdkappid = 1400046691;
sender.config.appkey = '69e8f1574cc92cb690bfa63a8d39a05c';

//验证码集合
let yacode = new Set()
let ur_l = "https://duxinggj.com"

/* 首页. */
router.get('/', function (req, res, next) {
    var banner = ""
    mysql.sql("select * from du_indx", function (data) {
        banner = data[0].banner.split(",")
        var bas_xd = banner.pop(),
            cluo = JSON.parse(data[0].cluo),
            case_li = JSON.parse(data[0].case_li)
        res.render('index', {
            title: '独行工匠',
            banner: banner,
            cluo: cluo,
            case_li: case_li
        });
    })
});
router.get('/erweima', function (req, res, next) {
    let sd_der = "uploads/a" + new Date().getTime() + ".png"
    var e_derts = req.query,
        sd_errt = {}
    console.log(`http://duxinggj.com/erwei_s?baoti=${e_derts.baoti}&tupian=${e_derts.tupian}&name=${e_derts.name}&jiage=${e_derts.jiage}&qc_img=${e_derts.qc_img}`);
    urlToImage(`http://duxinggj.com/erwei_s?baoti=${e_derts.baoti}&tupian=${e_derts.tupian}&name=${e_derts.name}&jiage=${e_derts.jiage}&qc_img=${e_derts.qc_img}`, "public/" + sd_der, {
        width: 526,
        height: 300
    }).then(function (dae) {
        sd_errt.url = "http://duxinggj.com/" + sd_der
        res.end(JSON.stringify(sd_errt))
    }).catch(function (err) {

        sd_errt.url = "http://duxinggj.com/" + sd_der
        res.end(JSON.stringify(sd_errt))
    });



})
router.get('/erwei_s', function (req, res, next) {
    var e_derts = req.query
    res.render("erwei_s", e_derts);
})


/*服务项目*/
router.get('/fuwuxm', function (req, res, next) {
    res.render('fuwuxm')
})
/*关于我们*/
router.get('/guanyu', function (req, res, next) {
    res.render('guanyu')
})

/*提交服务*/
router.get('/tijiao', function (req, res, next) {
    mysql.sql("select fuwu from du_indx", function (data) {
        var fuwu = JSON.parse(data[0].fuwu)
        res.render('tijiao', {
            fuwu: fuwu
        })
    })
})

/*admin*/
router.get('/admin', function (req, res, next) {
    var banner = false
    mysql.sql("select * from du_indx", function (data) {
        if (data[0].banner) {
            banner = data[0].banner.split(",")
            banner.pop()
        }
        var cluo = false,
            case_li = false
        if (data[0].cluo) {
            cluo = JSON.parse(data[0].cluo)
        }
        if (data[0].case_li) {
            case_li = JSON.parse(data[0].case_li)
        }


        console.log(banner + "," + cluo + "," + case_li)
        res.render('admin/index', {
            title: '后台管理',
            banner: banner,
            cluo: cluo,
            case_li: case_li
        });
    })
});

/*服务内容*/
router.get('/admin/fuwu', function (req, res, next) {
    mysql.sql("select fuwu from du_indx", function (data) {
        var fuwu = JSON.parse(data[0].fuwu)
        console.log(fuwu)
        res.render('admin/fuwu', {
            fuwu: fuwu
        });
    })
});
/*需求查看*/
router.get('/admin/xuqiuchakan', function (req, res, next) {
    mysql.sql("select * from du_xuqiu", function (data) {
        res.render('admin/xuqiuchakan', {
            fis_s: data
        });
    })
});


/*小程序登录封面*/
router.get('/admin/dlfm', function (req, res, next) {
    mysql.sql(`SELECT * FROM dx_fm ORDER  BY id DESC LIMIT   1`, function (data) {
        res.render('admin/dlfm', {
            title: "登录封面",
            path: data[0].src
        });
    })

});
router.get('/admin/fmsc', function (req, res, next) {
    var xs = {}
    var banner = ur_l + req.query.banner,
        time = new Date().getTime()
    mysql.sql(`INSERT INTO dx_fm(src,time) VALUES('${banner}','${time}')`, function (data) {
        xs.code = 0
        xs.msg = "添加成功"
        xs.path = banner
        res.send(xs)
    })
});
//获取登录封面
router.get('/getdlfm', function (req, res, next) {
    var xs = {}
    mysql.sql(`SELECT * FROM dx_fm ORDER  BY id DESC LIMIT   1`, function (data) {
        xs.code = 0
        xs.msg = " 获取成功"
        xs.data = data
        res.send(xs)
    })
});

//添加案例
router.post('/addcase', function (req, res, next) {
    var xs = {}
    var fm = ur_l + req.body.fm,
        banner = req.body["banner[]"],
        title = req.body.title,
        jiner = req.body.jiner,
        xq = req.body.xq,
        time = new Date().Format("yyyy-MM-dd hh:mm")
    if (banner instanceof Array) {
        banner.map(function (a, b) {
            banner[b] = ur_l + a
        })
    } else {
        var er_sd = [ur_l + banner]
        banner = er_sd
    }
    console.log(banner)
    mysql.sql(`INSERT INTO dx_xq(fm,banner,title,jiner,xq,time) VALUES('${fm}','${banner}','${title}','${jiner}','${xq}','${time}')`, function (data) {
        xs.code = 0
        xs.msg = "添加成功"
        res.send(xs)
    })
});

//编辑案例
router.post('/bjcase', function (req, res, next) {
    var xs = {}
    var fm = req.body.fm,
        banner = req.body["banner[]"],
        title = req.body.title,
        jiner = req.body.jiner,
        xq = req.body.xq,
        id = req.body.id,
        time = new Date().Format("yyyy-MM-dd hh:mm")

    if (fm.indexOf(ur_l) < 0) {
        ur_l + req.body.fm
    }
    if (banner instanceof Array) {
        banner.map(function (a, b) {
            if (banner[b].indexOf(ur_l) < 0) {
                banner[b] = ur_l + a
            }

        })
    } else {
        if (banner.indexOf(ur_l) < 0) {
            var er_sd = [ur_l + banner]
            banner = er_sd
        }
    }
    mysql.sql(`UPDATE dx_xq  SET fm="${fm}",banner="${banner}",title="${title}",jiner="${jiner}",xq="${xq}",TIME="${time}"  WHERE id=${id}`, function (data) {
        xs.code = 0
        xs.msg = "修改成功"
        res.send(xs)
    })
});



//小程序用户
router.get('/admin/user_cen', function (req, res, next) {
    var xs = {}
    mysql.sql(`SELECT * FROM du_user `, function (data) {
        let sd_dsf = []
        data.map(function (a) {
            var sd_erw = {}
            sd_erw.id = a.id
            sd_erw.phone = a.phone
            sd_erw.nickName = JSON.parse(a.user_info).nickName
            sd_dsf.push(sd_erw)
        })

        res.render('admin/user_cen', {
            title: "用户列表",
            sd_dsf: sd_dsf
        });
    })
})

router.get('/delect', function (req, res, next) {
    var xs = {}
    mysql.sql(`DELETE FROM du_user WHERE id=${req.query.id} `, function (data) {
        xs.code = 0
        xs.msg = " 删除成功"
        xs.data = data
        res.send(xs)
    })
})





//发布案例
router.get('/admin/fabu', function (req, res, next) {

    let id = ""

    id = req.query.id
    mysql.sql(`SELECT * FROM dx_xq where id=${id}`, function (data) {
        data[0].banner = data[0].banner.split(",")
        res.render('admin/fabu', {
            title: "发布案例",
            data: data[0],
            id: id
        });
    })
})


router.get('/admin/addfabu', function (req, res, next) {

    res.render('admin/addfabu', {
        title: "发布案例"
    });


})


//发布列表
router.get('/admin/fabulist', function (req, res, next) {
    mysql.sql(`SELECT * FROM dx_xq ORDER BY id DESC `, function (data) {
        res.render('admin/fabulist', {
            title: "案例列表",
            data: data
        });

    })
})



//删除列表
router.get('/delect_li_s', function (req, res, next) {
    var xs = {}
    mysql.sql(`DELETE FROM dx_xq WHERE id=${req.query.id} `, function (data) {
        xs.code = 0
        xs.msg = " 删除成功"
        xs.data = data
        res.send(xs)
    })
})
//首页banner设置

router.get('/shebanner', function (req, res, next) {
    var xs = {},
        id = req.query.id,
        ty = req.query.ty

    mysql.sql(`UPDATE dx_xq SET lunbo=${ty}  where id=${id}`, function (data) {
        xs.code = 0
        xs.msg = " 修改成功"
        xs.data = data
        res.send(xs)
    })
})





Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}




/*banner上传*/
router.post('/in_banner', function (req, res, next) {
    var xs = {}
    comm.up_img(req, res, function (data) {
        var path_s = data.replace(/\\/g, "/");
        mysql.sql("UPDATE du_indx SET banner=CONCAT(banner,'" + path_s + ",')  where id=1", function (sd_d) {
            xs.code = 0
            xs.msg = " 添加成功"
            xs.path = path_s
            res.send(xs)
        })
    })
});
/*banner删除*/
router.get('/delect_img', function (req, res, next) {
    var xs = {}
    var banner = req.query.banner
    mysql.sql("UPDATE du_indx SET banner='" + banner + "'  where id=1", function (data) {
        xs.code = 0
        xs.msg = " 修改成功"
        res.send(xs)
    })
});


/*我们承若*/
router.get('/chenluo', function (req, res, next) {
    var xs = {}
    var cluo = req.query.cluo
    mysql.sql("UPDATE du_indx SET cluo='" + cluo + "'  where id=1", function (data) {
        xs.code = 0
        xs.msg = " 修改成功"
        res.send(xs)
    })
});


/*图片上传*/
router.post('/upimg', function (req, res, next) {
    var xs = {}
    comm.up_img(req, res, function (data) {
        xs.code = 0
        xs.msg = " 上传成功"
        xs.path = data.replace(/\\/g, "/");
        res.send(xs)
    })
})
/*经典案例*/
router.post('/case_li', function (req, res, next) {
    var xs = {}
    var case_li = req.body.case_li
    mysql.sql("UPDATE du_indx SET case_li='" + case_li + "'  where id=1", function (data) {
        xs.code = 0
        xs.msg = " 修改成功"
        res.send(xs)
    })
});

/*服务内容*/
router.post('/fuwuner', function (req, res, next) {
    var xs = {}
    var fuwu = req.body.fuwu
    mysql.sql("UPDATE du_indx SET fuwu='" + fuwu + "'  where id=1", function (data) {
        xs.code = 0
        xs.msg = " 修改成功"
        res.send(xs)
    })
});

/*提交服务*/
router.get('/du_xuqiu', function (req, res, next) {
    var xs = {}
    var xuqiu = req.query.xuqiu
    mysql.sql('INSERT INTO du_xuqiu(ser_text,ser_name,ser_phone,ser_qq,ser_qixian) VALUES(' + xuqiu + ')', function (data) {
        xs.code = 0
        xs.msg = " 修改成功"
        res.send(xs)
    })
});
/*二维码*/
router.get('/qc_er', function (req, res, next) {
    var text = req.query.text;
    try {
        var img = qr.image(text, {
            size: 10
        });
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>414 Request-URI Too Large</h1>');
    }
});
//router.get('/toten', function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*"); //跨域
//    var sd_sd = {}
//    sd_sd.code = 0;
//    sd_sd.Token = "kiss1001"
//    sd_sd.access_token = "kiss1001"
//    res.end(JSON.stringify(req.query))
//})


 

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

router.get("/kugou", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //跨域
    var timesd_e = new Date().getTime()
    request({
        url: `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${req.query.FileHash}&album_id=${req.query.AlbumID}&_=${timesd_e}`,
        method: 'get'
    }, function (err, response, body) {
        res.end(JSON.stringify(body))
    });
})

router.get("/getopenid", function (req, res, next) {
    var sd_sdfe = {}
    sd_sdfe.appid = "wx30f2eb708506f491"
    sd_sdfe.secret = "1f5e54cbef9f14bacc3702ac65c0414b"
    sd_sdfe.js_code = req.query.code
    sd_sdfe.grant_type = "authorization_code"
    var stringA = Object.keys(sd_sdfe),
        s_sdfs = ""
    stringA.map(function (a) {
        s_sdfs += "&" + a + "=" + sd_sdfe[a]
    })
    s_sdfs = s_sdfs.substring(1, s_sdfs.length),
        sd_dsdr = res
    request({
        url: "https://api.weixin.qq.com/sns/jscode2session?" + s_sdfs,
        method: 'get'
    }, function (err, response, body) {
        sd_dsdr.end(body)
    });

})
router.get("/xhhg_sd", function (req, res, next) {
    var sd_drtsae = {}
    sd_drtsae.appid = 'wx30f2eb708506f491',
        sd_drtsae.timeStamp = new Date().getTime();
    sd_drtsae.nonceStr = comm.randomString()
    sd_drtsae.package = "prepay_id=" + 555
    sd_drtsae.signType = "MD5"
    sd_drtsae.key = "5E1B3F82F1D5CAA0C62DD42E6DAAACD4"
    res.end(comm.zx(sd_drtsae))


})



router.get("/denglu", function (req, res, next) { //发送验证码
    var user_xn = {}
    user_xn.phone = req.query.phone
    user_xn.time = new Date().getTime()
    user_xn.code = comm.randomnum()
    yacode.add(user_xn)
    let s_sdf = {}
    s_sdf.code = 0
    s_sdf.msg = "验证码发送成功！"
    res.end(JSON.stringify(s_sdf))
    sender.singleSmsSend(0, '86', user_xn.phone, '注册验证码为' + 'www.duxinggj.com' + '(90秒内有效)如非本人操作，请忽略本短信');

})
router.get("/huoquw", function (req, res, next) { //绑定
    let sd_df = {},
        re_s = res
    var sd_sdf = ""
    for (let item of yacode.keys()) {
        if (new Date().getTime() - item.time > 90000) {
            yacode.delete(item)
        } else {
            if (item.phone == req.query.phone) {
                sd_sdf = item.code
            }
        }
    }
    if (sd_sdf == req.query.code) {
        mysql.sql(`SELECT * FROM du_user WHERE phone="${req.query.phone}"`, function (data) {
            if (data.length <= 0) {
                mysql.sql(`INSERT INTO du_user(phone,user_info) VALUES('${req.query.phone}','${req.query.info}')`, function (data) {
                    sd_df.code = 0
                    sd_df.msg = "绑定成功"
                    res.end(JSON.stringify(sd_df))
                })
            } else {
                sd_df.code = 0
                sd_df.msg = "绑定成功"
                res.end(JSON.stringify(sd_df))
            }
        })
    } else {
        sd_df.code = -1
        sd_df.msg = "验证码错误或已过期"
        res.end(JSON.stringify(sd_df))
    }

})




//小程序接口
//获取案例
router.get('/fabulist', function (req, res, next) {
    var xs = {}
    mysql.sql(`SELECT * FROM dx_xq ORDER BY id DESC `, function (data) {
        xs.code = 0
        xs.msg = " 获取成功"
        xs.data = data
        res.send(xs)
    })
})

//详情
router.get('/getcase', function (req, res, next) {

    let id = req.query.id
    var xs = {}


    if (id) {
        mysql.sql(`SELECT * FROM dx_xq where id=${id}`, function (data) {
            data[0].banner = data[0].banner.split(",")
            xs.code = 0
            xs.msg = " 获取成功"
            xs.data = data[0]
            res.send(xs)
        })

    } else {
        xs.code = -1
        xs.msg = "id不能为空"
        res.send(xs)

    }
})


//购买服务
router.get('/user_add_fuwu', function (req, res, next) {
    var xs = {}
    var case_id = req.query.case_id,
        phone = req.query.phone,
        time = new Date().Format("yyyy-MM-dd hh:mm")
    mysql.sql(`INSERT INTO dx_usergm(case_id,phone,time) VALUES('${case_id}','${phone}','${time}')`, function (data) {
        xs.code = 0
        xs.msg = " 购买成功"
        res.send(xs)
    })
});






module.exports = router;

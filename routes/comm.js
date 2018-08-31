var mysql = require('./mysq');
var fs = require('fs');
var formidable = require('formidable');
var request = require('request');
var xml2js = require('xml2js');
exports.up_img = function (req, res, suc) {
    var form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = 'public/uploads'; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 20 * 1024 * 1024; //文件大小 k
    form.maxFields = 1000;
    form.hash = false;
    form.multiples = false;
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        suc(files.file.path.split("public")[1])

    });
}

exports.ajax_e = function (url, sd_sddf, da_ta, call) {
    console.log(JSON.stringify(da_ta))
    request.post({
        url: url,
        form: da_ta
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            call(body)
        } else {
            sd_sddf.end({
                "code": -100,
                msg: "请求失败"
            })
        }
    })

}

//随机数
exports.randomString = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

//随机数
exports.randomnum = function (len) {
    len = len || 6;
    var $chars = '0123456789'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}



exports.assign_dsdf = function (jsonbject1, jsonbject2) {
    var resultJsonObject = {};
    for (var attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr];
    }
    for (var attr in jsonbject2) {
        resultJsonObject[attr] = jsonbject2[attr];
    }
    return resultJsonObject;
};






exports.buildXML = function (json) {
    var builder = new xml2js.Builder();
    return builder.buildObject(json);
};

exports.parseXML = function (xml, fn) {
    var parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
        explicitRoot: false
    });
    parser.parseString(xml, fn || function (err, result) {});
};

exports.parseRaw = function () {
    return function (req, res, next) {
        var buffer = [];
        req.on('data', function (trunk) {
            buffer.push(trunk);
        });
        req.on('end', function () {
            req.rawbody = Buffer.concat(buffer).toString('utf8');
            next();
        });
        req.on('error', function (err) {
            next(err);
        });
    }
};

exports.pipe = function (stream, fn) {
    var buffers = [];
    stream.on('data', function (trunk) {
        buffers.push(trunk);
    });
    stream.on('end', function () {
        fn(null, Buffer.concat(buffers));
    });
    stream.once('error', fn);
};

exports.mix = function () {
    var root = arguments[0];
    if (arguments.length == 1) {
        return root;
    }
    for (var i = 1; i < arguments.length; i++) {
        for (var k in arguments[i]) {
            root[k] = arguments[i][k];
        }
    }
    return root;
};



exports.zx = function (data) {
    var stringA = Object.keys(data),
        s_sdfs = ""
//    stringA.sort()
    stringA.map(function (a) {
        s_sdfs += "&" + a + "=" + data[a]
    })
    s_sdfs = s_sdfs.substring(1, s_sdfs.length)
    return s_sdfs
}

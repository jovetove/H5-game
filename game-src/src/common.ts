/**
 * gobal data
 */
//var url= "https://xwfintech.qingke.io/5f172e0de25bdc002d9a5abf/api";
var url = "http://127.0.0.1:7000"


/**
 * 发送请求
 * @param url
 * @param cb
 */
function ajax(url, cb) {
    var x = new XMLHttpRequest();
    x.open("GET", url);
    x.onload = function () {
        var is_error = x.status >= 400 || (!x.status && !x.responseText);
        if (is_error){
            alert(`failed: ${x.status} ${x.responseText}`);
            cb(false);
        } else{
            cb(true, JSON.parse(x.responseText));
        }
    }
    try{
        x.send();
    }catch{
        cb(false);
    }
}


/**
 * 是否在微信浏览器中打开
 */
function isWechat() {
    var ua = navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua) || /windows phone/i.test(ua);
}
var url = "http://127.0.0.1:7000";
function ajax(url, cb) {
    var x = new XMLHttpRequest();
    x.open("GET", url);
    x.onload = function () {
        var is_error = x.status >= 400 || (!x.status && !x.responseText);
        if (is_error) {
            alert(`failed: ${x.status} ${x.responseText}`);
            cb(false);
        }
        else {
            cb(true, JSON.parse(x.responseText));
        }
    };
    try {
        x.send();
    }
    catch (_a) {
        cb(false);
    }
}
function isWechat() {
    var ua = navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua) || /windows phone/i.test(ua);
}
//# sourceMappingURL=common.js.map
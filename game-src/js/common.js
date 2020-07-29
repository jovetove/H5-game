var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var url_online = "https://xwfintech.qingke.io/5f172e0de25bdc002d9a5abf/api";
var url_debug = "http://127.0.0.1:7000";
var url = "";
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
var PlayerInfo = {};
function isWechat() {
    var ua = navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua) || /windows phone/i.test(ua);
}
function createPlayerInfo() {
    PlayerInfo.openid = "A" + parseInt(Math.random().toString());
    PlayerInfo.nickname = "Tom";
    PlayerInfo.sex = "whoMan";
    PlayerInfo.headimgurl = "https://lg-4y405dn2-1256251417.cos.ap-shanghai.myqcloud.com/111222.png";
}
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["Hole"] = 0] = "Hole";
    EnemyType[EnemyType["Mask"] = 1] = "Mask";
    EnemyType[EnemyType["Boom"] = 2] = "Boom";
    EnemyType[EnemyType["Batman"] = 3] = "Batman";
    EnemyType[EnemyType["BatmanKing"] = 4] = "BatmanKing";
    EnemyType[EnemyType["Logo"] = 5] = "Logo";
})(EnemyType || (EnemyType = {}));
function isSuccessful() {
    return score >= target;
}
function commitScore(score) {
    return new Promise((resolver, reject) => {
        var key = "zxdqw";
        var timestamp = Date.now();
        if (PlayerInfo.openid == "undefined") {
            PlayerInfo.openid = "123456";
        }
        var sign = md5.hex(`${key}openid${PlayerInfo.openid}score${score}${timestamp}`);
        ajax(url + `/openapi/pinball/add/measy?key=${key}&sign=${sign}&openid=${PlayerInfo.openid}&score=${score}&timestamp=${timestamp}`, function (e, r) {
            if (r.code) {
                alert(r.msg);
                reject();
            }
            else
                resolver(r.data);
        });
    });
}
function length1(sprite, x, y) {
    var dx = sprite.x - x;
    var dy = sprite.y - y;
    return Math.sqrt(dx * dx + dy * dy);
}
function intersect(p1, p2, c, r) {
    var flag1 = (p1.x - c.x) * (p1.x - c.x) + (p1.y - c.y) * (p1.y - c.y) <= r * r;
    var flag2 = (p2.x - c.x) * (p2.x - c.x) + (p2.y - c.y) * (p2.y - c.y) <= r * r;
    if (flag1 && flag2)
        return false;
    else if (flag1 || flag2)
        return true;
    else {
        var A, B, C, dist1, dist2, angle1, angle2;
        A = p1.y - p2.y;
        B = p2.x - p1.x;
        C = p1.x * p2.y - p2.x * p1.y;
        dist1 = A * c.x + B * c.y + C;
        dist1 *= dist1;
        dist2 = (A * A + B * B) * r * r;
        if (dist1 > dist2)
            return false;
        angle1 = (c.x - p1.x) * (p2.x - p1.x) + (c.y - p1.y) * (p2.y - p1.y);
        angle2 = (c.x - p2.x) * (p1.x - p2.x) + (c.y - p2.y) * (p1.y - p2.y);
        return (angle1 > 0 && angle2 > 0);
    }
}
function reflect(p1, p2, p0, dx, dy) {
    var A = p2.y - p1.y;
    var B = p1.x - p2.x;
    var C = p2.x * p1.y - p1.x * p2.y;
    var D = 1 / (A * A + B * B);
    var x = (B * B * p0.x - A * B * p0.y - A * C) * D;
    var y = (A * A * p0.y - A * B * p0.x - B * C) * D;
    var nx = p0.x - x;
    var ny = p0.y - y;
    var r = 1 / Math.sqrt(nx * nx + ny * ny);
    nx *= r;
    ny *= r;
    var d = dx * nx + dy * ny;
    var vx = dx - 2 * nx * d;
    var vy = dy - 2 * ny * d;
    return [vx, vy];
}
function addScore(s, n) {
    return __awaiter(this, void 0, void 0, function* () {
        var s1 = score;
        score += s;
        var d = (s / 10) | 0;
        for (let i = 0; i < 10; i++) {
            s1 += d;
            var ss = s1 + " / " + target;
            n.score.text = `得分 ${ss}`;
            yield ez.delay(30);
        }
        var ss = score + " / " + target;
        n.score.text = `得分 ${ss}`;
    });
}
function shulffle(arr) {
    var seed = Date.now();
    function rand(max) {
        seed = (seed * 22695477 + 1) & 0x7ffffff;
        return (seed >> 16) % (max + 1);
    }
    for (var i = 0; i < arr.length; i++) {
        var idx = rand(arr.length - 1);
        var t = arr[i];
        arr[i] = arr[idx];
        arr[idx] = t;
    }
}
//# sourceMappingURL=common.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var url_online = "https://xwfintech.qingke.io/_api/5f172e0de25bdc002d9a5abf";
var url_debug = "http://127.0.0.1:7000";
var url = url_debug;
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
    PlayerInfo.headimgurl = "image/111222";
}
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["Batman"] = 0] = "Batman";
    EnemyType[EnemyType["Boom"] = 1] = "Boom";
    EnemyType[EnemyType["Mask"] = 2] = "Mask";
    EnemyType[EnemyType["BatmanKing"] = 3] = "BatmanKing";
    EnemyType[EnemyType["clone"] = 4] = "clone";
    EnemyType[EnemyType["Logo"] = 5] = "Logo";
    EnemyType[EnemyType["Hole"] = 6] = "Hole";
})(EnemyType || (EnemyType = {}));
function isSuccessful() {
    return score >= target;
}
function commitScore(score) {
    return new Promise((resolver, reject) => {
        var key = "zxdqw";
        var timestamp = Date.now();
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
function createXY() {
    var border = 25;
    var x = Math.floor(Math.random() * (700 - border)) + border;
    var y = Math.floor(Math.random() * (1280 - border)) + border;
    return [x, y];
}
function createEnemyData() {
    var data = [];
    for (var i = 0; i < enemyData.length; i++) {
        var num = enemyData[i].num * enemyNum;
        for (var j = 0; j < num; j++) {
            var arr = createXY();
            var temp = { type: enemyData[i].type, x: arr[0], y: arr[1] };
            data.push(temp);
        }
    }
    return data;
}
function createPlayer(stage) {
    var sprite = new ez.SubStageSprite(stage);
    var p1 = new ez.ImageSprite(sprite);
    var p2 = new ez.ImageSprite(sprite);
    p1.src = "game/playerlight";
    p2.src = "game/player";
    p1.anchorX = 0.5;
    p2.anchorX = 0.5;
    p1.anchorY = 0.66;
    p1.scale = 0.9;
    p2.anchorY = 0.7;
    sprite.scale = 0.7;
    new ez.Tween(p1)
        .move({ opacity: [0.5, 1] }, 1000)
        .to({ opacity: 0.5 }, 1000)
        .config({ loop: true })
        .play();
    return sprite;
}
function createHole(e, stage) {
    var s = new ez.ImageSprite(stage);
    s.anchorX = 0.5;
    s.anchorY = 0.5;
    s.x = e.x;
    s.y = e.y;
    let data = {};
    s["data"] = data;
    data.type = e.type;
    s.src = "game/hole";
    data.radius = 60;
}
function createEnemy(e, stage) {
    var s = new ez.ImageSprite(stage);
    s.anchorX = 0.5;
    s.anchorY = 0.5;
    s.x = e.x;
    s.y = e.y;
    let data = {};
    s["data"] = data;
    data.type = e.type;
    switch (e.type) {
        case EnemyType.Hole:
            s.src = "game/hole";
            data.radius = 60;
            break;
        case EnemyType.Mask:
            s.src = "game/mask";
            data.score = 30;
            data.radius = 20;
            ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({ scale: [0.9, 1.1] }, 1000).to({ scale: 0.9 }, 1000).config({ loop: true }).play());
            break;
        case EnemyType.Boom:
            s.src = "game/boom";
            data.score = -10;
            data.radius = 20;
            break;
        case EnemyType.Logo:
            s.src = "game/logo";
            data.score = 20;
            data.radius = 13;
            break;
        case EnemyType.Batman:
            s.src = "game/batman";
            s.scale = 0.7;
            data.score = 10;
            data.radius = 13;
            ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({ scale: [1, 1.2] }, 2000).to({ scale: 1 }, 2000).config({ loop: true }).play());
            break;
        case EnemyType.BatmanKing:
            s.src = "game/batman";
            s.scale = 1.8;
            data.score = 100;
            data.radius = 36;
            ez.Tween.add(s).move({ scale: [1.8, 2.1] }, 2000).to({ scale: 1.8 }, 1000).config({ loop: true }).play();
            break;
        case EnemyType.clone:
            s.src = "game/clone";
            s.scale = 1;
            data.score = 0;
            data.radius = 13;
            var numX = getRandomNumInt(-20, 20);
            var numY = getRandomNumInt(-20, 20);
            ez.Tween.add(s)
                .move({ y: [s.y, s.y + numY], x: [s.x, s.x + numX], angle: [-180, 180], scale: [0.95, 1.05] }, 1200, ez.Ease.sineInOut)
                .to({ y: s.y, x: s.x, angle: -180, scale: 0.95 }, 1200, ez.Ease.sineInOut)
                .config({ loop: true })
                .play();
            break;
    }
    return s;
}
function createHoleData() {
    var arr = createXY();
    var x = arr[0];
    var y = arr[1];
    var data = new Array(1);
    var temp = { type: EnemyType.Batman, x: x, y: y };
    data[0] = temp;
    return data;
}
function getRandomNumInt(min, max) {
    var Range = max - min;
    var Rand = Math.random();
    return (min + Math.round(Rand * Range));
}
//# sourceMappingURL=common.js.map
/**
 * gobal data
 */
var url_online= "https://xwfintech.qingke.io/_api/5f172e0de25bdc002d9a5abf";
var url_debug = "http://127.0.0.1:7000";
var url = url_online;

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
 * 玩家信息
 */
var PlayerInfo: {
    openid:string;
    nickname: string;
    sex: string;
    headimgurl: string;
} = <any>{};

/**
 * 是否在微信浏览器中打开
 */
function isWechat() {
    var ua = navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua) || /windows phone/i.test(ua);
}

/**
 * 玩家信息，如果不在微信游览器中打开，则随机生成
 */
function createPlayerInfo() {
    PlayerInfo.openid = "A" + parseInt(Math.random().toString());
    PlayerInfo.nickname = "Tom";
    PlayerInfo.sex = "whoMan";
    PlayerInfo.headimgurl = "/res/111222.png";
}

/**
 * 游戏角色
 */
enum EnemyType {
    /**黑洞*/
    Hole,
    /**口罩*/
    Mask,
    /**炸弹*/
    Boom,
    /**小兵*/
    Batman,
    /**大王*/
    BatmanKing,
    /**新网银行logo*/
    Logo
}

/**
 * 是否成功达到本局游戏目标
 * 成功返回 true
 */
function isSuccessful() {
    return score >= target;
}


/**
 * 一局结束
 * 提交分数
 */
function commitScore(score) {
    return new Promise((resolver, reject) =>{
        var key = "zxdqw";
        var timestamp = Date.now();
        if(PlayerInfo.openid == "undefined"){
            PlayerInfo.openid = "123456";
        }
        var sign = md5.hex(`${key}openid${PlayerInfo.openid}score${score}${timestamp}`);
        ajax(url+`/openapi/pinball/add/measy?key=${key}&sign=${sign}&openid=${PlayerInfo.openid}&score=${score}&timestamp=${timestamp}`, function (e, r) {
            if (r.code) {
                alert(r.msg);
                reject();
            }
            else
                resolver(r.data);
        });
    });
}

/**
 * 计算距离
 * @param sprite
 * @param x
 * @param y
 */
function length1(sprite, x, y) {
    var dx = sprite.x - x;
    var dy = sprite.y - y;
    return Math.sqrt(dx*dx + dy*dy);
}
/**
 * 碰撞检测
 * @param p1
 * @param p2
 * @param c
 * @param r
 */
function intersect(p1, p2, c, r){
    var flag1 = (p1.x - c.x) * (p1.x - c.x) + (p1.y - c.y) * (p1.y - c.y) <= r * r;
    var flag2 = (p2.x - c.x) * (p2.x - c.x) + (p2.y - c.y) * (p2.y - c.y) <= r * r;
    if (flag1 && flag2)
        return false;
    else if (flag1 || flag2)
        return true;
    else
    {
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

/**
 * 反射
 * @param p1
 * @param p2
 * @param p0
 * @param dx
 * @param dy
 */
function reflect(p1, p2, p0, dx, dy){
    var A = p2.y - p1.y;
    var B = p1.x - p2.x;
    var C = p2.x * p1.y - p1.x * p2.y;
    var D = 1 / (A * A + B * B);
    var x = (B * B * p0.x - A * B * p0.y - A * C) * D;
    var y = (A * A * p0.y - A * B * p0.x - B * C) * D;
    var nx = p0.x - x;
    var ny = p0.y - y;
    var r = 1 / Math.sqrt(nx*nx+ny*ny);
    nx *= r;
    ny *= r;
    var d = dx * nx + dy * ny;
    var vx = dx - 2 * nx * d;
    var vy = dy - 2 * ny * d;
    return [vx, vy];
}

/**
 * 添加分数
 * @param s
 * @param n
 */
async function addScore(s, n) {
    var s1 = score;
    score += s;
    var d = (s / 10)|0;
    for(let i = 0; i < 10; i++){
        s1 += d;
        var ss:String = s1 + " / " + target;
        n.score.text = `得分 ${ss}`
        await ez.delay(30);
    }
    // n.score.text = `得分 ${score}`;
    var ss:String = score + " / " + target;
    n.score.text = `得分 ${ss}`
}

function shulffle(arr) {
    var seed = Date.now();
    function rand(max: number) {
        seed = (seed * 22695477 + 1) & 0x7ffffff;
        return (seed >> 16) % (max + 1);
    }
    for(var i = 0; i < arr.length; i++){
        var idx = rand(arr.length - 1);
        var t = arr[i];
        arr[i] = arr[idx];
        arr[idx] = t;
    }
}

/**
 * 产生xy数据
 */
function createXY() {
    // 边界 防止生成的敌人越界
    var border:number = 25;
    var x = Math.floor(Math.random() * (700-border)) + border;
    var y = Math.floor(Math.random() * (1280-border)) + border;
    return [x, y];
}

/**
 * 生成敌人数据
 */
function createEnemyData() {
    // 数组大小
    var data = [];
    for(var i=0; i < enemyData.length; i++){
        var num = enemyData[i].num*enemyNum;
        for(var j = 0; j < num; j++){
            var arr = createXY();
            var temp = { type: enemyData[i].type, x: arr[0], y: arr[1] };
            data.push(temp);
        }
    }
    return data;
}
/**
 * gobal data
 */
var url_online= "https://xwfintech.qingke.io/_api/5f172e0de25bdc002d9a5abf";
var url_debug = "http://127.0.0.1:7000";
var static_url = "https://xwfintech.qingke.io/5f172e0de25bdc002d9a5abf"
var url = url_debug;

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
 * 生成openid
 */
function makeString(str:String, size:Number) {
    let outString = str;
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < size; i++) {
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    return outString;
}

/**
 * 玩家信息，如果不在微信游览器中打开，则随机生成
 */
function createPlayerInfo() {
    // @ts-ignore
    PlayerInfo.openid = makeString('ogIOb0',22);
    // @ts-ignore
    PlayerInfo.nickname = makeString("",5);
    PlayerInfo.sex = "1";
    PlayerInfo.headimgurl = static_url + "/icon/" + getRandomNumInt(1,20)+".png";
}

/**
 * 游戏角色
 */
enum EnemyType {
    /**小兵*/
    Batman,
    /**炸弹*/
    Boom,
    /**口罩*/
    Mask,
    /**大王*/
    BatmanKing,
    /**clone*/
    clone,
    /**新网银行logo*/
    Logo,
    /**黑洞*/
    Hole,
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
    var border:number = 30;
    var x = getRandomNumInt(border,710-border);
    var y = getRandomNumInt(70,1280-border);
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

function createPlayer(stage:ez.Stage) {
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

function createHole(e, stage: ez.Stage){
    var s = new ez.ImageSprite(stage);
    s.anchorX = 0.5;
    s.anchorY = 0.5;
    s.x = e.x;
    s.y = e.y;
    let data:any = {};
    s["data"] = data;
    data.type = e.type;
    s.src = "game/hole";
    data.radius = 60;
}

function createEnemy(e, stage: ez.Stage) {
    var s = new ez.ImageSprite(stage);
    s.anchorX = 0.5;
    s.anchorY = 0.5;
    s.x = e.x;
    s.y = e.y;
    let data:any = {};
    s["data"] = data;
    data.type = e.type;

    switch (e.type){
        case EnemyType.Hole:
            s.src = "game/hole";
            data.radius = 60;
            break;
        case EnemyType.Mask:
            s.src = "game/mask";
            data.score = 30;
            data.radius = 20;
            ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({scale:[0.9, 1.1]}, 1000).to({scale:0.9}, 1000).config({loop:true}).play());
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
            // ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({ y: [s.y, s.y + 5 * Math.random() + 5] }, 3000).to({ y: s.y }, 3000).config({ loop: true }).play());
            break;
        case EnemyType.BatmanKing:
            s.src = "game/batman";
            s.scale = 1.8;
            data.score = 100;
            data.radius = 36;
            ez.Tween.add(s).move({ scale: [1.8, 2.1] }, 2000).to({ scale: 1.8 }, 1000).config({ loop: true }).play();
            break;
        case EnemyType.clone:
            // console.log("创建clone");
            s.src = "game/clone";
            s.scale = 1;
            data.score = 0;
            data.radius = 13;
            var numX = getRandomNumInt(-20,20);
            var numY = getRandomNumInt(-20,20);
            ez.Tween.add(s)
            .move({y: [s.y, s.y+numY], x:[s.x, s.x+numX], angle: [-180, 180], scale: [0.95, 1.05]}, 1200, ez.Ease.sineInOut)
            .to({y: s.y,x:s.x, angle: -180, scale: 0.95}, 1200, ez.Ease.sineInOut)
            .config({loop: true})
            .play();
            break;
    }
    return s;
}

/**
 * 生成黑洞数据
 */
function createHoleData() {
    var arr = createXY();
    var x = arr[0];
    var y = arr[1];
    var data = new Array(1);
    var temp = { type: EnemyType.Batman, x: x, y: y };
    data[0] =temp;
    return data;
}

function  getRandomNumInt(min: number, max: number) {
    var Range = max - min;
    var Rand = Math.random(); //获取[0-1）的随机数
    return (min + Math.round(Rand * Range)); //放大取整
}
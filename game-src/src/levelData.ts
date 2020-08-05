/**最大关卡*/
var levelMax:number = 10;
/**当前关卡*/
//var levelCurr:number = 1;

// 生命力
var chanceMax = 5;

// 累计分数
var score = 0;
var level = 1;
var maxLevel = 7;
// 速率
var rate = 0.5;

// 速度衰减
var alpha = 0.9;

// 最大时钟时间
var maxTime = 20;


/** 界面数据 */
// 线条和墙壁
var lines = [
    [0,  70, 490, 70],
    [490,70, 710, 205],
    [490, 70, 710, 205],
    [710, 205, 710, 524],
    [710, 524, 446, 695],
    [446, 695, 466, 723],
    [466, 723, 710, 564],
    [710, 564, 710, 1280],
    [0, 70, 0, 1280],
    [120, 902, 361, 902],
    [361, 902, 361, 934],
    [361, 934, 120, 939],
    [120, 902, 120, 939],
    [710, 1280, 0, 1280]
].map(l => [{ x: l[0], y: l[1] }, { x: l[2], y: l[3] }] );

/** ===================================================== */
// 游戏数据
/** ===================================================== */
/**
 * 游戏数据
 * */
var enemyData = [
    {type:EnemyType.Batman, num:0.78},
    {type:EnemyType.BatmanKing, num: 0.05},
    {type:EnemyType.Boom, num:0.06},
    {type:EnemyType.Mask, num:0.04},
    {type:EnemyType.Logo, num:0.05},
    {type:EnemyType.clone, num:0.02}
]

var enemyNum = 50 + 30 * (level-1);
var target = 9 * enemyNum;

function initEverTime() {
    enemyNum = 50 + 30 * (level-1);
    // target = 9 * enemyNum  + (enemyNum*0.02)*(enemyNum*0.02)*level*20;
    target = getTarget(level);
    var temp = level <= 6 ? level : 6;
    rate  += 0.01 * temp;
    alpha -= 0.01 * (temp-1);
}

function getTarget(level) {
    var c = [420,800,1200,2000,3890,6010,9999];
    return c[level-1];
}
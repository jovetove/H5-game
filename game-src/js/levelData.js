var levelMax = 10;
var levelCurr = 1;
var chanceMax = 5;
var score = 0;
var level = 1;
var rate = 0.5;
var alpha = 0.9;
var maxTime = 20;
var lines = [
    [0, 70, 490, 70],
    [490, 70, 710, 205],
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
].map(l => [{ x: l[0], y: l[1] }, { x: l[2], y: l[3] }]);
var enemyData = [
    { type: EnemyType.Batman, num: 0.80 },
    { type: EnemyType.BatmanKing, num: 0.05 },
    { type: EnemyType.Boom, num: 0.06 },
    { type: EnemyType.Mask, num: 0.04 },
    { type: EnemyType.Logo, num: 0.05 },
];
var enemyNum = 50 + 30 * (level - 1);
var target = 9 * enemyNum;
function initEverTime() {
    enemyNum = 50 + 30 * (level - 1);
    target = 9 * enemyNum;
    var temp = level <= 6 ? level : 6;
    rate += 0.01 * temp;
    alpha -= 0.02 * (temp - 1);
}
//# sourceMappingURL=levelData.js.map
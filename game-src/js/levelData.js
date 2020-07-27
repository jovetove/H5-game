var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["Hole"] = 0] = "Hole";
    EnemyType[EnemyType["Mask"] = 1] = "Mask";
    EnemyType[EnemyType["Boom"] = 2] = "Boom";
    EnemyType[EnemyType["Batman"] = 3] = "Batman";
    EnemyType[EnemyType["BatmanKing"] = 4] = "BatmanKing";
    EnemyType[EnemyType["Logo"] = 5] = "Logo";
})(EnemyType || (EnemyType = {}));
var levelMax = 5;
var levelCurr = 1;
var leveldata = [50, 80, 100, 120, 140];
var score = 0;
var rate = 0.5;
var alpha = 0.9;
//# sourceMappingURL=levelData.js.map
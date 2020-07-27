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

/**最大关卡*/
var levelMax:number = 5;
/**当前关卡*/
var levelCurr:number = 1;

var leveldata:number[] = [50, 80, 100, 120, 140]

// 累计分数
var score = 0;

// 速率
var rate = 0.5;
// 速度衰减
var alpha = 0.9;


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var game;
(function (game) {
    var RAD = 180 / Math.PI;
    const PlayerRadius = 30;
    var player;
    var launchResovle = null;
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
                ez.setTimer(Math.random() * 1000, () => ez.Tween.add(s).move({ y: [s.y, s.y + 5 * Math.random() + 5] }, 3000).to({ y: s.y }, 3000).config({ loop: true }).play());
                break;
            case EnemyType.BatmanKing:
                s.src = "game/batman";
                s.scale = 1.8;
                data.score = 100;
                data.radius = 36;
                ez.Tween.add(s).move({ scale: [1.8, 2.1] }, 2000).to({ scale: 1.8 }, 1000).config({ loop: true }).play();
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
    function createXY() {
        var border = 25;
        var x = Math.floor(Math.random() * (700 - border)) + border;
        var y = Math.floor(Math.random() * (1280 - border)) + border;
        return [x, y];
    }
    function createEnemyData() {
        var size = 50;
        var data = new Array(size);
        var i = 0;
        while (i < 35) {
            var arr = createXY();
            var x = arr[0];
            var y = arr[1];
            var temp = { type: EnemyType.Batman, x: x, y: y };
            data[i] = temp;
            i++;
        }
        while (i < 40) {
            var arr = createXY();
            var x = arr[0];
            var y = arr[1];
            var temp = { type: EnemyType.BatmanKing, x: x, y: y };
            data[i] = temp;
            i++;
        }
        while (i < 43) {
            var arr = createXY();
            var x = arr[0];
            var y = arr[1];
            var temp = { type: EnemyType.Logo, x: x, y: y };
            data[i] = temp;
            i++;
        }
        while (i < 55) {
            var arr = createXY();
            var x = arr[0];
            var y = arr[1];
            var temp = { type: EnemyType.Boom, x: x, y: y };
            data[i] = temp;
            i++;
        }
        while (i < size) {
            var arr = createXY();
            var x = arr[0];
            var y = arr[1];
            var temp = { type: EnemyType.Mask, x: x, y: y };
            data[i] = temp;
            i++;
        }
        return data;
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
    function addScore(s, n) {
        return __awaiter(this, void 0, void 0, function* () {
            var s1 = score;
            score += s;
            var d = (s / 10) | 0;
            for (let i = 0; i < 10; i++) {
                s1 += d;
                n.score.text = `得分 ${s1}`;
                yield ez.delay(30);
            }
            n.score.text = `得分 ${score}`;
        });
    }
    function startGame(stage, n, gameOver) {
        return __awaiter(this, void 0, void 0, function* () {
            function showClock() {
                return __awaiter(this, void 0, void 0, function* () {
                    n.clock.visible = true;
                    var time = 10;
                    n.time.text = `${time}s`;
                    while (time > 0) {
                        n.time.text = `${time}s`;
                        yield ez.delay(1000);
                        time--;
                    }
                    n.clock.visible = false;
                    getMask = false;
                });
            }
            var enemies = [];
            if (PlayerInfo.openid == "undefine") {
                PlayerInfo.openid = "123456";
            }
            ajax(url + `/openapi/statistics/add?openid=${PlayerInfo.openid}&fps=${ez.fps}`, function () { });
            var getMask = false;
            var enemiesData = createEnemyData();
            for (let i = 0; i < enemiesData.length; i++) {
                enemies[i] = createEnemy(enemiesData[i], stage);
            }
            var hole1 = createHoleData();
            createHole(hole1[0], stage);
            let hole = [hole1[0].x, hole1[0].y];
            player = createPlayer(stage);
            player.x = 104;
            player.y = 144;
            var circle = new ez.ImageSprite(stage);
            circle.src = "game/circle";
            circle.anchorX = circle.anchorY = 0.5;
            circle.x = 104;
            circle.y = 144;
            new ez.Tween(circle)
                .move({ scale: [0.4, 1.2], opacity: [0.1, 0.6] }, 800)
                .config({ loop: true })
                .play();
            var lastPos = [104, 144];
            var chance = 5;
            while (true) {
                if (chance-- <= 0)
                    break;
                let launch = new Promise((r) => {
                    launchResovle = r;
                });
                lastPos = [player.x, player.y];
                let r = yield launch;
                if (circle) {
                    circle.dispose();
                    circle = null;
                }
                n.chance.text = `机会 ${chance}`;
                launchResovle = null;
                let dx = r[0] * rate;
                let dy = r[1] * rate;
                while (true) {
                    player.x += dx;
                    player.y += dy;
                    if (Math.abs(dx) < 1 && Math.abs(dy) < 1)
                        break;
                    for (let i = 0; i < enemies.length; i++) {
                        let e = enemies[i];
                        let data = e.data;
                        let dx1 = e.x - player.x;
                        let dy1 = e.y - player.y;
                        if (dx1 * dx1 + dy1 * dy1 < (30 + data.radius) * (30 + data.radius)) {
                            dx = dx >= 10 ? dx : dx * 1.05;
                            dy = dy >= 10 ? dy : dy * 1.05;
                            let score = data.score;
                            let s = new ez.LabelSprite(stage);
                            s.align = ez.AlignMode.Center;
                            s.anchorX = 0.5;
                            s.anchorY = 1;
                            s.width = 200;
                            s.height = 30;
                            s.x = e.x;
                            s.font = "Arial 30px";
                            if (data.type == EnemyType.BatmanKing && !getMask)
                                score = 30;
                            if (score > 0) {
                                s.text = "+" + score;
                                s.gradient = { y1: 30, colors: ["#ff8", "#fa8"] };
                            }
                            else {
                                s.text = "" + score;
                                s.gradient = { y1: 30, colors: ["#8ff", "#8af"] };
                            }
                            if (data.type == EnemyType.Logo && !getMask) {
                                chance += 1;
                                n.chance.text = `机会 ${chance}`;
                            }
                            ez.Tween.add(s)
                                .move({ y: [e.y, e.y - 30], opacity: [0.5, 1] }, 300, ez.Ease.bounceOut)
                                .move({ opacity: [1, 0] }, 2000)
                                .disposeTarget()
                                .play();
                            addScore(score, n);
                            ez.playSFX(score > 0 ? "sound/add" : "sound/lose");
                            e.dispose();
                            enemies.splice(i, 1);
                            if (data.type == EnemyType.Mask) {
                                getMask = true;
                                var arr = enemies.concat();
                                shulffle(arr);
                                for (let j = 0; j < 2; j++) {
                                    let idx = arr.findIndex(t => t.data.type == EnemyType.Batman);
                                    if (idx >= 0) {
                                        ez.Tween.add(arr[idx]).move({ opacity: [1, 0] }, 800).disposeTarget().play();
                                        enemies.splice(enemies.indexOf(arr[idx]), 1);
                                        arr.splice(idx, 1);
                                    }
                                }
                                showClock();
                            }
                            break;
                        }
                    }
                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i];
                        if (intersect(line[0], line[1], player, 30)) {
                            player.x -= dx;
                            player.y -= dy;
                            let r = reflect(line[0], line[1], player, dx, dy);
                            dx = r[0] * alpha;
                            dy = r[1] * alpha;
                            break;
                        }
                    }
                    let hx = hole[0] - player.x;
                    let hy = hole[1] - player.y;
                    let dr = hx * hx + hy * hy;
                    if (dr < 500) {
                        dx = 0;
                        dy = 0;
                        for (let i = 0; i < 30; i++) {
                            player.opacity = 1 - i / 30;
                            yield ez.nextFrame();
                        }
                        chance = Math.max(0, chance - 1);
                        player.x = lastPos[0];
                        player.y = lastPos[1];
                        for (let i = 0; i <= 30; i++) {
                            player.opacity = i / 30;
                            yield ez.nextFrame();
                        }
                    }
                    else if (dr < 50000) {
                        dr = 1 / dr;
                        hx = hx * Math.sqrt(dr);
                        hy = hy * Math.sqrt(dr);
                        dx += hx * 1000 * dr;
                        dy += hy * 1000 * dr;
                    }
                    if (dx > 0.15)
                        dx -= 0.1;
                    else if (dx < 0.15)
                        dx += 0.1;
                    if (dy > 0.15)
                        dy -= 0.1;
                    else if (dy < 0.15)
                        dy += 0.1;
                    yield ez.nextFrame();
                }
            }
            gameOver();
        });
    }
    function showResult(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
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
            var page = ctx.parent.createChild(game.ResultPage);
            var n = page.namedChilds;
            n.score.text = "" + score;
            var data = yield commitScore(score);
            game.getRank(n.rankPage);
            if (data)
                n.info.text = `超过了${data}的玩家`;
            page.addEventHandler("click", function (e) {
                switch (e.sender.id) {
                    case "rank":
                        n.rankPage.visible = true;
                        break;
                    case "closeRank":
                        n.rankPage.visible = false;
                        break;
                    case "replay":
                        page.parent.createChild(game.MainFrame);
                        page.dispose();
                        break;
                    case "result":
                        if (PlayerInfo.openid == "undefined") {
                            PlayerInfo.openid = "123456";
                        }
                        ajax(url + `/openapi/statistics/add?openid=${PlayerInfo.openid}&playTime=${Date.now() - startTime}`, function () { });
                        var share = page.parent.createChild(game.SharePage);
                        page.dispose();
                        var n1 = share.namedChilds;
                        n1.name.text = "姓名：" + PlayerInfo.nickname;
                        n1.score.text = "成绩：" + score;
                        ez.setTimer(100, function () {
                            var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                            var div = document.getElementById("game");
                            var canvas = div.getElementsByTagName("canvas")[0];
                            var png = canvas.toDataURL("image/png");
                            window.parent.postMessage({ msg: "show", src: png }, "*");
                        });
                        share.addEventHandler("click", function (e) {
                            switch (e.sender.id) {
                                case "closeRank":
                                    n.result.visible = false;
                                    break;
                            }
                        });
                        break;
                }
            });
            ctx.dispose();
        });
    }
    function length(sprite, x, y) {
        var dx = sprite.x - x;
        var dy = sprite.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    class GamePage extends game._GamePage {
        constructor(parent) {
            super(parent);
            score = 0;
            var lastLine = lines[lines.length - 1];
            lastLine[0].y = lastLine[1].y = parent.getBound().height - 0;
            const n = this.namedChilds;
            var sound = localStorage.getItem("sound");
            if (sound == null)
                sound = "1";
            n.sound.state = sound == "1" ? "check" : "uncheck";
            var stage = n.game.stage;
            n.touch.hitTest = function () { return true; };
            var arrow = new ez.ImageSprite(stage);
            arrow.src = "game/arrow";
            arrow.anchorY = 0.5;
            arrow.visible = false;
            arrow.zIndex = 1;
            var arrowWidth = arrow.width;
            var ctx = this;
            var lastPt;
            if (PlayerInfo) {
                n.name.text = PlayerInfo.nickname;
                n.avatar.src = PlayerInfo.headimgurl;
            }
            n.touch.onTouchBegin = function (e) {
                if (!launchResovle)
                    return;
                var x = e.screenX;
                var y = e.screenY;
                lastPt = [x, y];
                n.disk.x = x;
                n.disk.y = y;
                n.disk.visible = true;
                e.capture();
            };
            n.touch.onTouchMove = function (e) {
                if (!lastPt)
                    return;
                var dx = e.screenX - lastPt[0];
                var dy = e.screenY - lastPt[1];
                var r = Math.sqrt(dx * dx + dy * dy);
                var len = Math.max(12, Math.min(60, r));
                arrow.width = arrowWidth * len / 60;
                arrow.visible = true;
                arrow.x = player.x;
                arrow.y = player.y;
                if (dy >= 0)
                    arrow.angle = Math.acos(dx / r) * RAD + 180;
                else
                    arrow.angle = 180 - Math.acos(dx / r) * RAD;
            };
            n.touch.onTouchEnd = function (e) {
                if (!lastPt)
                    return;
                var dx = e.screenX - lastPt[0];
                var dy = e.screenY - lastPt[1];
                var r = Math.sqrt(dx * dx + dy * dy) + 0.01;
                var len = Math.max(10, Math.min(60, r));
                arrow.visible = false;
                var angle = arrow.angle;
                lastPt = null;
                n.disk.visible = false;
                if (launchResovle)
                    launchResovle([-dx * len / r, -dy * len / r]);
            };
            startGame(stage, n, function () { showResult(ctx); });
            this.addEventHandler("click", function (e) {
                switch (e.sender.id) {
                    case "help":
                        n.helpPage.visible = true;
                        break;
                    case "okBtn":
                        n.helpPage.visible = false;
                        break;
                    case "ok2Btn":
                        n.intro.visible = false;
                        break;
                    case "sound":
                        var state = e.sender.state;
                        game.soundEnable(state == "check");
                        break;
                }
            });
        }
    }
    game.GamePage = GamePage;
})(game || (game = {}));
//# sourceMappingURL=gamePage.js.map
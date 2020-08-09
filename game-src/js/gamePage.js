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
    var player;
    var launchResovle = null;
    function showResult(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var page = ctx.parent.createChild(game.ResultPage);
            var n = page.namedChilds;
            if (isSuccessful()) {
                n.replay.label = "下一局";
            }
            else {
                n.picFailTxt.visible = true;
                n.picSucc.visible = false;
                n.picFail.visible = true;
            }
            n.score.text = "" + score;
            var data = yield commitScore(score);
            game.getRank(n.rankPage);
            if (data) {
                n.info.text = `超过了${data}的玩家`;
            }
            page.addEventHandler("click", function (e) {
                switch (e.sender.id) {
                    case "rank":
                        n.rankPage.visible = true;
                        break;
                    case "closeRank":
                        n.rankPage.visible = false;
                        break;
                    case "replay":
                        if (isSuccessful() && level <= maxLevel) {
                            score = 0;
                            level += 1;
                            if (level > 7) {
                                level = 1;
                            }
                            initEverTime();
                            page.parent.createChild(game.GamePage);
                            page.dispose();
                        }
                        else {
                            score = 0;
                            level = 1;
                            initEverTime();
                            page.parent.createChild(game.MainFrame);
                            page.dispose();
                        }
                        break;
                    case "result":
                        ajax(url + `/openapi/statistics/add?openid=${PlayerInfo.openid}&playTime=${Date.now() - startTime}`, function () { });
                        var share = page.parent.createChild(game.SharePage);
                        page.visible = false;
                        var n1 = share.namedChilds;
                        if (data) {
                            n1.info.text = `超过了${data}的玩家`;
                        }
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
                                case "closeShare":
                                    share.dispose();
                                    page.visible = true;
                                    break;
                            }
                        });
                        break;
                    case "toShare":
                        n.myButton.visible = false;
                        n.helpPage.visible = true;
                        if (isSuccessful()) {
                            n.picSucc.visible = false;
                        }
                        else {
                            n.picFail.visible = false;
                        }
                        break;
                    case "okBtn":
                        n.myButton.visible = true;
                        n.helpPage.visible = false;
                        if (isSuccessful()) {
                            n.picSucc.visible = true;
                        }
                        else {
                            n.picFail.visible = true;
                        }
                        break;
                }
            });
            ctx.dispose();
        });
    }
    function startGame(stage, n, gameOver) {
        return __awaiter(this, void 0, void 0, function* () {
            var isEndOfTime = true;
            var time1 = maxTime;
            function showClock() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!isEndOfTime) {
                        time1 = maxTime;
                        return;
                    }
                    isEndOfTime = false;
                    n.clock.visible = true;
                    time1 = maxTime;
                    n.time.text = `${time1}`;
                    while (time1 > 0) {
                        n.time.text = `${time1}`;
                        yield ez.delay(100);
                        time1 -= 1;
                    }
                    isEndOfTime = true;
                    n.clock.visible = false;
                    getMask = false;
                });
            }
            var enemies = [];
            ajax(url + `/openapi/statistics/add?openid=${PlayerInfo.openid}&fps=${ez.fps}`, function () { });
            var getMask = false;
            var enemiesData = createEnemyData();
            for (let i = 0; i < enemiesData.length; i++) {
                enemies[i] = createEnemy(enemiesData[i], stage);
            }
            var hole1;
            let hole;
            if (holeData > 0) {
                hole1 = createHoleData();
                createHole(hole1[0], stage);
                hole = [hole1[0].x, hole1[0].y];
            }
            player = createPlayer(stage);
            player.x = 350;
            player.y = 600;
            player.scale = 1.2;
            var circle = new ez.ImageSprite(stage);
            circle.src = "game/circle";
            circle.anchorX = circle.anchorY = 0.5;
            circle.x = player.x;
            circle.y = player.y;
            new ez.Tween(circle)
                .move({ scale: [0.4, 1.2], opacity: [0.1, 0.6] }, 800)
                .config({ loop: true })
                .play();
            var lastPos = [player.x, player.y];
            var chance = chanceMax;
            while (true) {
                if (chance-- <= 0) {
                    break;
                }
                player.scale = 1.2;
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
                    player.scale = 0.7;
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
                            if (data.type == EnemyType.clone) {
                                for (var j = 0; j < level * 2; j++) {
                                    var arrc = createXY();
                                    var temp = { type: 0 + Math.round(Math.random() * 4), x: arrc[0], y: arrc[1] };
                                    enemies.push(createEnemy(temp, stage));
                                }
                            }
                            if (data.type == EnemyType.BatmanKing && !getMask) {
                                score = 30;
                            }
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
                            ez.Tween.add(s).move({ y: [e.y, e.y - 30], opacity: [0.5, 1] }, 300, ez.Ease.bounceOut)
                                .move({ opacity: [1, 0] }, 2000)
                                .disposeTarget().play();
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
                    if (player.x < 0 || player.y < 0 || player.x > 710 || player.y > 1400) {
                        var kk = createXY();
                        player.x = kk[0];
                        player.y = kk[1];
                    }
                    if (holeData > 0) {
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
    class GamePage extends game._GamePage {
        constructor(parent) {
            super(parent);
            var lastLine = lines[lines.length - 1];
            lastLine[0].y = lastLine[1].y = parent.getBound().height - 0;
            const n = this.namedChilds;
            score = 0;
            initEverTime();
            n.level.text = `关卡 ${level}`;
            var s = score + " / " + target;
            n.score.text = `得分 ${s}`;
            if (isWechat()) {
                n.avatar.src = PlayerInfo.headimgurl;
            }
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
                n.avatar.src = PlayerInfo.headimgurl;
            }
            n.chance.text = "机会 " + chanceMax.toString();
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
            startGame(stage, n, function () {
                showResult(ctx);
            });
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
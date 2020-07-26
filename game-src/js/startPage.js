var game;
(function (game) {
    function soundEnable(enable) {
        var val = 0;
        var sound = "0";
        if (enable)
            val = 1, sound = "1";
        ez.setBGMVolume(val);
        ez.setSFXVolume(val);
        localStorage.setItem("sound", sound);
    }
    game.soundEnable = soundEnable;
    game.ranks = [];
    function getRank(rankPage) {
        var startTime = Date.now();
        ajax("https://xwfintech.qingke.io/openapi/pinball/list?pageSize=100", function (e, r) {
            if (e) {
                var rank = 1;
                game.ranks = r.rows.map(t => t.score || 0);
                rankPage.namedChilds.rankList.items = r.rows.map(t => {
                    return { rank: rank++, name: t.nickname, avatar: t.avatar, score: t.score || 0 };
                });
            }
        });
    }
    game.getRank = getRank;
    class StartPage extends game._StartPage {
        constructor(parent) {
            super(parent);
            const n = this.namedChilds;
            var ctx = this;
            var sound = localStorage.getItem("sound");
            if (sound == null)
                sound == "1";
            n.sound.state = sound == "1" ? "check" : "uncheck";
            soundEnable(sound == "1");
            getRank(n.rankPage);
            ez.playMusic(0, "sound/bgm", true);
            new ez.Tween(n.stage.stage.find("猪")).move({ x: [38, 42], y: [120, 108] }, 1000).to({ x: 38, y: 120 }, 1000).config({ loop: true }).play();
            new ez.Tween(n.stage.stage.find("蝙蝠侠")).move({ y: [760, 770], angle: [-5, 6], scale: [0.95, 1.05] }, 1200, ez.Ease.sineInOut).to({ y: 760, angle: -5, scale: 0.95 }, 1200, ez.Ease.sineInOut).config({ loop: true }).play();
            ez.effect.highlight(n.start.namedChilds.bk, new ez.Color(128, 100, 50), 0.1, 10, 1000, 2000, 0, [-0.3, 1.2]);
            ez.setTimer(1000, function () {
                if (ctx.disposed)
                    return;
                ez.effect.highlight(n.help.namedChilds.bk, new ez.Color(50, 100, 128), 0.1, 10, 1000, 2000, 0, [-0.3, 1.2]);
            });
            ez.effect.highlight(n.rank.namedChilds.label, new ez.Color(128, 100, 50), 0.3, 0, 1000, 1500, 0, [-0.3, 1]);
            this.addEventHandler("click", function (e) {
                switch (e.sender.id) {
                    case "help":
                        n.helpPage.visible = true;
                        n.mainPage.visible = false;
                        break;
                    case "okBtn":
                        n.helpPage.visible = false;
                        n.mainPage.visible = true;
                        break;
                    case "rank":
                        n.rankPage.visible = true;
                        break;
                    case "closeRank":
                        n.rankPage.visible = false;
                        break;
                    case "start":
                        ctx.parent.createChild(game.GamePage);
                        ctx.dispose();
                        window.parent.postMessage({ msg: "gamestart" }, "*");
                        break;
                    case "sound":
                        var state = e.sender.state;
                        soundEnable(state == "check");
                        break;
                }
            });
        }
    }
    game.StartPage = StartPage;
    class RankItem extends game._RankItem {
        constructor(parent) {
            super(parent);
        }
        set dataSource(data) {
            var n = this.namedChilds;
            if (data.rank <= 3) {
                var ranks = ["", "1st", "2nd", "3rd"];
                n.rankIcon.src = "ui/icon/" + ranks[data.rank];
            }
            else {
                n.rankIcon.visible = false;
                n.rank.visible = true;
                n.rank.text = "" + data.rank;
            }
            n.name.text = data.name;
            n.avatar.src = data.avatar;
            n.score.text = data.score + "分";
        }
    }
    game.RankItem = RankItem;
})(game || (game = {}));
//# sourceMappingURL=startPage.js.map
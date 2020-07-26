var game;
(function (game) {
    var ui = ez.ui;
    var UI = ["UIStage", "Control", "Group", "RectFill", "Image", "game.Button", "Label", "game.Checkbox", "game.StartPage", "game.RankPage", "ScrollView", "ListView"];
    var RES = ["R:JCF2OQOGMT7O", "R:B0LVRU4VENJS", "R:1EF948RMIQRD", "R:HA8GLOB3BT28", "R:4PGJIM7IPCOV", "R:QJ204MMAGROF", "R:LAO8Q29LE1TO", "R:4LVSPIK3B203", "R:S9IQLHG3U700", "R:INH1T34JAHE4", "R:G503ILGF8S28", "R:O123T11GLFK9", "R:CTDCID13AB9F", "R:U7VJ9SGIHTNO", "R:P637DGG88RRB", "R:307B8VJHSQ38", "R:O18PU18DTSMO", "R:85GD560O0A62", "R:RGDNTIFOJEJ1", "R:PQF1C511M1BQ", "R:5A1F5RDNRR3D", "R:SPMG8J9324MB", "R:6VBE1JLANTMV", "R:UFGMTQLP3H5J", "R:52OMU7AEFJE8", "R:MFP4S2F9MF7F", "R:F45FD2M7NRMS", "R:EN6PH70VD7LV", "R:M3F90V7UJL03", "R:EJRRQ2IU0JS0", "R:LMIPDLENLMJG", "R:VCP8LGVCL71S"];
    ui.registerTextStyle([
        { id: "normal", font: "28px", color: "#bbadfb" },
        { id: "normalCenter", font: "28px", color: "#bbadfb", align: 1 },
        { id: "rankPage", font: "28px", color: "#757981" },
        { id: "gameHead", font: "28px", color: "#fff" },
    ]);
    var Templates = {
        GamePage: {
            name: "game.GamePage",
            init: function (control) {
            },
            childs: [
                [UI[0], , "game", 0, 0, , , 710, 1280, , , , , , , , , , , , , [
                        { type: "Image", src: RES[0] },
                        { type: "Image", src: RES[1], anchorX: 0.5, anchorY: 0.5, x: 242, y: 920.5 },
                        { type: "Image", src: RES[2], angle: -33, x: 738, y: 535, anchorX: 0.5, anchorY: 0.5 },
                        { type: "Image", src: RES[2], angle: 32, x: 562, y: 95, anchorX: 0.5, anchorY: 0.5 },
                        { type: "Image", src: RES[3], anchorX: 0.5, anchorY: 0.5, x: 318, y: 578.5, width: 246, height: 119 },
                    ]],
                [UI[1], , "touch", , , , , "100%", "100%"],
                [UI[2], , "intro", , , , , "100%", "100%", , , , , , , , , , , , , [
                        [UI[3], { color: "#000" }, , , , , , "100%", "100%", , , 0.3],
                        [UI[2], , , , , , , "100%", 600, , "50%", , , , , , , , , , , [
                                [UI[4], { src: RES[4] }, , , , , , , , "50%"],
                                [UI[5], { label: "确定" }, "ok2Btn", , 400, , , 195, 70, "50%"],
                            ]],
                    ]],
                [UI[2], , "helpPage", , , , , "100%", "100%", , , , false, , , , , , , , , [
                        [UI[3], { color: "#000" }, , , , , , "100%", "100%", , , 0.3],
                        [UI[4], { src: RES[5] }, , , 160, , , , , "50%"],
                        [UI[2], , , , 900, , 0, "100%", , , , , , , , , , , , , , [
                                [UI[5], { label: "已知晓" }, "okBtn", , "30%", , , 195, 70, "50%"],
                            ]],
                    ]],
                [UI[2], , "clock", , , , , 66, 66, 611, 127, , false, , , , , , , , , [
                        [UI[4], { src: RES[6] }],
                        [UI[6], { font: "34px", color: "#fff", align: 5 }, "time", , , , , "100%", "100%"],
                    ]],
                [UI[4], { src: RES[7] }, "disk", , , , , , , , , , false],
                [UI[2], { textStyle: "gameHead" }, , , , , , "100%", 70, , , , , , , , , , , , , [
                        [UI[3], { color: "#2c296e" }, , , , , , "100%", 70],
                        [UI[3], { color: "#6854aa" }, , , 70, , , "100%", 2],
                        [UI[4], , "avatar", 28, 13, , , 50, 50],
                        [UI[6], { format: 8 }, "name", 87, 24, , , 200, 27],
                        [UI[6], { text: "得分 0" }, "score", 290, 24, , , 140, 27],
                        [UI[6], { text: "机会 5" }, "chance", 430, 24, , , 120, 27],
                        [UI[5], { label: "说明" }, "help", 510, 24, , , 130, 30, , , , , , , , , , , { bk: { src: "" }, label: { color: "#5186ff" } }],
                        [UI[7], , "sound", 630, 8, , , 56, , , , , , , , , , , , { icon: { src: RES[8] }, checkImg: { src: RES[9] } }],
                    ]],
            ]
        },
    };
    ui.registerTemplates(Templates);
    class Button extends ui.Control {
        constructor(parent, template) {
            super(parent);
            this._init(Button);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(Button._childs);
            const n = this.namedChilds;
            this._initStates("normal", Button.States);
            this.bind("label", n.label, "text");
            this.width = 194;
            this.height = 70;
        }
        get namedChilds() { return this._namedChilds; }
    }
    Button.ClassName = "game.Button";
    Button.Styles = {
        blue: { childsProperty: { bk: { src: RES[10] } } },
        purple: { childsProperty: { bk: { src: RES[11] } } },
        yellow: { childsProperty: { bk: { src: RES[12] }, label: { gradient: { y0: 0, y1: 30, colors: ['#a54800', '#ce7300'] } } } }
    };
    Button.Properties = [
        { name: "label", type: "string" },
        { name: "style", type: "string", customProperty: true }
    ];
    Button.States = {
        normal: {},
        down: {}
    };
    Button._childs = [
        [UI[4], { src: RES[10] }, "bk", , , , , "100%", "100%"],
        [UI[6], { font: "30px", color: "#fff", align: 1 }, "label", , , , , "100%", 30, , "50%"]
    ];
    game.Button = Button;
    ui.initUIClass(Button, ui.Control);
    ui.addButtonEventHandler(Button, 0.8);
    class Checkbox extends ui.Control {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(Checkbox._childs);
            const n = this.namedChilds;
            this._initStates("uncheck", Checkbox.States);
        }
        get namedChilds() { return this._namedChilds; }
    }
    Checkbox.ClassName = "game.Checkbox";
    Checkbox.States = {
        check: { props: { childsProperty: { checkImg: { visible: true } } } },
        uncheck: { props: { childsProperty: { checkImg: { visible: false } } } }
    };
    Checkbox._childs = [
        [UI[4], , "icon", , , , , "100%", "100%"],
        [UI[4], , "checkImg", , , , , "100%", "100%"]
    ];
    game.Checkbox = Checkbox;
    ui.initUIClass(Checkbox, ui.Control);
    ui.addCheckboxEventHandler(Checkbox, 0.8);
    class templates extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
        }
    }
    templates.ClassName = "game.templates";
    game.templates = templates;
    ui.initUIClass(templates, ui.Container);
    class _GamePage extends ui.Container {
        constructor(parent, template) {
            super(parent);
            template = template || Templates.GamePage;
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(_GamePage._childs);
            const n = this.namedChilds;
            this.width = "100%";
            this.height = "100%";
        }
        get namedChilds() { return this._namedChilds; }
    }
    _GamePage.ClassName = "game.GamePage";
    _GamePage._childs = [
        [UI[0], , "game", 0, 0, , , 710, 1280, , , , , , , , , , , , , [
                { type: "Image", src: RES[0] },
                { type: "Image", src: RES[1], anchorX: 0.5, anchorY: 0.5, x: 242, y: 920.5 },
                { type: "Image", src: RES[2], angle: -33, x: 738, y: 535, anchorX: 0.5, anchorY: 0.5 },
                { type: "Image", src: RES[2], angle: 32, x: 562, y: 95, anchorX: 0.5, anchorY: 0.5 },
                { type: "Image", src: RES[3], anchorX: 0.5, anchorY: 0.5, x: 318, y: 578.5, width: 246, height: 119 },
            ]],
        [UI[1], , "touch", , , , , "100%", "100%"],
        [UI[2], , "intro", , , , , "100%", "100%", , , , , , , , , , , , , [
                [UI[3], { color: "#000" }, , , , , , "100%", "100%", , , 0.3],
                [UI[2], , , , , , , "100%", 600, , "50%", , , , , , , , , , , [
                        [UI[4], { src: RES[4] }, , , , , , , , "50%"],
                        [UI[5], { label: "确定" }, "ok2Btn", , 400, , , 195, 70, "50%"],
                    ]],
            ]],
        [UI[2], , "helpPage", , , , , "100%", "100%", , , , false, , , , , , , , , [
                [UI[3], { color: "#000" }, , , , , , "100%", "100%", , , 0.3],
                [UI[4], { src: RES[5] }, , , 160, , , , , "50%"],
                [UI[2], , , , 900, , 0, "100%", , , , , , , , , , , , , , [
                        [UI[5], { label: "已知晓" }, "okBtn", , "30%", , , 195, 70, "50%"],
                    ]],
            ]],
        [UI[2], , "clock", , , , , 66, 66, 611, 127, , false, , , , , , , , , [
                [UI[4], { src: RES[6] }],
                [UI[6], { font: "34px", color: "#fff", align: 5 }, "time", , , , , "100%", "100%"],
            ]],
        [UI[4], { src: RES[7] }, "disk", , , , , , , , , , false],
        [UI[2], { textStyle: "gameHead" }, , , , , , "100%", 70, , , , , , , , , , , , , [
                [UI[3], { color: "#2c296e" }, , , , , , "100%", 70],
                [UI[3], { color: "#6854aa" }, , , 70, , , "100%", 2],
                [UI[4], , "avatar", 28, 13, , , 50, 50],
                [UI[6], { format: 8 }, "name", 87, 24, , , 200, 27],
                [UI[6], { text: "得分 0" }, "score", 290, 24, , , 140, 27],
                [UI[6], { text: "机会 5" }, "chance", 430, 24, , , 120, 27],
                [UI[5], { label: "说明" }, "help", 510, 24, , , 130, 30, , , , , , , , , , , { bk: { src: "" }, label: { color: "#5186ff" } }],
                [UI[7], , "sound", 630, 8, , , 56, , , , , , , , , , , , { icon: { src: RES[8] }, checkImg: { src: RES[9] } }],
            ]]
    ];
    game._GamePage = _GamePage;
    ez.initCall(() => { ui.initUIClass(game.GamePage, ui.Container); });
    class MainFrame extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(MainFrame._childs);
            const n = this.namedChilds;
            this.width = "100%";
            this.height = "100%";
        }
        get namedChilds() { return this._namedChilds; }
    }
    MainFrame.ClassName = "game.MainFrame";
    MainFrame._childs = [
        [UI[3], { gradient: { y1: 1280, colors: ['#010036', '#4e004f'] } }, "bg", , , , , "100%", "100%"],
        [UI[2], , "frame", , , , , "100%", "100%", , , , , , , , , , , , , [
                [UI[8]],
            ]]
    ];
    game.MainFrame = MainFrame;
    ui.initUIClass(MainFrame, ui.Container);
    class ResultPage extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(ResultPage._childs);
            const n = this.namedChilds;
            this.width = "100%";
            this.height = "100%";
            this.textStyle = "normalCenter";
        }
        get namedChilds() { return this._namedChilds; }
    }
    ResultPage.ClassName = "game.ResultPage";
    ResultPage._childs = [
        [UI[4], { src: RES[13] }, , 198, 77, , , 336, 322],
        [UI[6], { text: "本局得分", align: 1 }, , , 462, , , 119, 29, "50%"],
        [UI[6], { text: "1000", strokeWidth: 4, strokeColor: "#9b8ddd", font: "50px", gradient: { y1: 50, colors: ['#a995ff', '#8670f4'] } }, "score", , 395, , , 280, 58, "50%"],
        [UI[6], , "info", , 530, , , 283, 32, "50%"],
        [UI[4], { src: RES[14] }, , 177, 503, , , 360, 2],
        [UI[4], { src: RES[14] }, , 177, 579, , , 360, 2],
        [UI[5], { label: "查看排行榜", style: "blue" }, "rank", , 669, , , 195, 70, "50%"],
        [UI[5], { label: "生成成绩单", style: "blue" }, "result", , 769, , , 195, 70, "50%"],
        [UI[2], , , , 840, , 0, "100%", , , , , , , , , , , , , , [
                [UI[5], { label: "再玩一次", style: "purple" }, "replay", , , , , 195, 70, "50%", "50%"],
            ]],
        [UI[9], , "rankPage", , , , , , , , , , false]
    ];
    game.ResultPage = ResultPage;
    ui.initUIClass(ResultPage, ui.Container);
    class SharePage extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(SharePage._childs);
            const n = this.namedChilds;
            this.width = "100%";
            this.height = "100%";
            this.textStyle = "normal";
            this.ownerBuffer = true;
        }
        get namedChilds() { return this._namedChilds; }
    }
    SharePage.ClassName = "game.SharePage";
    SharePage._childs = [
        [UI[3], { gradient: { y1: 1280, colors: ['#010036', '#4e004f'] } }, "bg", , , , , "100%", "100%"],
        [UI[4], { src: RES[15] }, , 64, 92, , , 323, 46],
        [UI[4], { src: RES[16] }, , 81, 300, , , 522, 231],
        [UI[6], { text: "姓名：" }, "name", 114, 337, , , 383, 37],
        [UI[6], { text: "成绩：10000" }, "score", 114, 387, , , 383, 37],
        [UI[6], , "info", 114, 439, , , 383, 37],
        [UI[4], { src: RES[17] }, , 65, 165],
        [UI[6], { font: "28px", color: "#bbadfb", lineHeight: 48, format: 2, text: "2020“创青春 交子杯”新网银行金融科技挑战赛\n47万奖金池，最高 10 万奖金等你来拿！\n是时候展现你真正的技术了！" }, , 68, 575, , , 585, 137],
        [UI[2], , , , 700, , 0, 300, , "50%", , , , , , , , , , , , [
                [UI[2], , , , , , , 300, 332, , "50%", , , , , , , , , , , [
                        [UI[4], { src: RES[18] }, "share", , , , , 300, 332],
                    ]],
            ]]
    ];
    game.SharePage = SharePage;
    ui.initUIClass(SharePage, ui.Container);
    class Splash extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(Splash._childs);
            this.width = "100%";
            this.height = "100%";
        }
    }
    Splash.ClassName = "game.Splash";
    Splash._childs = [
        [UI[4], { src: RES[19] }, , , , , , , , "50%", "50%"]
    ];
    game.Splash = Splash;
    ui.initUIClass(Splash, ui.Container);
    class _RankItem extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(_RankItem._childs);
            const n = this.namedChilds;
            this.width = 530;
            this.height = 88;
        }
        get namedChilds() { return this._namedChilds; }
    }
    _RankItem.ClassName = "game.RankItem";
    _RankItem._childs = [
        [UI[6], { color: "#42464d", align: 1, format: 8 }, "name", 217, 24, , , 180, 25],
        [UI[6], { color: "#42464d", align: 1 }, "rank", 20, 23, , , 50, 17, , , , false],
        [UI[6], { color: "#e04f00", align: 1 }, "score", 409, 24, , , 112, 25],
        [UI[4], { effect: "mask", effectParams: { mask: 'mask' } }, "avatar", 127, 7, , , 74, 74],
        [UI[3], { color: "#F0F0F0" }, , 0, 86, , , 530, 2],
        [UI[4], { src: RES[20] }, "rankIcon", 27, 15, , , 44, 48]
    ];
    game._RankItem = _RankItem;
    ez.initCall(() => { ui.initUIClass(game.RankItem, ui.Container); });
    class RankPage extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(RankPage._childs);
            const n = this.namedChilds;
            this.width = 640;
            this.height = 1300;
            this.left = 33;
            this.top = 0;
            this.textStyle = "rankPage";
        }
        get namedChilds() { return this._namedChilds; }
    }
    RankPage.ClassName = "game.RankPage";
    RankPage._childs = [
        [UI[4], { src: RES[21] }, , 0, 0, , , 640, 1300],
        [UI[4], { src: RES[22] }, , 45, 219, , , 540, 806],
        [UI[5], , "closeRank", 566, 200, , , 39, 38, , , , , , , , , , , { bk: { src: RES[23] } }],
        [UI[3], { color: "#F2F2F4" }, , 45, 319, , , 540, 78],
        [UI[6], { text: "排行" }, , 74, 344, , , 58, 28],
        [UI[6], { text: "头像" }, , 190, 344, , , 58, 28],
        [UI[6], { text: "昵称" }, , 334, 344, , , 58, 28],
        [UI[6], { text: "成绩" }, , 478, 344, , , 58, 28],
        [UI[6], { font: "32px", text: "排行榜TOP100", color: "#494b59" }, , 246, 253, , , 220, 34],
        [UI[4], { src: RES[24] }, , 187, 246, , , 44, 49],
        [UI[10], { scrollMode: 2 }, , 50, 402, , , 532, 617, , , , , , , , , , , , , [
                [UI[11], { itemClass: "game.RankItem", culling: true }, "rankList", , , , , 532],
            ]]
    ];
    game.RankPage = RankPage;
    ui.initUIClass(RankPage, ui.Container);
    class _StartPage extends ui.Container {
        constructor(parent, template) {
            super(parent);
            if (template) {
                this._createChilds(template.childs);
                template.init(this);
            }
            else
                this._createChilds(_StartPage._childs);
            const n = this.namedChilds;
            this.width = "100%";
            this.height = "100%";
        }
        get namedChilds() { return this._namedChilds; }
    }
    _StartPage.ClassName = "game.StartPage";
    _StartPage._childs = [
        [UI[4], { src: RES[0] }],
        [UI[2], , "mainPage", , , , , "100%", "100%", , , , , , , , , , , , , [
                [UI[0], , "stage", , , , , "100%", 1280, , "50%", , , , , , , , , , , [
                        { type: "Image", id: "蝙蝠侠", src: RES[25], x: 515, y: 812, anchorX: 0.5, anchorY: 0.5 },
                        { type: "Image", id: "猪", src: RES[26], x: 38, y: 112 },
                        { type: "Image", src: RES[27], x: 132, y: 538 },
                        { type: "Image", src: RES[28], x: 103, y: 402 },
                    ]],
                [UI[4], { src: RES[29] }, , , , , "10%", 237, 34, "50%"],
                [UI[5], , "help", 80, , , "15%", 218, 85, , , , , , , , , , , { bk: { src: RES[30] } }],
                [UI[5], , "start", , , 80, "15%", 218, 85, , , , , , , , , , , { bk: { src: RES[31] } }],
                [UI[5], { style: "yellow", label: "排行榜" }, "rank", 44, 92, , , 146, 54],
            ]],
        [UI[7], , "sound", 570, 92, , , 56, 59, , , , , , , , , , , { icon: { src: RES[8] }, checkImg: { src: RES[9] } }],
        [UI[2], , "helpPage", , , , , "100%", "100%", , , , false, , , , , , , , , [
                [UI[4], { src: RES[5] }, , , 160, , , , , "50%"],
                [UI[2], , , , 900, , 0, "100%", , , , , , , , , , , , , , [
                        [UI[5], { label: "已知晓" }, "okBtn", , "30%", , , 195, 70, "50%"],
                    ]],
            ]],
        [UI[9], , "rankPage", , , , , , , , , , false]
    ];
    game._StartPage = _StartPage;
    ez.initCall(() => { ui.initUIClass(game.StartPage, ui.Container); });
})(game || (game = {}));
//# sourceMappingURL=ui.js.map
declare var startTime;

/**
 * gobal data
 */
var url= "http://127.0.0.1:7000";


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

var mainFrame: game.MainFrame;
window.onmessage = function (ev) {
	console.log(ev.data);
	var data = ev.data;
	if(data.msg == "login" && data.info)
		PlayerInfo = JSON.parse(data.info);
	if(data.msg == "back"){
		mainFrame.clearChilds();
		mainFrame.createChild(game.GamePage);
	}
}

async function main() {
	window.parent.postMessage({ msg: "login" }, "*");
	ez.initialize({
		width: 710,
		height: 1280,
		minHeight: 1100,
		maxHeight: 1400,
		highDPI: true,
		wglOptions: { preserveDrawingBuffer: true },
		scaleMode: ez.ScreenAdaptMode.FixedWidth
	});
	ez.loadEZMDecoder(typeof (WebAssembly) === "undefined" ? "ezm.asm.js" : "ezm.wasm.js", 1);

	// 发布模式
	if (PUBLISH) {
		console.log("发布模式")
		ez.loadResPackage(game.resData, "res/", game.resGroups);
		ez.loadGroup(["ui", "start", "image/bg"], function(progress, total){
			if (progress >= total){
				var t = Date.now() - startTime;
				console.log("URL: "+ url+`/openapi/statistics/add?openid=${PlayerInfo.openid}&loadTime=${t}`);
				ajax(url+`/openapi/statistics/add?openid=${PlayerInfo.openid}&loadTime=${t}`, function () {});
				mainFrame = ez.getRoot().createChild(game.MainFrame);
				var loading = document.getElementById("loading");
				if (loading)
					document.body.removeChild(loading);
				ez.loadGroup(["game", "image/活动规则", "image/说明", "share"]);
			}else{
				console.log("progress<tatal");
			}
		});
	}
	else {
		console.log("线下")
		await ez.loadJSONPackageAsync("assets/resource.json", "assets/res/");
		ez.loadGroup(["ui", "start", "image/bg"], function (progress, total) {
			if (progress >= total) {
				var t = Date.now() - startTime;
				ajax(url+`/openapi/statistics/add?openid=${PlayerInfo.openid}&loadTime=${t}`, function () { });
				mainFrame = ez.getRoot().createChild(game.MainFrame);
				var loading = document.getElementById("loading");
				if (loading)
					document.body.removeChild(loading);
				ez.loadGroup(["game", "image/活动规则", "image/说明", "share"]);
			}
		});

		//mainFrame = ez.getRoot().createChild(game.MainFrame);
		//inspector.install();
	}
}

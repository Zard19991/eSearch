const { shell, ipcRenderer } = require("electron");
const os = require("os");

ipcRenderer.send("autostart", "get");
ipcRenderer.on("开机启动状态", (event, v) => {
    document.getElementById("autostart").checked = v;
});
document.getElementById("autostart").oninput = () => {
    ipcRenderer.send("autostart", "set", document.getElementById("autostart").checked);
};

document.getElementById("深色模式").value = store.get("深色模式");
document.getElementById("深色模式").onclick = () => {
    ipcRenderer.send("theme", document.getElementById("深色模式").value);
};

模糊 = store.get("模糊");
if (模糊 != 0) {
    document.documentElement.style.setProperty("--blur", `blur(${模糊}px)`);
} else {
    document.documentElement.style.setProperty("--blur", `none`);
}
document.querySelector("#模糊").value = 模糊;
document.querySelector("#模糊").oninput = () => {
    var 模糊 = document.querySelector("#模糊").value;
    if (模糊 != 0) {
        document.documentElement.style.setProperty("--blur", `blur(${模糊}px)`);
    } else {
        document.documentElement.style.setProperty("--blur", `none`);
    }
};

document.getElementById("全局缩放").value = store.get("全局缩放");

// 单选项目设置加载
function 选择器储存(id, 默认) {
    document.querySelector(`#${id}`).value = store.get(id) || 默认;
    document.querySelector(`#${id}`).onclick = () => {
        store.set(id, document.querySelector(`#${id}`).value);
    };
}

var 快捷键 = store.get("快捷键");
var ct = "";
for (i in 快捷键) {
    ct += `<div><hot-keys name="${i}" value="${快捷键[i].key || ""}"></hot-keys></div>`;
}
document.getElementById("快捷键").innerHTML = ct;

选择器储存("工具栏跟随", "展示内容优先");
选择器储存("光标", "以(1,1)为起点");
选择器储存("取色器默认格式", "HEX");

document.querySelector("#显示四角坐标").checked = store.get("显示四角坐标");

// 取色器设置
document.querySelector("#取色器大小").value = store.get("取色器大小");
document.querySelector("#像素大小").value = store.get("像素大小");
document.querySelector("#取色器大小").oninput = () => {
    if ((document.querySelector("#取色器大小").value - 0) % 2 == 0) {
        document.querySelector("#取色器大小").value = document.querySelector("#取色器大小").value - 0 + 1;
    }
    show_color_picker();
};
document.querySelector("#像素大小").oninput = () => {
    show_color_picker();
};

show_color_picker();
function show_color_picker() {
    color_size = document.querySelector("#取色器大小").value - 0;
    inner_html = "";
    for (i = 0; i < color_size ** 2; i++) {
        var l = Math.random() * 40 + 60;
        inner_html += `<span id="point_color_t"style="background:hsl(0,0%,${l}%);width:${
            document.querySelector("#像素大小").value
        }px;height:${document.querySelector("#像素大小").value}px"></span>`;
    }
    document.querySelector("#point_color").style.width =
        (document.querySelector("#像素大小").value - 0) * color_size + "px";
    document.querySelector("#point_color").style.height =
        (document.querySelector("#像素大小").value - 0) * color_size + "px";
    document.querySelector("#point_color").innerHTML = inner_html;
}

// 选区&遮罩颜色设置
document.querySelector("#遮罩颜色 > span").style.backgroundImage = `linear-gradient(${store.get(
    "遮罩颜色"
)}, ${store.get("遮罩颜色")}), url('assets/tbg.svg')`;
document.querySelector("#选区颜色 > span").style.backgroundImage = `linear-gradient(${store.get(
    "选区颜色"
)}, ${store.get("选区颜色")}), url('assets/tbg.svg')`;
document.querySelector("#遮罩颜色 > input").value = store.get("遮罩颜色");
document.querySelector("#选区颜色 > input").value = store.get("选区颜色");
document.querySelector("#遮罩颜色 > input").oninput = () => {
    document.querySelector("#遮罩颜色 > span").style.backgroundImage = `linear-gradient(${
        document.querySelector("#遮罩颜色 > input").value
    }, ${document.querySelector("#遮罩颜色 > input").value}), url('assets/tbg.svg')`;
};
document.querySelector("#选区颜色 > input").oninput = () => {
    document.querySelector("#选区颜色 > span").style.backgroundImage = `linear-gradient(${
        document.querySelector("#选区颜色 > input").value
    }, ${document.querySelector("#选区颜色 > input").value}), url('assets/tbg.svg')`;
};

document.getElementById("框选后默认操作").value = store.get("框选后默认操作");

document.getElementById("快速截图").value = store.get("快速截图.模式");
document.getElementById("快速截图路径").value = store.get("快速截图.路径");
document.getElementById("获取保存路径").onclick = () => {
    ipcRenderer.send("get_save_path", document.getElementById("快速截图路径").value || "");
    ipcRenderer.on("get_save_path", (e, a) => {
        document.getElementById("快速截图路径").value = a;
    });
};

document.getElementById("保存文件名称").value = store.get("保存名称");
document.getElementById("保存文件名称").oninput = show_f_time;
function show_f_time() {
    function f(fmt, date) {
        let ret;
        const opt = {
            YYYY: date.getFullYear() + "",
            YY: (date.getFullYear() % 1000) + "",
            MM: (date.getMonth() + 1 + "").padStart(2, "0"),
            M: date.getMonth() + 1 + "",
            DD: (date.getDate() + "").padStart(2, "0"),
            D: date.getDate() + "",
            d: date.getDay() + "",
            HH: (date.getHours() + "").padStart(2, "0"),
            H: date.getHours() + "",
            hh: ((date.getHours() % 12) + "").padStart(2, "0"),
            h: (date.getHours() % 12) + "",
            mm: (date.getMinutes() + "").padStart(2, "0"),
            m: date.getMinutes() + "",
            ss: (date.getSeconds() + "").padStart(2, "0"),
            s: date.getSeconds() + "",
            S: date.getMilliseconds() + "",
        };
        for (let k in opt) {
            ret = new RegExp(`\(\\W\)\(\?\<\!\\\\)${k}\(\\W\)\?`, "g");
            fmt = fmt.replace(ret, `$1${opt[k]}$2`);
        }
        return fmt;
    }
    var save_time = new Date();
    console.log(document.getElementById("保存文件名称").value);
    document.getElementById("保存文件名称_p").innerText = f(
        document.getElementById("保存文件名称").value,
        save_time
    ).replace("\\", "");
}
show_f_time();

document.getElementById("jpg质量").value = store.get("jpg质量");

var 字体 = store.get("字体");
document.documentElement.style.setProperty("--main-font", 字体.主要字体);
document.documentElement.style.setProperty("--monospace", 字体.等宽字体);
document.querySelector("#主要字体 > input").value = 字体.主要字体;
document.querySelector("#等宽字体 > input").value = 字体.等宽字体;
document.getElementById("字体大小").value = 字体.大小;
document.getElementById("记住字体大小").checked = 字体.记住;

document.querySelector("#主要字体 > input").oninput = () => {
    字体.主要字体 = document.querySelector("#主要字体 > input").value;
    document.documentElement.style.setProperty("--main-font", 字体.主要字体);
};
document.querySelector("#等宽字体 > input").oninput = () => {
    字体.等宽字体 = document.querySelector("#等宽字体 > input").value;
    document.documentElement.style.setProperty("--monospace", 字体.等宽字体);
};

document.getElementById("换行").checked = store.get("编辑器.自动换行");
document.getElementById("拼写检查").checked = store.get("编辑器.拼写检查");
document.getElementById("行号").checked = store.get("编辑器.行号");

document.querySelector("#自动搜索").checked = store.get("自动搜索");
document.querySelector("#自动打开链接").checked = store.get("自动打开链接");
document.querySelector("#自动搜索中文占比").value = store.get("自动搜索中文占比");

var o_搜索引擎 = store.get("搜索引擎");
if (o_搜索引擎) {
    var text = "";
    var default_en = `<set-select name="" id="默认搜索引擎">`;
    for (i in o_搜索引擎) {
        text += `${o_搜索引擎[i][0]}, ${o_搜索引擎[i][1]}\n`;
        default_en += `<div value="${o_搜索引擎[i][0]}">${o_搜索引擎[i][0]}</div>`;
    }
    document.querySelector("#搜索引擎").value = text;
    default_en += `</set-select>`;
    document.getElementById("默认搜索引擎div").innerHTML = default_en;
    document.getElementById("默认搜索引擎").value = store.get("引擎.默认搜索引擎");
}
document.querySelector("#搜索引擎").onchange = () => {
    o_搜索引擎 = [];
    var text = document.querySelector("#搜索引擎").value;
    var text_l = text.split("\n");
    var default_en = `<set-select name="" id="默认搜索引擎">`;
    for (i in text_l) {
        var r = /(\S+)\W*[,，:：]\W*(\S+)/g;
        var l = text_l[i].replace(r, "$1,$2").split(",");
        if (l[0] != "") {
            o_搜索引擎[i] = [l[0], l[1]];
            default_en += `<div value="${l[0]}">${l[0]}</div>`;
        }
    }
    default_en += `</set-select>`;
    document.getElementById("默认搜索引擎div").innerHTML = default_en;
    document.getElementById("默认搜索引擎").value = o_搜索引擎[0][0];
};

var o_翻译引擎 = store.get("翻译引擎");
if (o_翻译引擎) {
    var text = "";
    var default_en = `<set-select name="" id="默认翻译引擎">`;
    for (i in o_翻译引擎) {
        text += `${o_翻译引擎[i][0]}, ${o_翻译引擎[i][1]}\n`;
        default_en += `<div value="${o_翻译引擎[i][0]}">${o_翻译引擎[i][0]}</div>`;
    }
    document.querySelector("#翻译引擎").value = text;
    default_en += `</set-select>`;
    document.getElementById("默认翻译引擎div").innerHTML = default_en;
    document.getElementById("默认翻译引擎").value = store.get("引擎.默认翻译引擎");
}
document.querySelector("#翻译引擎").onchange = () => {
    o_翻译引擎 = [];
    var text = document.querySelector("#翻译引擎").value;
    var text_l = text.split("\n");
    var default_en = `<set-select name="" id="默认翻译引擎">`;
    for (i in text_l) {
        var r = /(\S+)\W*[,，:：]\W*(\S+)/g;
        var l = text_l[i].replace(r, "$1,$2").split(",");
        if (l[0] != "") {
            o_翻译引擎[i] = [l[0], l[1]];
            default_en += `<div value="${l[0]}">${l[0]}</div>`;
        }
    }
    default_en += `</set-select>`;
    document.getElementById("默认翻译引擎div").innerHTML = default_en;
    document.getElementById("默认翻译引擎").value = o_翻译引擎[0][0];
};
document.getElementById("记住引擎").checked = store.get("引擎.记住");

document.getElementById("图像搜索引擎").value = store.get("以图搜图.引擎");
document.getElementById("记住识图引擎").checked = store.get("以图搜图.记住");

document.querySelector("#浏览器中打开").checked = store.get("浏览器中打开");

document.querySelector("#main").onclick = () => {
    window.location.href = "index.html";
};

document.getElementById("OCR类型").value = store.get("OCR.类型");
ocr_d_open();
function ocr_d_open() {
    document.getElementById("baidu_details").open = false;
    document.getElementById("youdao_details").open = false;
    if (document.getElementById("OCR类型").value == "baidu") {
        document.getElementById("baidu_details").open = true;
    } else if (document.getElementById("OCR类型").value == "youdao") {
        document.getElementById("youdao_details").open = true;
    }
}
document.getElementById("OCR类型").onclick = ocr_d_open;
document.getElementById("检查OCR").checked = store.get("OCR.检查OCR");
document.getElementById("记住OCR引擎").checked = store.get("OCR.记住");
document.getElementById("离线切换").checked = store.get("OCR.离线切换");
document.getElementById("ocr_det").value = store.get("OCR.det");
document.getElementById("ocr_rec").value = store.get("OCR.rec");
document.getElementById("ocr_字典").value = store.get("OCR.字典");
document.getElementById("下载离线OCR").onclick = () => {
    ipcRenderer.send("setting", "下载离线OCR");
};
document.getElementById("删除离线OCR").onclick = () => {
    ipcRenderer.send("setting", "删除离线OCR");
};
document.getElementById("baidu_ocr_url").value = store.get("在线OCR.baidu.url");
document.getElementById("baidu_ocr_id").value = store.get("在线OCR.baidu.id");
document.getElementById("baidu_ocr_secret").value = store.get("在线OCR.baidu.secret");
document.getElementById("youdao_ocr_id").value = store.get("在线OCR.youdao.id");
document.getElementById("youdao_ocr_secret").value = store.get("在线OCR.youdao.secret");

历史记录设置 = store.get("历史记录设置");

document.querySelector("#清除历史记录").disabled = !历史记录设置.保留历史记录;
document.querySelector("#his_d").disabled = !历史记录设置.自动清除历史记录;
document.querySelector("#his_h").disabled = !历史记录设置.自动清除历史记录;
document.querySelector("#his_d").value = 历史记录设置.d;
document.querySelector("#his_h").value = 历史记录设置.h;

document.querySelector("#历史记录_b").oninput = () => {
    历史记录设置.保留历史记录 = document.querySelector("#历史记录_b").checked;
    document.querySelector("#清除历史记录").disabled = !document.querySelector("#历史记录_b").checked;
};
document.querySelector("#清除历史记录").oninput = () => {
    历史记录设置.自动清除历史记录 = document.querySelector("#清除历史记录").checked;
    document.querySelector("#his_d").disabled = !document.querySelector("#清除历史记录").checked;
    document.querySelector("#his_h").disabled = !document.querySelector("#清除历史记录").checked;
};
document.getElementById("clear_his").onclick = () => {
    var c = confirm("这将清除所有的历史记录\n且不能复原\n确定清除？");
    if (c) store.set("历史记录", []);
};

document.getElementById("代理").checked = store.get("开启代理");
var 代理 = store.get("代理");
document.getElementById("pacScript").value = 代理.pacScript;
document.getElementById("proxyRules").value = 代理.proxyRules;
document.getElementById("proxyBypassRules").value = 代理.proxyBypassRules;

document.getElementById("主关子").checked = store.get("关闭窗口.子窗口跟随主窗口关");
document.getElementById("子关主").checked = store.get("关闭窗口.主窗口跟随子窗口关");
document.getElementById("主窗口失焦").checked = store.get("关闭窗口.失焦")[0];
document.getElementById("搜索窗口失焦").checked = store.get("关闭窗口.失焦")[1];

document.getElementById("打开config").title = store.path;
document.getElementById("打开config").onclick = () => {
    shell.openPath(store.path);
};

var give_up = false;
document.getElementById("give_up_setting_b").oninput = () => {
    give_up = document.getElementById("give_up_setting_b").checked;
    if (give_up) {
        document.getElementById("give_up_setting_b").title = "关闭此界面后将不保存部分设置值";
    } else {
        document.getElementById("give_up_setting_b").title = "不保存设置值";
    }
};

window.onbeforeunload = () => {
    try {
        save_setting();
    } catch {
        ipcRenderer.send("setting", "save_err");
    }
    ipcRenderer.send("setting", "reload_main");
};

function save_setting() {
    if (give_up) return;
    var 模糊 = document.querySelector("#模糊").value - 0;
    store.set("模糊", 模糊);
    store.set("全局缩放", document.getElementById("全局缩放").value - 0);
    store.set("显示四角坐标", document.querySelector("#显示四角坐标").checked);
    store.set("取色器大小", document.querySelector("#取色器大小").value - 0);
    store.set("像素大小", document.querySelector("#像素大小").value - 0);
    store.set("遮罩颜色", document.querySelector("#遮罩颜色 > input").value);
    store.set("选区颜色", document.querySelector("#选区颜色 > input").value);
    store.set("框选后默认操作", document.getElementById("框选后默认操作").value);
    store.set("快速截图.模式", document.getElementById("快速截图").value);
    store.set(
        "快速截图.路径",
        document.getElementById("快速截图路径").value
            ? (document.getElementById("快速截图路径").value + "/").replace("//", "/")
            : ""
    );
    store.set("保存名称", document.getElementById("保存文件名称").value.replace("//", "//"));
    store.set("jpg质量", document.getElementById("jpg质量").value - 0);
    字体.大小 = document.getElementById("字体大小").value - 0;
    字体.记住 = document.getElementById("记住字体大小").checked
        ? typeof 字体.记住 === "number"
            ? 字体.记住
            : 字体.大小
        : false;
    store.set("字体", 字体);
    store.set("编辑器.自动换行", document.getElementById("换行").checked);
    store.set("编辑器.拼写检查", document.getElementById("拼写检查").checked);
    store.set("编辑器.行号", document.getElementById("行号").checked);
    store.set("自动搜索", document.querySelector("#自动搜索").checked);
    store.set("自动打开链接", document.querySelector("#自动打开链接").checked);
    store.set("自动搜索中文占比", document.querySelector("#自动搜索中文占比").value - 0);
    if (o_搜索引擎) store.set("搜索引擎", o_搜索引擎);
    if (o_翻译引擎) store.set("翻译引擎", o_翻译引擎);
    store.set("引擎", {
        记住: document.getElementById("记住引擎").checked
            ? [document.getElementById("默认搜索引擎").value, document.getElementById("默认翻译引擎").value]
            : false,
        默认搜索引擎: document.getElementById("默认搜索引擎").value,
        默认翻译引擎: document.getElementById("默认翻译引擎").value,
    });
    store.set("以图搜图", {
        引擎: document.getElementById("图像搜索引擎").value,
        记住: document.getElementById("记住识图引擎").checked
            ? store.get("以图搜图.记住") || document.getElementById("图像搜索引擎").value
            : false,
    });
    store.set("浏览器中打开", document.querySelector("#浏览器中打开").checked);
    历史记录设置.d = document.querySelector("#his_d").value - 0;
    历史记录设置.h = document.querySelector("#his_h").value - 0;
    store.set("历史记录设置", 历史记录设置);
    store.set("OCR", {
        类型: document.getElementById("OCR类型").value,
        检查OCR: document.getElementById("检查OCR").checked,
        离线切换: document.getElementById("离线切换").checked,
        det: document.getElementById("ocr_det").value,
        rec: document.getElementById("ocr_rec").value,
        字典: document.getElementById("ocr_字典").value,
        记住: document.getElementById("记住OCR引擎").checked
            ? store.get("OCR.记住") || document.getElementById("OCR类型").value
            : false,
    });
    store.set("在线OCR.baidu", {
        url: document.getElementById("baidu_ocr_url").value,
        id: document.getElementById("baidu_ocr_id").value,
        secret: document.getElementById("baidu_ocr_secret").value,
    });
    store.set("在线OCR.youdao", {
        id: document.getElementById("youdao_ocr_id").value,
        secret: document.getElementById("youdao_ocr_secret").value,
    });
    store.set("开启代理", document.getElementById("代理").checked);
    store.set("代理", {
        pacScript: document.getElementById("pacScript").value,
        proxyRules: document.getElementById("proxyRules").value,
        proxyBypassRules: document.getElementById("proxyBypassRules").value,
    });
    store.set("关闭窗口", {
        失焦: [document.getElementById("主窗口失焦").checked, document.getElementById("搜索窗口失焦").checked],
        子窗口跟随主窗口关: document.getElementById("主关子").checked,
        主窗口跟随子窗口关: document.getElementById("子关主").checked,
    });
}

var path_info = `运行目录：${__dirname}<br>
                配置目录：${store.path.replace(/[/\\]config\.json/, "")}<br>
                OCR 目录：${store.path.replace("config.json", "ocr")}<br>
                临时目录：${os.tmpdir()}${os.platform == "win32" ? "\\" : "/"}eSearch`;
document.createTextNode(path_info);
document.getElementById("path_info").insertAdjacentHTML("afterend", path_info);

var version = `<div>本机系统: ${os.type()} ${os.release()}</div>`;
var version_l = ["electron", "node", "chrome", "v8"];
for (i in version_l) {
    version += `<div>${version_l[i]}: ${process.versions[version_l[i]]}</div>`;
}
document.getElementById("versions_info").insertAdjacentHTML("afterend", version);

var package = require("./package.json");
document.getElementById("name").innerHTML = package.name;
document.querySelector("#version").innerHTML = package.version;
document.getElementById("description").innerHTML = package.description;
document.getElementById("version").onclick = () => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    fetch("https://api.github.com/repos/xushengfeng/eSearch/releases/latest", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            result = JSON.parse(result);
            console.log(result);
            if (version_new(result.name, package.version) && !result.draft && !result.prerelease) {
                document.getElementById(
                    "update_info"
                ).innerHTML = `有新版本: <a href="${result.html_url}">${result.name}</a>`;
            } else {
                document.getElementById("update_info").innerHTML = "暂无更新";
            }
        })
        .catch((error) => console.log("error", error));
};
function version_new(v1, v2) {
    v1 = v1.split(".");
    v2 = v2.split(".");
    if (v1[0] >= v2[0] && v1[1] >= v2[1] && v1[2] > v2[2]) {
        return true;
    } else {
        return false;
    }
}
document.querySelector("#info").innerHTML = `<div>项目主页: <a href="${package.homepage}">${package.homepage}</a></div>
    <div><a href="https://github.com/xushengfeng/eSearch/releases/tag/${package.version}">更新日志</a></div>
    <div>本软件遵循 <a href="https://www.gnu.org/licenses/gpl-3.0.html">${package.license}</a> 协议</div>
    <div>本软件基于 <a href="all_license.json">这些软件</a></div>
    <div>Copyright (C) 2021 ${package.author.name} ${package.author.email}</div>`;

document.querySelector("#about").onclick = (e) => {
    console.log(e.target);
    if (e.target.tagName == "A") {
        e.preventDefault();
        shell.openExternal(e.target.href);
    }
};

ipcRenderer.on("about", (event, arg) => {
    if (arg != undefined) {
        location.hash = "#about";
    }
});

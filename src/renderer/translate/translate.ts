import xtranslator, { matchFitLan } from "xtranslator";
import { getImgUrl, initStyle } from "../root/root";
const fs = require("node:fs") as typeof import("fs");
import { franc, francAll } from "franc";
import convert3To1 from "iso-639-3-to-1";

import store from "../../../lib/store/renderStore";

import {
    button,
    ele,
    frame,
    image,
    p,
    pureStyle,
    spacer,
    txt,
    view,
} from "dkh-ui";

pureStyle();

initStyle(store);

// @auto-path:../assets/icons/$.svg
function iconButton(img: string) {
    return button(
        image(getImgUrl(`${img}.svg`), "icon")
            .class("icon")
            .style({ width: "100%", height: "100%" }),
    ).style({
        position: "relative",
    });
}

const input = ele("textarea").style({
    width: "100%",
    padding: "8px",
    resize: "vertical",
    // @ts-ignore
    "field-sizing": "content",
    "min-height": "4lh",
});
const lans = view("x");

const setLan = (el: HTMLSelectElement, lan: string) => {
    const supportLans = Array.from(el.querySelectorAll("option")).map(
        (i) => i.value,
    );
    const matchLan = matchFitLan(lan, supportLans) ?? supportLans[0];
    el.value = matchLan;
};

const lansFrom = ele("select")
    .on("change", () => {
        translate(input.el.value);
    })
    .bindGet((el) => el.value)
    .bindSet((lan: string, el) => setLan(el, lan));
const lansTo = ele("select")
    .on("change", () => {
        translate(input.el.value);
    })
    .bindGet((el) => el.value)
    .bindSet((lan: string, el) => setLan(el, lan));

const results = view("y").style({
    gap: "16px",
    padding: "8px",
    overflow: "auto",
});

lans.add([lansFrom, lansTo]);

input.addInto();
lans.addInto();
results.addInto();

type saveData = {
    from: string;
    to: string;
    fromT: string;
    toT: string;
    engine: string;
};

function translate(_text: string) {
    results.el.innerHTML = "";
    const text = _text.trim();
    if (!text) return;

    const fromLan = lansFrom.gv;
    const toLan = lansTo.gv;

    for (const i of fyq) {
        const copy = iconButton("copy").style({
            width: "24px",
            height: "24px",
        });
        const save = iconButton("star").style({
            width: "24px",
            height: "24px",
            display:
                showCang.fetch.length && showCang.文件.length
                    ? "block"
                    : "none",
        });
        const reTry = iconButton("reload")
            .style({
                width: "24px",
                height: "24px",
            })
            .on("click", () => {
                f();
            });
        const checkEl = iconButton("replace").style({
            width: "24px",
            height: "24px",
            display: fromLan === "auto" ? "none" : "",
        });
        const e = frame(`result${i.id}`, {
            _: view().style({ width: "100%" }),
            title: {
                _: view("x").style({ "align-items": "center" }),
                _spacer: spacer(),
                name: txt(i.name).style({ "margin-right": "4px" }),
                copy,
                save,
                reTry,
                checkEl,
            },
            content: p(""),
        });
        results.add(e.el);
        const c = e.els.content;
        const f = () =>
            fanyiqi
                .get(i.id)
                // @ts-ignore
                .run(text, fromLan, toLan)
                .then((_ttext: string) => {
                    const ttext = _ttext.trim();
                    c.el.innerText = ttext;
                    copy.on("click", () => {
                        navigator.clipboard.writeText(ttext);
                    });
                    save.on("click", () => {
                        saveW({
                            from: fromLan,
                            to: toLan,
                            fromT: text,
                            toT: ttext,
                            engine: i.name,
                        });
                    });
                    checkEl.on("click", async () => {
                        const t = await fanyiqi
                            .get(i.id)
                            // @ts-ignore
                            .run(text, toLan, fromLan);
                        c.el.innerText += `\n---\n${t}`;
                    });
                })
                .catch((err) => {
                    console.error(err);
                    c.el.innerText = "翻译失败，请重试";
                });
        f();
    }
    const cl = c常用语言.filter((i) => i !== fromLan && i !== toLan);
    store.set(
        "翻译.常用语言",
        [toLan, fromLan, ...cl].filter((i) => i !== "auto"),
    );
}

function saveW(obj: saveData) {
    saveFile(obj);
    saveFetch(obj);
}

function saveTemplate(t: string, obj: saveData) {
    return t
        .replaceAll("${from}", obj.from)
        .replaceAll("${to}", obj.to)
        .replaceAll("${fromT}", obj.fromT)
        .replaceAll("${toT}", obj.toT)
        .replaceAll("${engine}", obj.engine);
}

function saveFile(obj: saveData) {
    const filesx = showCang.文件;
    for (const i of filesx) {
        fs.appendFile(i.path, `\n${saveTemplate(i.template, obj)}`, () => {});
    }
}

function saveFetch(obj: saveData) {
    const webx = showCang.fetch;
    for (const i of webx) {
        fetch(saveTemplate(i.url, obj), {
            method: i.method,
            body: saveTemplate(i.body, obj),
            headers: i.headers,
        });
    }
}

function getLansName(l: string[]) {
    const mainLan = store.get("语言.语言");
    const trans = new Intl.DisplayNames(mainLan, { type: "language" });
    const lansName = l.map((i) => ({
        text: i === "auto" ? "自动" : trans.of(i),
        lan: i,
    }));
    return lansName.toSorted((a, b) => a.text.localeCompare(b.text, mainLan));
}

function pick2First(list: { text: string; lan: string }[], toPick: string[]) {
    const baseList = list.filter((i) => !toPick.includes(i.lan));
    const first = toPick.map((i) => list.find((j) => j.lan === i));
    return first.concat(baseList);
}

function detectLan(text: string) {
    const fromLan =
        francAll(text)
            .map((i) => convert3To1(i[0]))
            .filter((i) => i)
            .at(0) ?? "auto";
    console.log("检测语言：", fromLan);

    const m = matchFitLan(fromLan, c常用语言);
    const toLan =
        c常用语言.filter((i) => i !== m).at(0) ?? store.get("语言.语言");
    lansFrom.sv(fromLan);
    lansTo.sv(toLan);
}

const inputText = decodeURIComponent(
    new URLSearchParams(location.search).get("text") || "",
).trim();

const fyq = store.get("翻译.翻译器");
const fanyiqi = new Map(
    fyq.map((f) => {
        const e = xtranslator.es[f.type]();
        // @ts-ignore
        e.setKeys(f.keys);
        return [f.id, e];
    }),
);

const showCang = store.get("翻译.收藏");

const allFromLan = Array.from(
    new Set(fyq.flatMap((f) => xtranslator.e[f.type]?.lan)),
);
const allToLan = Array.from(
    new Set(fyq.flatMap((f) => xtranslator.e[f.type]?.targetLan)),
);

console.log("allFromLan", allFromLan);
console.log("allToLan", allToLan);

const c常用语言 = store.get("翻译.常用语言");

lansFrom.add(
    pick2First(getLansName(allFromLan), ["auto", ...c常用语言]).map((v) =>
        ele("option").add(txt(v.text)).attr({ value: v.lan }),
    ),
);
lansTo.add(
    pick2First(getLansName(allToLan), c常用语言).map((v) =>
        ele("option").add(txt(v.text)).attr({ value: v.lan }),
    ),
);

input.el.value = inputText;
if (inputText) {
    detectLan(inputText);
    translate(inputText);
} else {
    lansFrom.sv("auto");
    lansTo.sv(store.get("语言.语言"));
}

let composing = false;
input
    .on("compositionstart", () => {
        composing = true;
    })
    .on("compositionend", () => {
        composing = false;
    });

let lastTrans: NodeJS.Timeout;

input.on("input", () => {
    if (composing) return;
    if (lastTrans) clearTimeout(lastTrans);
    lastTrans = setTimeout(() => {
        // translate(input.el.value);
    }, 2000);
    detectLan(input.el.value);
});

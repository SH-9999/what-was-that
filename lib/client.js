window.__ModuleLoader__.load({ id: 'what-was-that', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply
});
module.exports = __toCommonJS(index_exports);
var CSS = '[data-shell-overlay]{z-index:100!important}.wwt-scrim{position:fixed;inset:0;z-index:1;background:transparent;border:0;padding:0;margin:0;cursor:default;pointer-events:auto}.wwt-pet{--wwt-soft:var(--dsw-alias-bg-layer-1);--wwt-fg:var(--dsw-alias-label-primary);--wwt-line:var(--dsw-alias-border-l2);position:fixed;right:22px;bottom:22px;z-index:105;width:108px;height:124px;user-select:none;-webkit-user-select:none;touch-action:none;cursor:grab;pointer-events:auto}.wwt-pet:active{cursor:grabbing}.wwt-body{position:relative;width:108px;height:124px;z-index:2;pointer-events:none;animation:wwt-float 2.8s ease-in-out infinite;filter:drop-shadow(0 6px 14px rgba(230,120,40,.30))}.wwt-body.thinking{animation-duration:1.1s}.wwt-img{position:absolute;left:0;top:0;width:108px;height:124px;object-fit:contain;pointer-events:none;animation:wwt-float 2.8s ease-in-out infinite;filter:drop-shadow(0 6px 14px rgba(230,120,40,.35))}@keyframes wwt-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}.wwt-badge{position:absolute;top:2px;right:4px;z-index:3;display:flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:11px;background:linear-gradient(135deg,#ff6b6b,#ee5a6f);color:#fff;font-size:13px;font-weight:800;line-height:1;box-shadow:0 3px 8px rgba(238,90,111,.5);animation:wwt-badgepop .25s ease-out;font-family:system-ui,sans-serif;pointer-events:none;border:2px solid var(--wwt-soft)}@keyframes wwt-badgepop{0%{transform:scale(0)}70%{transform:scale(1.18)}100%{transform:scale(1)}}.wwt-bubble{position:absolute;right:0;bottom:132px;z-index:10;width:min(340px,82vw);background:var(--wwt-soft);color:var(--wwt-fg);border:1px solid var(--wwt-line);border-radius:16px;padding:12px 14px;box-shadow:0 12px 32px rgba(0,0,0,.22);font-size:13px;line-height:1.7;font-family:system-ui,-apple-system,sans-serif;cursor:default;text-align:left;animation:wwt-pop .18s ease-out;pointer-events:auto}@keyframes wwt-pop{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:none}}.wwt-btitle{font-weight:700;font-size:11.5px;opacity:.65;margin:2px 0 7px}.wwt-chip{display:inline-block;margin:0 6px 7px 0;padding:4px 12px;border:1px solid var(--wwt-line);border-radius:999px;background:none;color:var(--wwt-fg);font-size:12.5px;cursor:pointer;transition:background .15s}.wwt-chip:hover{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 14%, transparent)}.wwt-detail{margin-top:2px;padding-top:8px}.wwt-detail .wwt-term{font-weight:700;font-size:14px;color:var(--dsw-alias-state-business-primary)}.wwt-detail .wwt-cat{font-size:10.5px;opacity:.55;margin-left:6px}.wwt-detail .wwt-text{margin:6px 0 8px;white-space:pre-wrap}.wwt-detail .wwt-route{font-size:10.5px;opacity:.5}.wwt-deep{margin-top:6px;border:1px solid var(--wwt-line);background:none;color:var(--wwt-fg);border-radius:10px;font-size:11.5px;padding:4px 12px;cursor:pointer}.wwt-deep:hover{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 14%, transparent)}.wwt-nohit{opacity:.8;display:flex;align-items:center;gap:5px}.wwt-limit{margin-top:6px;font-size:12px;opacity:.9;display:flex;align-items:center;gap:5px}.wwt-loadbar{position:relative;height:3px;border-radius:2px;background:var(--wwt-line);overflow:hidden;margin-top:9px}.wwt-loadbar::after{content:"";position:absolute;left:-40%;top:0;bottom:0;width:40%;border-radius:2px;background:linear-gradient(90deg,transparent,var(--dsw-alias-state-business-primary),transparent);animation:wwt-shimmer 1.1s infinite}@keyframes wwt-shimmer{from{left:-40%}to{left:100%}}.wwt-mini{display:inline-block;vertical-align:-3px;flex:none}.wwt-sel{position:fixed;z-index:120;width:min(300px,70vw);background:var(--wwt-soft);color:var(--wwt-fg);border:1px solid var(--wwt-line);border-radius:14px;padding:11px 13px 10px;box-shadow:0 10px 28px rgba(0,0,0,.22);font-size:12.5px;line-height:1.65;font-family:system-ui,-apple-system,sans-serif;animation:wwt-pop .15s ease-out;cursor:default}.wwt-sel-term{font-weight:700;font-size:13.5px;color:var(--dsw-alias-state-business-primary)}.wwt-sel-cat{font-size:10.5px;opacity:.55;margin-left:6px}.wwt-sel-text{margin:5px 0 8px;white-space:pre-wrap}.wwt-sel-close{position:absolute;top:6px;right:8px;border:0;background:none;color:var(--wwt-fg);opacity:.5;font-size:15px;cursor:pointer;line-height:1;padding:2px}.wwt-sel-close:hover{opacity:.9}.wwt-sel-actions{display:flex;gap:8px;align-items:center;justify-content:space-between}.wwt-sel-deep{border:1px solid var(--wwt-line);background:none;color:var(--wwt-fg);border-radius:8px;font-size:11px;padding:3px 10px;cursor:pointer;font-family:inherit}.wwt-sel-deep:hover{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 14%, transparent)}.wwt-sel-route{font-size:10px;opacity:.5}.wwt-sel-mini{display:inline-block;vertical-align:-2px;margin-right:4px}';
function createPetStore() {
  let state = { turn: null, mode: "idle", detail: null };
  const subs = [];
  function set(patch) {
    state = Object.assign({}, state, patch);
    for (let i = 0; i < subs.length; i++) subs[i]();
  }
  return {
    get: function() {
      return state;
    },
    subscribe: function(fn) {
      subs.push(fn);
      return function() {
        const j = subs.indexOf(fn);
        if (j >= 0) subs.splice(j, 1);
      };
    },
    offerTurn: function(r) {
      if (!r || typeof r.seq !== "number") return;
      if (state.turn && state.turn.seq > r.seq) return;
      const hits = r.hits || [];
      set({ turn: { seq: r.seq, messageId: r.messageId || "", hits }, mode: hits.length ? "question" : "idle", detail: null });
    },
    thinking: function(text) {
      set({ mode: "thinking", detail: text ? { kind: "thinking", text } : state.detail });
    },
    showDetail: function(d) {
      set({ mode: d.kind === "explain" ? "happy" : "speaking", detail: d });
    },
    open: function() {
      set({ mode: "idle" });
    },
    calm: function() {
      set({ mode: state.turn && state.turn.hits && state.turn.hits.length ? "question" : "idle", detail: null });
    }
  };
}
function createSelectStore() {
  let card = null;
  const subs = [];
  function emit() {
    for (let i = 0; i < subs.length; i++) subs[i]();
  }
  return {
    get: function() {
      return card;
    },
    subscribe: function(fn) {
      subs.push(fn);
      return function() {
        const j = subs.indexOf(fn);
        if (j >= 0) subs.splice(j, 1);
      };
    },
    set: function(c) {
      card = c;
      emit();
    },
    clear: function() {
      if (card !== null) {
        card = null;
        emit();
      }
    }
  };
}
function MiniOcto() {
  return React.createElement(
    "svg",
    { className: "wwt-mini", viewBox: "0 0 24 24", width: "17", height: "17" },
    React.createElement("path", { d: "M4 15 Q2 18 4.5 19.5 Q6 21 7.5 18.5", fill: "#ffb066" }),
    React.createElement("path", { d: "M20 15 Q22 18 19.5 19.5 Q18 21 16.5 18.5", fill: "#ffb066" }),
    React.createElement("path", { d: "M6.5 14 Q5 17 7 18.5", stroke: "#ff8433", strokeWidth: 1.6, fill: "none", strokeLinecap: "round" }),
    React.createElement("path", { d: "M17.5 14 Q19 17 17 18.5", stroke: "#ff8433", strokeWidth: 1.6, fill: "none", strokeLinecap: "round" }),
    React.createElement("path", { d: "M9.5 20 Q12 21.5 14.5 20", stroke: "#ff8433", strokeWidth: 1.4, fill: "none", strokeLinecap: "round" }),
    React.createElement("ellipse", { cx: 12, cy: 11.5, rx: 8, ry: 7, fill: "#ffa14d" }),
    React.createElement("ellipse", { cx: 12, cy: 13, rx: 5, ry: 3.2, fill: "#ffe3b3", opacity: 0.6 }),
    React.createElement("circle", { cx: 9.3, cy: 10.6, r: 2.2, fill: "#3a1f08" }),
    React.createElement("circle", { cx: 14.7, cy: 10.6, r: 2.2, fill: "#3a1f08" }),
    React.createElement("circle", { cx: 8.8, cy: 10, r: 0.9, fill: "#fff" }),
    React.createElement("circle", { cx: 14.2, cy: 10, r: 0.9, fill: "#fff" }),
    React.createElement("path", { d: "M10 14.6 Q12 15.8 14 14.6", stroke: "#3a1f08", strokeWidth: 1.1, fill: "none", strokeLinecap: "round" })
  );
}
function OctoSvg(mood) {
  const pupil = "#3a1f08", blush = "#ff9e7a";
  const gTop = "#ffbd6b", gBot = "#ff823a", belly = "#ffe3b3";
  const tents = [
    React.createElement("path", { key: "t1", d: "M26 90 Q16 98 20 110 Q24 118 32 112 Q36 108 33 100 Q30 94 26 90 Z", fill: "#ffaf63" }),
    React.createElement("path", { key: "t2", d: "M40 92 Q33 102 37 113 Q41 119 47 113 Q50 109 47 101 Q44 95 40 92 Z", fill: "#ffa14d" }),
    React.createElement("path", { key: "t3", d: "M52 94 Q48 106 52 115 Q56 120 61 114 Q63 109 60 101 Q57 96 52 94 Z", fill: "#ff9440" }),
    React.createElement("path", { key: "t4", d: "M63 95 Q61 108 65 116 Q69 121 72 114 Q73 108 71 100 Q68 96 63 95 Z", fill: "#ff8a38" }),
    React.createElement("path", { key: "t5", d: "M77 95 Q79 108 75 116 Q71 121 68 114 Q67 108 69 100 Q72 96 77 95 Z", fill: "#ff8a38" }),
    React.createElement("path", { key: "t6", d: "M88 94 Q92 106 88 115 Q84 120 79 114 Q77 109 80 101 Q83 96 88 94 Z", fill: "#ff9440" }),
    React.createElement("path", { key: "t7", d: "M100 92 Q107 102 103 113 Q99 119 93 113 Q90 109 93 101 Q96 95 100 92 Z", fill: "#ffa14d" }),
    React.createElement("path", { key: "t8", d: "M114 90 Q124 98 120 110 Q116 118 108 112 Q104 108 107 100 Q110 94 114 90 Z", fill: "#ffaf63" })
  ];
  const curl = React.createElement("path", { key: "curl", d: "M68 17 Q72 5 84 7 Q92 9 86 18", stroke: "#ff7a28", strokeWidth: 4, fill: "none", strokeLinecap: "round" });
  let face;
  if (mood === "thinking") {
    face = [
      React.createElement("ellipse", { key: "e1", cx: 53, cy: 56, rx: 8, ry: 3.5, fill: pupil }),
      React.createElement("ellipse", { key: "e2", cx: 87, cy: 56, rx: 8, ry: 3.5, fill: pupil }),
      React.createElement("ellipse", { key: "m", cx: 70, cy: 70, rx: 4.5, ry: 5.5, fill: "#7a4a24" })
    ];
  } else if (mood === "question") {
    face = [
      React.createElement("path", { key: "b1", d: "M42 42 L58 37", stroke: pupil, strokeWidth: 3.2, fill: "none", strokeLinecap: "round" }),
      React.createElement("path", { key: "b2", d: "M82 37 L98 42", stroke: pupil, strokeWidth: 3.2, fill: "none", strokeLinecap: "round" }),
      React.createElement("circle", { key: "e1", cx: 52, cy: 56, r: 9, fill: "#fff", stroke: pupil, strokeWidth: 1.8 }),
      React.createElement("circle", { key: "p1", cx: 54, cy: 58, r: 4.5, fill: pupil }),
      React.createElement("circle", { key: "h1", cx: 50, cy: 53, r: 1.8, fill: "#fff" }),
      React.createElement("circle", { key: "e2", cx: 88, cy: 55, r: 10, fill: "#fff", stroke: pupil, strokeWidth: 1.8 }),
      React.createElement("circle", { key: "p2", cx: 90.5, cy: 57, r: 5.2, fill: pupil }),
      React.createElement("circle", { key: "h2", cx: 86.5, cy: 52, r: 2, fill: "#fff" }),
      React.createElement("path", { key: "m", d: "M60 72 Q67 67 73 72 Q79 77 84 70", stroke: "#7a4a24", strokeWidth: 2.8, fill: "none", strokeLinecap: "round" })
    ];
  } else if (mood === "happy") {
    face = [
      React.createElement("path", { key: "e1", d: "M45 58 Q53 46 61 58", stroke: pupil, strokeWidth: 3.4, fill: "none", strokeLinecap: "round" }),
      React.createElement("path", { key: "e2", d: "M79 58 Q87 46 95 58", stroke: pupil, strokeWidth: 3.4, fill: "none", strokeLinecap: "round" }),
      React.createElement("ellipse", { key: "bl1", cx: 39, cy: 67, rx: 7, ry: 4, fill: blush, opacity: 0.9 }),
      React.createElement("ellipse", { key: "bl2", cx: 101, cy: 67, rx: 7, ry: 4, fill: blush, opacity: 0.9 }),
      React.createElement("path", { key: "m", d: "M57 70 Q70 84 83 70 Q77 79 70 79 Q63 79 57 70 Z", fill: "#7a4a24" }),
      React.createElement("path", {
        key: "star",
        d: "M114 26 l2.4 4.8 l4.8 1.2 l-3.6 3.6 l1.2 4.8 l-4.8 -2.4 l-4.8 2.4 l1.2 -4.8 l-3.6 -3.6 l4.8 -1.2 Z",
        fill: "#ffd93d",
        stroke: "#f0a500",
        strokeWidth: 1,
        strokeLinejoin: "round"
      })
    ];
  } else {
    face = [
      React.createElement("circle", { key: "e1", cx: 52, cy: 55, r: 11, fill: "#fff", stroke: pupil, strokeWidth: 1.8 }),
      React.createElement("circle", { key: "p1", cx: 55, cy: 58, r: 6, fill: pupil }),
      React.createElement("circle", { key: "h1a", cx: 50, cy: 52, r: 2.6, fill: "#fff" }),
      React.createElement("circle", { key: "h1b", cx: 58, cy: 61, r: 1.3, fill: "#fff" }),
      React.createElement("circle", { key: "e2", cx: 88, cy: 55, r: 11, fill: "#fff", stroke: pupil, strokeWidth: 1.8 }),
      React.createElement("circle", { key: "p2", cx: 91, cy: 58, r: 6, fill: pupil }),
      React.createElement("circle", { key: "h2a", cx: 86, cy: 52, r: 2.6, fill: "#fff" }),
      React.createElement("circle", { key: "h2b", cx: 94, cy: 61, r: 1.3, fill: "#fff" }),
      React.createElement("ellipse", { key: "bl1", cx: 38, cy: 67, rx: 7, ry: 4, fill: blush, opacity: 0.75 }),
      React.createElement("ellipse", { key: "bl2", cx: 102, cy: 67, rx: 7, ry: 4, fill: blush, opacity: 0.75 }),
      React.createElement("path", { key: "m", d: "M62 74 Q70 81 78 74", stroke: "#7a4a24", strokeWidth: 3, fill: "none", strokeLinecap: "round" })
    ];
  }
  return React.createElement(
    "svg",
    { viewBox: "0 0 140 132", width: "108", height: "124" },
    React.createElement(
      "defs",
      null,
      React.createElement(
        "linearGradient",
        { id: "wwt-body", x1: "0", y1: "0", x2: "0", y2: "1" },
        React.createElement("stop", { offset: "0", stopColor: gTop }),
        React.createElement("stop", { offset: "1", stopColor: gBot })
      )
    ),
    ...tents,
    React.createElement("ellipse", { cx: 70, cy: 56, rx: 43, ry: 40, fill: "url(#wwt-body)" }),
    React.createElement("ellipse", { cx: 70, cy: 72, rx: 25, ry: 15, fill: belly, opacity: 0.55 }),
    curl,
    ...face
  );
}
function apply(ctx) {
  const slots = ctx.get("slots");
  if (slots === void 0) {
    console.error("wwt: no slots service");
    return;
  }
  const store = createPetStore();
  const selStore = createSelectStore();
  let petDrag = null;
  const deepCounts = {};
  ctx.effect(function() {
    return styles.insert(CSS);
  });
  function useStore() {
    const s = React.useState(store.get());
    const setS = s[1];
    React.useEffect(function() {
      return store.subscribe(function() {
        setS(store.get());
      });
    }, []);
    return s[0];
  }
  function useSelStore() {
    const s = React.useState(selStore.get());
    const setS = s[1];
    React.useEffect(function() {
      return selStore.subscribe(function() {
        setS(selStore.get());
      });
    }, []);
    return s[0];
  }
  function selDeep(term, x, y) {
    selStore.set({ kind: "thinking", term, cat: "", text: "", route: "", x, y });
    host.call("wwt/explain", { term, messageId: "", deep: false, fresh: false }).then(function(res) {
      if (!res || !res.ok) {
        selStore.set({ kind: "error", term, cat: "", text: res && res.error || "\u89E3\u91CA\u5931\u8D25\uFF0C\u7A0D\u540E\u518D\u8BD5", route: "", x, y });
        return;
      }
      selStore.set({ kind: "ai", term: res.term || term, cat: res.cat || "", text: res.text || "", route: res.route || "", x, y });
    }).catch(function(e) {
      selStore.set({ kind: "error", term, cat: "", text: String(e), route: "", x, y });
    });
  }
  function SelectOverlay() {
    const card = useSelStore();
    if (!card) return null;
    const style = { left: card.x + "px", top: card.y + "px" };
    let inner;
    if (card.kind === "thinking") {
      inner = React.createElement(
        "div",
        { className: "wwt-sel-nohit" },
        React.createElement(MiniOcto, { className: "wwt-sel-mini" }),
        "\u6B63\u5728\u642C\u7816\u67E5\u8BCD\u5178\u2026\u2026"
      );
    } else if (card.kind === "error") {
      inner = React.createElement("div", { className: "wwt-sel-text" }, "\u{1F605} " + card.text);
    } else {
      const deepBtn = React.createElement(
        "button",
        {
          className: "wwt-sel-deep",
          onClick: function(e) {
            e.stopPropagation();
            selDeep(card.term, card.x, card.y);
          }
        },
        "\u518D\u8BB2\u6DF1\u4E00\u70B9\u70B9\uFF08AI \u7248\uFF09"
      );
      inner = React.createElement(
        "div",
        null,
        React.createElement("span", { className: "wwt-sel-term" }, card.term),
        card.cat ? React.createElement("span", { className: "wwt-sel-cat" }, card.cat) : null,
        React.createElement("div", { className: "wwt-sel-text" }, card.text),
        React.createElement(
          "div",
          { className: "wwt-sel-actions" },
          deepBtn,
          card.route ? React.createElement("span", { className: "wwt-sel-route" }, card.route) : null
        )
      );
    }
    return React.createElement(
      "div",
      { className: "wwt-sel", style, onPointerDown: stopPtr },
      React.createElement(
        "button",
        {
          className: "wwt-sel-close",
          "aria-label": "\u5173\u95ED",
          onClick: function() {
            selStore.clear();
          }
        },
        "\u2715"
      ),
      inner
    );
  }
  function askTerm(term, messageId, deep, fresh) {
    store.thinking();
    host.call("wwt/explain", { term, messageId, deep: !!deep, fresh: !!fresh }).then(function(res) {
      if (!res || !res.ok) {
        store.showDetail({ kind: "error", term, text: res && res.error || "\u89E3\u91CA\u5931\u8D25\uFF0C\u7A0D\u540E\u518D\u8BD5" });
        return;
      }
      store.showDetail({ kind: "explain", term: res.term || term, cat: res.cat || "", text: res.text, source: res.source, route: res.route });
    }).catch(function(e) {
      store.showDetail({ kind: "error", term, text: String(e) });
    });
  }
  function askDeep(term, messageId, wasAi) {
    let n;
    if (wasAi) {
      n = (deepCounts[term] || 1) + 1;
    } else {
      n = 1;
    }
    deepCounts[term] = n;
    if (n >= 4) {
      store.showDetail({ kind: "limit", term });
      return;
    }
    store.thinking();
    host.call("wwt/explain", { term, messageId, deep: true, fresh: n >= 2, depth: n }).then(function(res) {
      if (!res || !res.ok) {
        store.showDetail({ kind: "error", term, text: res && res.error || "\u89E3\u91CA\u5931\u8D25\uFF0C\u7A0D\u540E\u518D\u8BD5" });
        return;
      }
      store.showDetail({ kind: "explain", term: res.term || term, cat: res.cat || "", text: res.text, source: res.source, route: res.route });
    }).catch(function(e) {
      store.showDetail({ kind: "error", term, text: String(e) });
    });
  }
  function renderDetail(d, messageId) {
    if (!d) return null;
    if (d.kind === "thinking") {
      return React.createElement("div", { className: "wwt-nohit", key: "t" }, React.createElement(MiniOcto, null), d.text || "\u6B63\u5728\u67E5\u2026\u2026");
    }
    if (d.kind === "limit") {
      return React.createElement(
        "div",
        { className: "wwt-detail", key: "lim" },
        React.createElement("span", { className: "wwt-term" }, d.term),
        React.createElement("div", { className: "wwt-limit" }, React.createElement(MiniOcto, null), "\u5C0F\u7AE0\u9C7C\u662F\u6709\u5E95\u7EBF\u7684\uFF0C\u65E0\u8BDD\u53EF\u8BF4\u4E86~~~")
      );
    }
    if (d.kind === "chips") {
      const chips = d.hits.map(function(h) {
        return React.createElement(
          "button",
          {
            className: "wwt-chip",
            key: h.term,
            onClick: function(e) {
              e.stopPropagation();
              askTerm(h.term, d.messageId, false, false);
            }
          },
          h.term
        );
      });
      return React.createElement(
        "div",
        { key: "c" },
        React.createElement("div", { className: "wwt-btitle" }, "\u8FD9\u53E5\u91CC\u6709 " + d.hits.length + " \u4E2A\u53EF\u80FD\u770B\u4E0D\u61C2\u7684\u8BCD\uFF0C\u70B9\u5B83\uFF1A"),
        chips
      );
    }
    if (d.kind === "explain") {
      return React.createElement(
        "div",
        { className: "wwt-detail", key: "d" },
        React.createElement("span", { className: "wwt-term" }, d.term),
        d.cat ? React.createElement("span", { className: "wwt-cat" }, d.cat) : null,
        React.createElement("div", { className: "wwt-text" }, d.text),
        React.createElement(
          "button",
          {
            className: "wwt-deep",
            onClick: function(e) {
              e.stopPropagation();
              askDeep(d.term, messageId || "", d.source === "ai");
            }
          },
          d.source === "ai" ? "\u518D\u6362\u4E2A\u8BF4\u6CD5" : "\u518D\u8BB2\u6DF1\u4E00\u70B9\u70B9\uFF08AI \u7248\uFF09"
        ),
        d.route ? React.createElement("span", { className: "wwt-route" }, "  \xB7 " + d.route) : null
      );
    }
    if (d.kind === "error") {
      return React.createElement(
        "div",
        { className: "wwt-detail", key: "e" },
        React.createElement("span", { className: "wwt-term" }, d.term),
        React.createElement("div", { className: "wwt-text" }, "\u{1F605} " + d.text)
      );
    }
    return null;
  }
  function stopPtr(e) {
    e.stopPropagation();
  }
  function Pet() {
    const state = useStore();
    const pos = React.useState(null);
    const setPos = pos[1];
    const open = React.useState(false);
    const setOpen = open[1];
    const frames = React.useState(null);
    const setFrames = frames[1];
    React.useEffect(function() {
      let alive = true;
      host.call("wwt/pet", {}).then(function(r) {
        if (alive && r && r.ok && r.frames) setFrames(r.frames);
      }).catch(function() {
      });
      return function() {
        alive = false;
      };
    }, []);
    const onDown = function(e) {
      const r = e.currentTarget.getBoundingClientRect();
      petDrag = { sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, moved: false };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
      }
    };
    const onMove = function(e) {
      const d = petDrag;
      if (!d) return;
      const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
      if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
      if (d.moved) setPos({ x: Math.max(4, d.ox + dx), y: Math.max(4, d.oy + dy) });
    };
    const onUp = function() {
      const d = petDrag;
      petDrag = null;
      if (d && !d.moved) {
        if (open[0]) {
          store.calm();
          setOpen(false);
        } else {
          store.open();
          setOpen(true);
        }
      }
    };
    const hits = state.turn && state.turn.hits ? state.turn.hits : [];
    const badge = hits.length ? React.createElement("div", { className: "wwt-badge", key: "b" }, String(hits.length)) : null;
    let petEl;
    if (frames[0]) {
      petEl = React.createElement("img", { className: "wwt-img", src: frames[0][state.mode] || frames[0].idle, alt: "", draggable: false });
    } else {
      petEl = React.createElement("div", { className: "wwt-body" + (state.mode === "thinking" ? " thinking" : "") }, OctoSvg(state.mode));
    }
    let body = null;
    if (open[0]) {
      let inner = null;
      if (state.detail) {
        inner = renderDetail(state.detail, state.turn ? state.turn.messageId : "");
      } else if (state.mode === "thinking") {
        inner = renderDetail({ kind: "thinking", text: "\u6B63\u5728\u642C\u7816\u67E5\u8BCD\u5178\u2026\u2026" }, "");
      } else if (hits.length) {
        inner = renderDetail({ kind: "chips", messageId: state.turn.messageId, hits }, state.turn.messageId);
      } else {
        inner = renderDetail({ kind: "nohit" }, "");
      }
      if (inner === null) {
        inner = React.createElement(
          "div",
          { className: "wwt-nohit", key: "nh" },
          React.createElement(MiniOcto, null),
          "\u8FD9\u53E5\u6CA1\u626B\u5230\u8BCD\u8868\u91CC\u7684\u9ED1\u8BDD \u{1F44C} \u60F3\u67E5\u54EA\u4E2A\u8BCD\uFF0C\u590D\u5236\u540E\u91CD\u65B0\u95EE\u6211\u3002"
        );
      }
      let loadingBar = null;
      if (state.mode === "thinking" && state.detail && state.detail.kind !== "thinking") {
        loadingBar = React.createElement("div", { className: "wwt-loadbar", key: "lb", title: "\u6B63\u5728\u751F\u6210\u2026" });
      }
      body = React.createElement(
        "div",
        { className: "wwt-bubble", onPointerDown: stopPtr, onPointerUp: stopPtr },
        inner,
        loadingBar
      );
    }
    const scrim = open[0] ? React.createElement("button", {
      className: "wwt-scrim",
      key: "scrim",
      "aria-label": "\u5173\u95ED",
      onPointerDown: stopPtr,
      onClick: function() {
        store.calm();
        setOpen(false);
      }
    }) : null;
    return React.createElement(
      React.Fragment,
      null,
      scrim,
      React.createElement(
        "div",
        {
          className: "wwt-pet",
          style: pos[0] ? { left: pos[0].x + "px", top: pos[0].y + "px", right: "auto", bottom: "auto" } : void 0,
          onPointerDown: onDown,
          onPointerMove: onMove,
          onPointerUp: onUp
        },
        badge,
        petEl,
        body
      )
    );
  }
  function TurnSignal(p) {
    const props = p.props || {};
    const messageId = props.messageId ? String(props.messageId) : "";
    React.useEffect(function() {
      if (!messageId) return;
      let alive = true;
      host.call("wwt/latest", {}).then(function(r) {
        if (alive && r && r.messageId) store.offerTurn(r);
      }).catch(function() {
      });
      return function() {
        alive = false;
      };
    }, [messageId]);
    return null;
  }
  ctx.effect(function() {
    return slots.inject("shell.overlay", function() {
      return slots.register(
        { name: "shell.overlay", id: "wwt-pet", order: 500, label: function() {
          return "What Was That";
        } },
        function() {
          return React.createElement(Pet, null);
        }
      );
    });
  });
  ctx.effect(function() {
    let timer = null;
    function onChange() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        try {
          const sel = typeof window !== "undefined" && window.getSelection ? window.getSelection() : null;
          if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
            selStore.clear();
            return;
          }
          const text = (sel.toString() || "").trim();
          if (text.length < 2 || text.length > 300) {
            selStore.clear();
            return;
          }
          const rect = sel.getRangeAt(0).getBoundingClientRect();
          const x = Math.min(Math.max(rect.left, 8), window.innerWidth - 240);
          const y = Math.min(Math.max(rect.bottom + 8, 8), window.innerHeight - 90);
          selStore.set({ kind: "thinking", term: "", cat: "", text, route: "", x, y });
          host.call("wwt/select", { sentence: text }).then(function(r) {
            if (r && r.ok && r.hit) {
              selStore.set({ kind: "local", term: r.hit.term, cat: r.hit.cat || "", text: r.hit.explanation, route: "\u672C\u5730\u8BCD\u5E93\xB7\u96F6\u6D88\u8017", x, y });
            } else {
              selStore.clear();
            }
          }).catch(function() {
            selStore.clear();
          });
        } catch (e) {
          selStore.clear();
        }
      }, 260);
    }
    if (typeof document !== "undefined") {
      document.addEventListener("selectionchange", onChange);
    }
    return function() {
      document.removeEventListener("selectionchange", onChange);
      if (timer) clearTimeout(timer);
    };
  });
  ctx.effect(function() {
    return slots.inject("shell.overlay", function() {
      return slots.register(
        { name: "shell.overlay", id: "wwt-select", order: 501, label: function() {
          return "WWT Selection";
        } },
        function() {
          return React.createElement(SelectOverlay, null);
        }
      );
    });
  });
  ctx.effect(function() {
    return slots.inject("conversation.chat.assistant-actions", function() {
      return slots.register(
        { name: "conversation.chat.assistant-actions", id: "wwt-signal", order: 999, label: function() {
          return "WWT";
        } },
        function(props) {
          return React.createElement(TurnSignal, { props });
        }
      );
    });
  });
}
return module.exports; } });
//# sourceMappingURL=client.js.map

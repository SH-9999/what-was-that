// src/index.ts
import { fileURLToPath } from "node:url";

// src/core.ts
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildMatchers(entries) {
  const matchers = [];
  for (const item of entries) {
    const words = [item.t].concat(item.a || []);
    const pats = [];
    for (const w of words) {
      if (/[\u4e00-\u9fa5]/.test(w)) pats.push(new RegExp(escapeRe(w)));
      else pats.push(new RegExp("(^|[^A-Za-z0-9_-])" + escapeRe(w) + "($|[^A-Za-z0-9_-])", "i"));
    }
    matchers.push({ item, pats });
  }
  matchers.sort((a, b) => b.item.t.length - a.item.t.length);
  return matchers;
}
function scan(text, matchers) {
  const found = [];
  const seen = {};
  for (let i = 0; i < matchers.length && found.length < 8; i++) {
    const m = matchers[i];
    for (let j = 0; j < m.pats.length; j++) {
      if (m.pats[j].test(text)) {
        if (!seen[m.item.t]) {
          seen[m.item.t] = true;
          found.push({ term: m.item.t, cat: m.item.c, explanation: m.item.e, local: true });
        }
        break;
      }
    }
  }
  return found;
}
function cleanText(s) {
  if (!s) return "";
  s = s.trim();
  const idx = s.indexOf("\u8BF7\u89E3\u91CA");
  if (idx >= 0) {
    let after = s.slice(idx + 3);
    const colon = after.indexOf("\uFF1A");
    if (colon >= 0) after = after.slice(colon + 1);
    s = after.trim();
  }
  s = s.replace(/^(所以|那么|首先|好[，,。]?|嗯[，,。]?|先构思[：:]?|因此)/, "").trim();
  return s;
}
function sentenceAround(text, term) {
  const low = text.toLowerCase();
  const t = term.toLowerCase();
  const i = low.indexOf(t);
  if (i < 0) return "";
  const start = Math.max(0, i - 80);
  const end = Math.min(text.length, i + term.length + 80);
  return (start > 0 ? "\u2026" : "") + text.slice(start, end).replace(/\s+/g, " ").trim() + (end < text.length ? "\u2026" : "");
}

// src/index.ts
var LIMIT_TEXT = "\u5C0F\u7AE0\u9C7C\u662F\u6709\u5E95\u7EBF\u7684\uFF0C\u65E0\u8BDD\u53EF\u8BF4\u4E86~~~";
var SHORT_SYSTEM = '\u4F60\u662F"\u90A3\u662F\u5565"\uFF08What Was That\uFF09\u5C0F\u52A9\u624B\uFF0C\u5E2E\u5B8C\u5168\u4E0D\u61C2\u6280\u672F\u7684\u7528\u6237\u770B\u61C2 AI \u52A9\u624B\u56DE\u7B54\u91CC\u7684\u672F\u8BED\u548C\u9ED1\u8BDD\u3002\u89C4\u5219\uFF1A\u76F4\u63A5\u7ED9\u51FA\u89E3\u91CA\uFF0C\u7981\u6B62\u590D\u8FF0\u6216\u91CD\u8FF0\u672C\u6307\u4EE4\uFF0C\u7981\u6B62\u590D\u8FF0\u7528\u6237\u7684\u95EE\u9898\uFF0C\u4E0D\u8981\u4EFB\u4F55\u601D\u8003\u8FC7\u7A0B\uFF1B\u7528\u751F\u6D3B\u6BD4\u55BB\uFF0C\u50CF\u8DDF\u670B\u53CB\u804A\u5929\uFF1B90 \u4E2A\u6C49\u5B57\u4EE5\u5185\uFF1B\u8F7B\u677E\u5E7D\u9ED8\u4E0D\u6CB9\u6ED1\uFF1B\u4E0D\u7528 markdown\u3001\u4E0D\u5217\u70B9\uFF0C\u76F4\u63A5\u4E00\u6BB5\u8BDD\u3002';
var LONG_SYSTEM = '\u4F60\u662F"\u90A3\u662F\u5565"\uFF08What Was That\uFF09\u5C0F\u52A9\u624B\uFF0C\u7ED9\u6280\u672F\u5C0F\u767D\u8BB2\u6E05\u695A\u4E00\u4E2A\u672F\u8BED\u3002\u8BF7\u7ED9\u51FA\u4E00\u4E2A\u5B8C\u6574\u3001\u6B63\u5F0F\u3001\u6761\u7406\u6E05\u695A\u7684\u89E3\u91CA\uFF1A\u7B2C\u4E00\u53E5\u7528\u4E00\u53E5\u8BDD\u5B9A\u4E49\u5B83\u662F\u4EC0\u4E48\uFF1B\u63A5\u7740\u7528 1-2 \u4E2A\u751F\u6D3B\u6BD4\u55BB\u5E2E\u52A9\u7406\u89E3\uFF1B\u6700\u540E\u7ED9\u4E00\u6761\u5B9E\u7528\u5EFA\u8BAE\u6216\u63D0\u9192\u3002\u5168\u6587\u7EA6 200 \u4E2A\u6C49\u5B57\uFF0C\u5141\u8BB8\u7528\u7B80\u77ED\u5206\u6BB5\uFF0C\u4F46\u4E0D\u8981\u7528 markdown \u7B26\u53F7\u3001\u4E0D\u8981\u7F16\u53F7\u5217\u8868\u3002';
function assetsDir() {
  const here = fileURLToPath(import.meta.url);
  return here.replace(/[\\/]lib[\\/][^\\/]+\.js$/, "") + "/assets";
}
function bytesToBase64(bytes) {
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
    out += CH[n >> 18 & 63] + CH[n >> 12 & 63] + CH[n >> 6 & 63] + CH[n & 63];
  }
  const rem = bytes.length - i;
  if (rem === 1) {
    const n = bytes[i] << 16;
    out += CH[n >> 18 & 63] + CH[n >> 12 & 63] + "==";
  } else if (rem === 2) {
    const n = bytes[i] << 16 | bytes[i + 1] << 8;
    out += CH[n >> 18 & 63] + CH[n >> 12 & 63] + CH[n >> 6 & 63] + "=";
  }
  return out;
}
function apply(ctx) {
  const msgCache = /* @__PURE__ */ new Map();
  const latest = /* @__PURE__ */ new Map();
  const aiCache = /* @__PURE__ */ new Map();
  let globalSeq = 0;
  let globalLatest = null;
  let matchers = [];
  let lexSize = 0;
  let petCache = null;
  const assets = assetsDir();
  const LEX_PATH = assets + "/lexicon.json";
  const PET_FILES = [
    { name: "idle", path: assets + "/idle.svg" },
    { name: "question", path: assets + "/question.svg" },
    { name: "thinking", path: assets + "/thinking.svg" },
    { name: "happy", path: assets + "/happy.svg" }
  ];
  const PET_MAX = 512 * 1024;
  const fs = ctx.get("fs");
  if (fs !== void 0) {
    fs.resolve(LEX_PATH).then((target) => fs.readText(target)).then((text) => {
      const entries = JSON.parse(text);
      if (Array.isArray(entries)) {
        matchers = buildMatchers(entries);
        lexSize = entries.length;
        console.log("wwt: lexicon loaded", lexSize);
      }
    }).catch((e) => console.error("wwt: lexicon load failed", e));
  } else {
    console.error("wwt: no fs service");
  }
  function resolveRoute() {
    const def = ctx.get("agentDefaultModel");
    if (def !== void 0) {
      try {
        const s = def.currentSelection();
        if (s && s.provider && s.model) return s;
      } catch {
      }
    }
    return null;
  }
  function findLocal(term) {
    for (const m of matchers) {
      if (m.item.t.toLowerCase() === term.toLowerCase()) return m.item;
    }
    return null;
  }
  async function aiExplain(term, sentence, fresh, depth) {
    const llm = ctx.get("llm");
    const route = resolveRoute();
    if (llm === void 0 || !route) return { ok: false, error: "\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u7EBF\u8DEF" };
    const key = term + "||" + (sentence || "");
    if (!fresh && aiCache.has(key)) return aiCache.get(key);
    const system = depth >= 3 ? LONG_SYSTEM : SHORT_SYSTEM;
    const maxTokens = depth >= 3 ? 900 : 500;
    const user = "\u8BF7\u89E3\u91CA\uFF1A\u300C" + term + "\u300D" + (sentence ? "\n\u5B83\u51FA\u73B0\u5728\u8FD9\u53E5\u8BDD\u91CC\uFF1A\u300C" + sentence + "\u300D\uFF08\u53C2\u8003\u4E0A\u4E0B\u6587\u5373\u53EF\uFF09" : "");
    const messages = [
      {
        id: "wwt-q",
        role: "user",
        content: [{ type: "text", text: user }],
        source: { kind: "model", provider: route.provider, model: route.model }
      }
    ];
    let out = "";
    let reasoning = "";
    try {
      const stream = llm.stream({ provider: route.provider, model: route.model, system, messages, maxTokens });
      for await (const chunk of stream) {
        if (chunk.type === "text-delta" && typeof chunk.text === "string") out += chunk.text;
        else if (chunk.type === "reasoning-delta" && typeof chunk.text === "string") reasoning += chunk.text;
        else if (chunk.type === "finish" && (chunk.reason === "error" || chunk.reason === "aborted")) {
          return { ok: false, error: "\u6A21\u578B\u8C03\u7528\u672A\u5B8C\u6210\uFF08" + chunk.reason + "\uFF09" };
        }
      }
    } catch (e) {
      const msg = e && typeof e === "object" && "message" in e ? String(e.message) : String(e);
      return { ok: false, error: "\u6A21\u578B\u8C03\u7528\u5931\u8D25\uFF1A" + msg };
    }
    let text = cleanText(out.trim());
    if (!text && reasoning) text = cleanText(reasoning.trim()).slice(0, 320);
    if (!text) return { ok: false, error: "\u6A21\u578B\u6CA1\u6709\u8FD4\u56DE\u5185\u5BB9\uFF0C\u53EF\u7A0D\u540E\u518D\u8BD5" };
    const res = { ok: true, text, route: route.provider + "/" + route.model };
    if (!fresh) {
      aiCache.set(key, res);
      if (aiCache.size > 100) {
        const oldest = aiCache.keys().next().value;
        if (oldest !== void 0) aiCache.delete(oldest);
      }
    }
    return res;
  }
  harness.handle("wwt/health", async function() {
    const r = resolveRoute();
    return { ok: true, lexSize, route: r ? r.provider + "/" + r.model : null, seq: globalSeq };
  });
  harness.handle("wwt/latest", async function() {
    if (!globalLatest) return null;
    return { seq: globalLatest.seq, messageId: globalLatest.mid, hits: globalLatest.hits };
  });
  harness.handle("wwt/explain", async function(args) {
    const term = args ? String(args.term || "").slice(0, 80) : "";
    if (!term) return { ok: false, error: "\u7F3A\u5C11\u8BCD\u6761" };
    const mid = args && args.messageId ? String(args.messageId) : "";
    const rec = mid ? msgCache.get(mid) : void 0;
    const sentence = rec ? sentenceAround(rec.text, term) : args && args.sentence ? String(args.sentence).slice(0, 200) : "";
    const local = findLocal(term);
    if (local && !(args && args.deep)) {
      return { ok: true, source: "local", term: local.t, cat: local.c, text: local.e, route: "\u672C\u5730\u8BCD\u5E93\xB7\u96F6\u6D88\u8017" };
    }
    const depth = args && typeof args.depth === "number" ? args.depth : 1;
    if (depth >= 4) {
      return { ok: true, source: "limit", term, text: LIMIT_TEXT, route: "\u7AE0\u9C7C\u5DF2\u5230\u8FBE\u8BED\u6599\u4E0A\u9650" };
    }
    const res = await aiExplain(term, sentence, !!(args && args.fresh), depth);
    return { term, source: "ai", cat: local ? local.c : "", ...res };
  });
  harness.handle("wwt/select", async function(args) {
    const s = args && typeof args.sentence === "string" ? args.sentence.slice(0, 400) : "";
    if (!s.trim()) return { ok: true, hit: null };
    const hits = scan(s, matchers);
    const first = hits.length ? hits[0] : null;
    if (!first) return { ok: true, hit: null };
    return {
      ok: true,
      hit: { term: first.term, cat: first.cat || "", explanation: first.explanation, local: true }
    };
  });
  harness.handle("wwt/pet", async function() {
    if (petCache) return petCache;
    const fsv = ctx.get("fs");
    if (fsv === void 0) return { ok: false };
    try {
      const frames = {};
      for (const f of PET_FILES) {
        const t = await fsv.resolve(f.path);
        const st = await fsv.stat(t);
        if (!st) {
          console.log("wwt: pet file missing", f.path);
          continue;
        }
        const bytes = await fsv.readBytes(t, void 0, PET_MAX);
        frames[f.name] = "data:image/svg+xml;base64," + bytesToBase64(bytes);
      }
      if (!frames.idle) return { ok: false };
      petCache = { ok: true, frames };
      console.log("wwt: pet frames loaded (svg)", Object.keys(frames).join(","));
      return petCache;
    } catch (e) {
      console.error("wwt: pet load failed", e);
      return { ok: false };
    }
  });
  ctx.on("session/event", function(session, event) {
    try {
      const ev = event;
      if (!ev || ev.type !== "assistant/message") return;
      const message = (ev.data || {}).message;
      if (!message || !Array.isArray(message.content)) return;
      let text = "";
      for (const b of message.content) {
        if (b && b.type === "text" && typeof b.text === "string") text += b.text + "\n";
      }
      if (!text.trim()) return;
      const sid = String(session?.id);
      const mid = String(message.id);
      const hits = scan(text, matchers);
      msgCache.set(mid, { sessionId: sid, messageId: mid, text, hits, time: ev.time });
      latest.set(sid, mid);
      globalSeq++;
      globalLatest = { seq: globalSeq, mid, hits };
      if (msgCache.size > 60) {
        const oldest = msgCache.keys().next().value;
        if (oldest !== void 0) msgCache.delete(oldest);
      }
    } catch (e) {
      console.error("wwt session/event", e);
    }
  }, { global: true });
}
export {
  apply
};
//# sourceMappingURL=index.js.map

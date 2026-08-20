var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name2, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name: name2, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name2, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name2]() {
    return __privateGet(this, extra);
  }, set [name2](x) {
    return __privateSet(this, extra, x);
  } }, name2));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name2) : __name(target, name2);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name2, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name2 in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name2];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name2] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name2, desc), p ? k ^ 4 ? extra : desc : target;
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

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

// src/runtime.ts
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
var _health_dec, _latest_dec, _pet_dec, _select_dec, _explain_dec, _a, _init;
var WwtRuntime = class extends (_a = TypertRemoteService, _explain_dec = [Remote], _select_dec = [Remote], _pet_dec = [Remote], _latest_dec = [Remote], _health_dec = [Remote], _a) {
  constructor(ctx, deps) {
    super(ctx, "wwt");
    this.deps = deps;
    __runInitializers(_init, 5, this);
  }
  async explain(term, messageId, deep, fresh, depth) {
    return this.deps.explain({ term, messageId, deep, fresh, depth });
  }
  select(sentence) {
    return { hit: this.deps.select(String(sentence || "").slice(0, 400)) };
  }
  pet() {
    return this.deps.pet();
  }
  latest() {
    return this.deps.latest();
  }
  health() {
    return this.deps.health();
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "explain", _explain_dec, WwtRuntime);
__decorateElement(_init, 1, "select", _select_dec, WwtRuntime);
__decorateElement(_init, 1, "pet", _pet_dec, WwtRuntime);
__decorateElement(_init, 1, "latest", _latest_dec, WwtRuntime);
__decorateElement(_init, 1, "health", _health_dec, WwtRuntime);
__decoratorMetadata(_init, WwtRuntime);

// src/contract.ts
var WWT_INVOCATIONS = [
  {
    id: "what-was-that#wwt/explain",
    service: "wwt",
    namespace: "wwt",
    method: "explain",
    invocation: { kind: "direct" },
    parameters: [
      { name: "term", wire: "term", source: "json", codec: { mode: "src-json" } },
      { name: "messageId", wire: "messageId", source: "json", codec: { mode: "src-json" } },
      { name: "deep", wire: "deep", source: "json", codec: { mode: "src-json" } },
      { name: "fresh", wire: "fresh", source: "json", codec: { mode: "src-json" } },
      { name: "depth", wire: "depth", source: "json", codec: { mode: "src-json" } }
    ],
    result: { mode: "src-json" }
  },
  {
    id: "what-was-that#wwt/select",
    service: "wwt",
    namespace: "wwt",
    method: "select",
    invocation: { kind: "direct" },
    parameters: [{ name: "sentence", wire: "sentence", source: "json", codec: { mode: "src-json" } }],
    result: { mode: "src-json" }
  },
  {
    id: "what-was-that#wwt/pet",
    service: "wwt",
    namespace: "wwt",
    method: "pet",
    invocation: { kind: "direct" },
    parameters: [],
    result: { mode: "src-json" }
  },
  {
    id: "what-was-that#wwt/latest",
    service: "wwt",
    namespace: "wwt",
    method: "latest",
    invocation: { kind: "direct" },
    parameters: [],
    result: { mode: "src-json" }
  },
  {
    id: "what-was-that#wwt/health",
    service: "wwt",
    namespace: "wwt",
    method: "health",
    invocation: { kind: "direct" },
    parameters: [],
    result: { mode: "src-json" }
  }
];

// src/typert.ts
var WWT_MANIFEST = {
  package: "what-was-that",
  face: "host",
  schemas: [],
  model: {
    services: [
      {
        key: "wwt",
        exportName: "WwtRuntime",
        description: "Plain-language explanations for AI jargon.",
        tags: [],
        members: [
          {
            kind: "method",
            name: "explain",
            signature: "explain(term: string, messageId: string, deep: boolean, fresh: boolean, depth: number): Promise<ExplainResult>"
          },
          { kind: "method", name: "select", signature: "select(sentence: string): SelectResult" },
          { kind: "method", name: "pet", signature: "pet(): Promise<PetResult>" },
          { kind: "method", name: "latest", signature: "latest(): LatestResult | null" },
          { kind: "method", name: "health", signature: "health(): HealthResult" }
        ],
        types: []
      }
    ],
    events: [],
    objects: []
  },
  invocations: WWT_INVOCATIONS
};

// src/index.ts
var LIMIT_TEXT = "\u5C0F\u7AE0\u9C7C\u662F\u6709\u5E95\u7EBF\u7684\uFF0C\u65E0\u8BDD\u53EF\u8BF4\u4E86~~~";
var SHORT_SYSTEM = '\u4F60\u662F"\u90A3\u662F\u5565"\uFF08What Was That\uFF09\u5C0F\u52A9\u624B\uFF0C\u5E2E\u5B8C\u5168\u4E0D\u61C2\u6280\u672F\u7684\u7528\u6237\u770B\u61C2 AI \u52A9\u624B\u56DE\u7B54\u91CC\u7684\u672F\u8BED\u548C\u9ED1\u8BDD\u3002\u89C4\u5219\uFF1A\u76F4\u63A5\u7ED9\u51FA\u89E3\u91CA\uFF0C\u7981\u6B62\u590D\u8FF0\u6216\u91CD\u8FF0\u672C\u6307\u4EE4\uFF0C\u7981\u6B62\u590D\u8FF0\u7528\u6237\u7684\u95EE\u9898\uFF0C\u4E0D\u8981\u4EFB\u4F55\u601D\u8003\u8FC7\u7A0B\uFF1B\u7528\u751F\u6D3B\u6BD4\u55BB\uFF0C\u50CF\u8DDF\u670B\u53CB\u804A\u5929\uFF1B90 \u4E2A\u6C49\u5B57\u4EE5\u5185\uFF1B\u8F7B\u677E\u5E7D\u9ED8\u4E0D\u6CB9\u6ED1\uFF1B\u4E0D\u7528 markdown\u3001\u4E0D\u5217\u70B9\uFF0C\u76F4\u63A5\u4E00\u6BB5\u8BDD\u3002';
var LONG_SYSTEM = '\u4F60\u662F"\u90A3\u662F\u5565"\uFF08What Was That\uFF09\u5C0F\u52A9\u624B\uFF0C\u7ED9\u6280\u672F\u5C0F\u767D\u8BB2\u6E05\u695A\u4E00\u4E2A\u672F\u8BED\u3002\u8BF7\u7ED9\u51FA\u4E00\u4E2A\u5B8C\u6574\u3001\u6B63\u5F0F\u3001\u6761\u7406\u6E05\u695A\u7684\u89E3\u91CA\uFF1A\u7B2C\u4E00\u53E5\u7528\u4E00\u53E5\u8BDD\u5B9A\u4E49\u5B83\u662F\u4EC0\u4E48\uFF1B\u63A5\u7740\u7528 1-2 \u4E2A\u751F\u6D3B\u6BD4\u55BB\u5E2E\u52A9\u7406\u89E3\uFF1B\u6700\u540E\u7ED9\u4E00\u6761\u5B9E\u7528\u5EFA\u8BAE\u6216\u63D0\u9192\u3002\u5168\u6587\u7EA6 200 \u4E2A\u6C49\u5B57\uFF0C\u5141\u8BB8\u7528\u7B80\u77ED\u5206\u6BB5\uFF0C\u4F46\u4E0D\u8981\u7528 markdown \u7B26\u53F7\u3001\u4E0D\u8981\u7F16\u53F7\u5217\u8868\u3002';
var name = "what-was-that";
var inject = ["typert"];
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
    if (!fresh) {
      const cached = aiCache.get(key);
      if (cached) return cached;
    }
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
  const deps = {
    async explain(args) {
      const term = String(args.term || "").slice(0, 80);
      if (!term) throw new Error("\u7F3A\u5C11\u8BCD\u6761");
      const mid = String(args.messageId || "");
      const rec = mid ? msgCache.get(mid) : void 0;
      const sentence = rec ? sentenceAround(rec.text, term) : "";
      const local = findLocal(term);
      if (local && !args.deep) {
        return { source: "local", term: local.t, cat: local.c || "", text: local.e, route: "\u672C\u5730\u8BCD\u5E93\xB7\u96F6\u6D88\u8017" };
      }
      const depth = typeof args.depth === "number" ? args.depth : 1;
      if (depth >= 4) {
        return { source: "limit", term, cat: "", text: LIMIT_TEXT, route: "\u7AE0\u9C7C\u5DF2\u5230\u8FBE\u8BED\u6599\u4E0A\u9650" };
      }
      const res = await aiExplain(term, sentence, !!args.fresh, depth);
      if (!res.ok) throw new Error(res.error);
      return { term, source: "ai", cat: local ? local.c || "" : "", text: res.text, route: res.route };
    },
    select(sentence) {
      const s = String(sentence || "").slice(0, 400);
      if (!s.trim()) return null;
      const hits = scan(s, matchers);
      const first = hits.length ? hits[0] : null;
      if (!first) return null;
      return { term: first.term, cat: first.cat || "", explanation: first.explanation, local: true };
    },
    async pet() {
      if (petCache) return petCache;
      const fsv = ctx.get("fs");
      if (fsv === void 0) throw new Error("no fs service");
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
        if (!frames.idle) throw new Error("no idle pet frame");
        petCache = { frames };
        console.log("wwt: pet frames loaded (svg)", Object.keys(frames).join(","));
        return petCache;
      } catch (e) {
        console.error("wwt: pet load failed", e);
        throw new Error("pet frames unavailable");
      }
    },
    latest() {
      if (!globalLatest) return null;
      return { seq: globalLatest.seq, messageId: globalLatest.mid, hits: globalLatest.hits };
    },
    health() {
      const r = resolveRoute();
      return { ok: true, lexSize, route: r ? r.provider + "/" + r.model : null, seq: globalSeq };
    }
  };
  new WwtRuntime(ctx, deps);
  ctx.effect(() => {
    const dispose = ctx.typert.register(WWT_MANIFEST);
    return () => {
      void dispose();
    };
  }, "wwt: typert manifest");
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
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map

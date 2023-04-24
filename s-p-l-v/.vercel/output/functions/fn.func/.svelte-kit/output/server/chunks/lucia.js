import prisma from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
const __toString = Object.prototype.toString;
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const parseCookie = (str, options) => {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options ?? {};
  const dec = opt.decode ?? decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
};
const serializeCookie = (name, val, options) => {
  const opt = options ?? {};
  const enc = opt.encode ?? encode;
  if (!fieldContentRegExp.test(name))
    throw new TypeError("argument name is invalid");
  const value = enc(val);
  if (value && !fieldContentRegExp.test(value))
    throw new TypeError("argument val is invalid");
  let str = name + "=" + value;
  if (null != opt.maxAge) {
    const maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge))
      throw new TypeError("option maxAge is invalid");
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain))
      throw new TypeError("option domain is invalid");
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path))
      throw new TypeError("option path is invalid");
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    const expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf()))
      throw new TypeError("option expires is invalid");
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
};
const decode = (str) => {
  return str.includes("%") ? decodeURIComponent(str) : str;
};
const encode = (val) => {
  return encodeURIComponent(val);
};
const isDate = (val) => {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
};
const tryDecode = (str, decodeFunction) => {
  try {
    return decodeFunction(str);
  } catch (e) {
    return str;
  }
};
const SESSION_COOKIE_NAME = "auth_session";
const createSessionCookie = (session, env, options) => {
  return new Cookie(SESSION_COOKIE_NAME, session?.sessionId ?? "", {
    ...options,
    httpOnly: true,
    expires: new Date(session?.idlePeriodExpiresAt ?? 0),
    secure: env === "PROD"
  });
};
class Cookie {
  constructor(name, value, options) {
    this.name = name;
    this.value = value;
    this.attributes = options;
  }
  name;
  value;
  attributes;
  serialize = () => {
    return serializeCookie(this.name, this.value, this.attributes);
  };
}
const logError = (message) => {
  console.log("\x1B[31m%s\x1B[31m", `[LUCIA_ERROR] ${message}`);
};
const pbkdf2 = async (password, salt, options) => {
  const pwKey = await crypto.subtle.importKey("raw", password, "PBKDF2", false, ["deriveBits"]);
  const keyBuffer = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    hash: "SHA-256",
    salt,
    iterations: options.c
  }, pwKey, options.dkLen * 8);
  return new Uint8Array(keyBuffer);
};
const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
const nextTick = async () => {
};
const isPlainObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object;
};
function checkOpts(defaults, opts) {
  if (opts !== void 0 && (typeof opts !== "object" || !isPlainObject(opts)))
    throw new TypeError("Options should be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
const asyncLoop = async (iters, tick, cb) => {
  let ts = Date.now();
  for (let i = 0; i < iters; i++) {
    cb(i);
    const diff = Date.now() - ts;
    if (diff >= 0 && diff < tick)
      continue;
    await nextTick();
    ts += diff;
  }
};
const rotl = (a, b) => a << b | a >>> 32 - b;
const XorAndSalsa = (prev, pi, input, ii, out, oi) => {
  const y00 = prev[pi++] ^ input[ii++], y01 = prev[pi++] ^ input[ii++];
  const y02 = prev[pi++] ^ input[ii++], y03 = prev[pi++] ^ input[ii++];
  const y04 = prev[pi++] ^ input[ii++], y05 = prev[pi++] ^ input[ii++];
  const y06 = prev[pi++] ^ input[ii++], y07 = prev[pi++] ^ input[ii++];
  const y08 = prev[pi++] ^ input[ii++], y09 = prev[pi++] ^ input[ii++];
  const y10 = prev[pi++] ^ input[ii++], y11 = prev[pi++] ^ input[ii++];
  const y12 = prev[pi++] ^ input[ii++], y13 = prev[pi++] ^ input[ii++];
  const y14 = prev[pi++] ^ input[ii++], y15 = prev[pi++] ^ input[ii++];
  let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
  for (let i = 0; i < 8; i += 2) {
    x04 ^= rotl(x00 + x12 | 0, 7);
    x08 ^= rotl(x04 + x00 | 0, 9);
    x12 ^= rotl(x08 + x04 | 0, 13);
    x00 ^= rotl(x12 + x08 | 0, 18);
    x09 ^= rotl(x05 + x01 | 0, 7);
    x13 ^= rotl(x09 + x05 | 0, 9);
    x01 ^= rotl(x13 + x09 | 0, 13);
    x05 ^= rotl(x01 + x13 | 0, 18);
    x14 ^= rotl(x10 + x06 | 0, 7);
    x02 ^= rotl(x14 + x10 | 0, 9);
    x06 ^= rotl(x02 + x14 | 0, 13);
    x10 ^= rotl(x06 + x02 | 0, 18);
    x03 ^= rotl(x15 + x11 | 0, 7);
    x07 ^= rotl(x03 + x15 | 0, 9);
    x11 ^= rotl(x07 + x03 | 0, 13);
    x15 ^= rotl(x11 + x07 | 0, 18);
    x01 ^= rotl(x00 + x03 | 0, 7);
    x02 ^= rotl(x01 + x00 | 0, 9);
    x03 ^= rotl(x02 + x01 | 0, 13);
    x00 ^= rotl(x03 + x02 | 0, 18);
    x06 ^= rotl(x05 + x04 | 0, 7);
    x07 ^= rotl(x06 + x05 | 0, 9);
    x04 ^= rotl(x07 + x06 | 0, 13);
    x05 ^= rotl(x04 + x07 | 0, 18);
    x11 ^= rotl(x10 + x09 | 0, 7);
    x08 ^= rotl(x11 + x10 | 0, 9);
    x09 ^= rotl(x08 + x11 | 0, 13);
    x10 ^= rotl(x09 + x08 | 0, 18);
    x12 ^= rotl(x15 + x14 | 0, 7);
    x13 ^= rotl(x12 + x15 | 0, 9);
    x14 ^= rotl(x13 + x12 | 0, 13);
    x15 ^= rotl(x14 + x13 | 0, 18);
  }
  out[oi++] = y00 + x00 | 0;
  out[oi++] = y01 + x01 | 0;
  out[oi++] = y02 + x02 | 0;
  out[oi++] = y03 + x03 | 0;
  out[oi++] = y04 + x04 | 0;
  out[oi++] = y05 + x05 | 0;
  out[oi++] = y06 + x06 | 0;
  out[oi++] = y07 + x07 | 0;
  out[oi++] = y08 + x08 | 0;
  out[oi++] = y09 + x09 | 0;
  out[oi++] = y10 + x10 | 0;
  out[oi++] = y11 + x11 | 0;
  out[oi++] = y12 + x12 | 0;
  out[oi++] = y13 + x13 | 0;
  out[oi++] = y14 + x14 | 0;
  out[oi++] = y15 + x15 | 0;
};
const BlockMix = (input, ii, out, oi, r) => {
  let head = oi + 0;
  let tail = oi + 16 * r;
  for (let i = 0; i < 16; i++)
    out[tail + i] = input[ii + (2 * r - 1) * 16 + i];
  for (let i = 0; i < r; i++, head += 16, ii += 16) {
    XorAndSalsa(out, tail, input, ii, out, head);
    if (i > 0)
      tail += 16;
    XorAndSalsa(out, head, input, ii += 16, out, tail);
  }
};
const scryptInit = async (password, salt, _opts) => {
  const opts = checkOpts({
    dkLen: 32,
    asyncTick: 10,
    maxmem: 1024 ** 3 + 1024
  }, _opts);
  const { N, r, p, dkLen, asyncTick, maxmem, onProgress } = opts;
  if (onProgress !== void 0 && typeof onProgress !== "function")
    throw new Error("progressCb should be function");
  const blockSize = 128 * r;
  const blockSize32 = blockSize / 4;
  if (N <= 1 || (N & N - 1) !== 0 || N >= 2 ** (blockSize / 8) || N > 2 ** 32) {
    throw new Error("Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32");
  }
  if (p < 0 || p > (2 ** 32 - 1) * 32 / blockSize) {
    throw new Error("Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)");
  }
  if (dkLen < 0 || dkLen > (2 ** 32 - 1) * 32) {
    throw new Error("Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32");
  }
  const memUsed = blockSize * (N + p);
  if (memUsed > maxmem) {
    throw new Error(`Scrypt: parameters too large, ${memUsed} (128 * r * (N + p)) > ${maxmem} (maxmem)`);
  }
  const B = await pbkdf2(password, salt, { c: 1, dkLen: blockSize * p });
  const B32 = u32(B);
  const V = u32(new Uint8Array(blockSize * N));
  const tmp = u32(new Uint8Array(blockSize));
  let blockMixCb = () => {
  };
  if (onProgress) {
    const totalBlockMix = 2 * N * p;
    const callbackPer = Math.max(Math.floor(totalBlockMix / 1e4), 1);
    let blockMixCnt = 0;
    blockMixCb = () => {
      blockMixCnt++;
      if (onProgress && (!(blockMixCnt % callbackPer) || blockMixCnt === totalBlockMix))
        onProgress(blockMixCnt / totalBlockMix);
    };
  }
  return { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb, asyncTick };
};
const scrypt = async (password, salt, opts) => {
  const { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb, asyncTick } = await scryptInit(password, salt, opts);
  for (let pi = 0; pi < p; pi++) {
    const Pi = blockSize32 * pi;
    for (let i = 0; i < blockSize32; i++)
      V[i] = B32[Pi + i];
    let pos = 0;
    await asyncLoop(N - 1, asyncTick, (i) => {
      BlockMix(V, pos, V, pos += blockSize32, r);
      blockMixCb();
    });
    BlockMix(V, (N - 1) * blockSize32, B32, Pi, r);
    blockMixCb();
    await asyncLoop(N, asyncTick, (i) => {
      const j = B32[Pi + blockSize32 - 16] % N;
      for (let k = 0; k < blockSize32; k++)
        tmp[k] = B32[Pi + k] ^ V[j * blockSize32 + k];
      BlockMix(tmp, 0, B32, Pi, r);
      blockMixCb();
    });
  }
  const res = await pbkdf2(password, B, { c: 1, dkLen });
  B.fill(0);
  V.fill(0);
  tmp.fill(0);
  return res;
};
const getRandomValues = (bytes) => crypto.getRandomValues(new Uint8Array(bytes));
const DEFAULT_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const generateRandomString = (size, alphabet = DEFAULT_ALPHABET) => {
  const mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
  const step = -~(1.6 * mask * size / alphabet.length);
  let bytes = getRandomValues(step);
  let id = "";
  let index = 0;
  while (id.length !== size) {
    id += alphabet[bytes[index] & mask] ?? "";
    index += 1;
    if (index > bytes.length) {
      bytes = getRandomValues(step);
      index = 0;
    }
  }
  return id;
};
const generateHashWithScrypt = async (s) => {
  const salt = generateRandomString(16);
  const key = await hashWithScrypt(s.normalize("NFKC"), salt);
  return `s2:${salt}:${key}`;
};
const hashWithScrypt = async (s, salt, blockSize = 16) => {
  const keyUint8Array = await scrypt(new TextEncoder().encode(s), new TextEncoder().encode(salt), {
    N: 16384,
    r: blockSize,
    p: 1,
    dkLen: 64
  });
  return convertUint8ArrayToHex(keyUint8Array);
};
const validateScryptHash = async (s, hash) => {
  const arr = hash.split(":");
  if (arr.length === 2) {
    const [salt2, key2] = arr;
    const targetKey = await hashWithScrypt(s, salt2, 8);
    return constantTimeEqual(targetKey, key2);
  }
  if (arr.length !== 3)
    return false;
  const [version, salt, key] = arr;
  if (version === "s2") {
    const targetKey = await hashWithScrypt(s, salt);
    return constantTimeEqual(targetKey, key);
  }
  return false;
};
const constantTimeEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  const aUint8Array = new TextEncoder().encode(a);
  const bUint8Array = new TextEncoder().encode(b);
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    c |= aUint8Array[i] ^ bUint8Array[i];
  }
  return c === 0;
};
const convertUint8ArrayToHex = (arr) => {
  return [...arr].map((x) => x.toString(16).padStart(2, "0")).join("");
};
class LuciaError extends Error {
  constructor(errorMsg, detail) {
    super(errorMsg);
    this.message = errorMsg;
    this.detail = detail ?? "";
  }
  detail;
  message;
}
const isWithinExpiration = (expiresInMs) => {
  const currentTime = Date.now();
  if (currentTime > expiresInMs)
    return false;
  return true;
};
const validateDatabaseSession = (databaseSession) => {
  if (!isWithinExpiration(databaseSession.idle_expires)) {
    return null;
  }
  const activeKey = isWithinExpiration(databaseSession.active_expires);
  return {
    sessionId: databaseSession.id,
    userId: databaseSession.user_id,
    activePeriodExpiresAt: new Date(Number(databaseSession.active_expires)),
    idlePeriodExpiresAt: new Date(Number(databaseSession.idle_expires)),
    state: activeKey ? "active" : "idle",
    fresh: false
  };
};
const transformDatabaseKey = (databaseKey) => {
  const [providerId, ...providerUserIdSegments] = databaseKey.id.split(":");
  const isPersistent = databaseKey.expires === null;
  const providerUserId = providerUserIdSegments.join(":");
  const userId = databaseKey.user_id;
  const isPasswordDefined = !!databaseKey.hashed_password;
  if (isPersistent) {
    return {
      type: "persistent",
      primary: databaseKey.primary_key,
      providerId,
      providerUserId,
      userId,
      passwordDefined: isPasswordDefined
    };
  }
  return {
    type: "single_use",
    providerId,
    providerUserId,
    userId,
    expiresAt: new Date(databaseKey.expires),
    expired: !isWithinExpiration(databaseKey.expires),
    passwordDefined: isPasswordDefined
  };
};
const getOneTimeKeyExpiration = (duration) => {
  if (typeof duration !== "number")
    return null;
  return new Date(duration * 1e3 + (/* @__PURE__ */ new Date()).getTime());
};
class AuthRequest {
  auth;
  context;
  constructor(auth2, context) {
    this.auth = auth2;
    this.context = context;
  }
  validatePromise = null;
  validateUserPromise = null;
  currentSession;
  setSession = (session) => {
    const storedSession = this.currentSession;
    const storedSessionId = storedSession?.sessionId ?? null;
    const newSessionId = session?.sessionId ?? null;
    if (storedSession !== void 0 && storedSessionId === newSessionId)
      return;
    this.currentSession = session;
    this.validateUserPromise = null;
    try {
      this.context.setCookie(this.auth.createSessionCookie(session));
    } catch {
    }
  };
  validate = async () => {
    if (this.currentSession !== void 0)
      return this.currentSession;
    if (this.validatePromise)
      return this.validatePromise;
    if (this.validateUserPromise) {
      const { session } = await this.validateUserPromise;
      return session;
    }
    this.validatePromise = new Promise(async (resolve) => {
      try {
        const sessionId = this.auth.parseRequestHeaders(this.context.request);
        if (!sessionId) {
          this.setSession(null);
          return resolve(null);
        }
        const session = await this.auth.validateSession(sessionId);
        this.setSession(session);
        return resolve(session);
      } catch {
        this.setSession(null);
        return resolve(null);
      }
    });
    return this.validatePromise;
  };
  validateUser = async () => {
    const currentSession = this.currentSession;
    if (currentSession === null) {
      return {
        session: null,
        user: null
      };
    }
    const resolveNullSession = (resolve) => {
      this.setSession(null);
      return resolve({
        user: null,
        session: null
      });
    };
    if (currentSession !== void 0) {
      this.validateUserPromise = new Promise(async (resolve) => {
        try {
          const user = await this.auth.getUser(currentSession.userId);
          return resolve({ user, session: currentSession });
        } catch {
          return resolveNullSession(resolve);
        }
      });
      return this.validateUserPromise;
    }
    if (this.validateUserPromise)
      return this.validateUserPromise;
    if (this.validatePromise) {
      this.validateUserPromise = new Promise(async (resolve) => {
        const session = await this.validatePromise;
        if (!session)
          return resolveNullSession(resolve);
        try {
          const user = await this.auth.getUser(session.userId);
          return resolve({ user, session });
        } catch {
          return resolveNullSession(resolve);
        }
      });
      return this.validateUserPromise;
    }
    this.validateUserPromise = new Promise(async (resolve) => {
      try {
        const sessionId = this.auth.parseRequestHeaders(this.context.request);
        if (!sessionId)
          return resolveNullSession(resolve);
        const { session, user } = await this.auth.validateSessionUser(sessionId);
        this.setSession(session);
        return resolve({ session, user });
      } catch {
        return resolveNullSession(resolve);
      }
    });
    return this.validateUserPromise;
  };
  getCookie = () => {
    const currentSession = this.currentSession;
    if (currentSession === void 0)
      return null;
    return this.auth.createSessionCookie(currentSession);
  };
}
const sveltekit = () => {
  return (event) => {
    const requestContext = {
      request: {
        url: event.request.url,
        method: event.request.method,
        headers: {
          origin: event.request.headers.get("Origin") ?? null,
          cookie: event.request.headers.get("Cookie") ?? null
        }
      },
      setCookie: (cookie) => {
        event.cookies.set(cookie.name, cookie.value, cookie.attributes);
      }
    };
    return requestContext;
  };
};
const lucia$1 = () => {
  return (requestContext) => requestContext;
};
const lucia = (config) => {
  return new Auth(config);
};
const validateConfiguration = (config) => {
  const adapterProvided = config.adapter;
  if (!adapterProvided) {
    logError('Adapter is not defined in configuration ("config.adapter")');
    process.exit(1);
  }
};
class Auth {
  adapter;
  generateUserId;
  sessionCookieOption;
  sessionExpiresIn;
  env;
  hash;
  autoDatabaseCleanup;
  middleware;
  csrfProtection;
  origin;
  constructor(config) {
    validateConfiguration(config);
    const defaultSessionCookieOption = {
      sameSite: "lax",
      path: "/"
    };
    if ("user" in config.adapter) {
      let userAdapter = config.adapter.user(LuciaError);
      let sessionAdapter = config.adapter.session(LuciaError);
      if ("getSessionAndUserBySessionId" in userAdapter) {
        const { getSessionAndUserBySessionId: _, ...extractedUserAdapter } = userAdapter;
        userAdapter = extractedUserAdapter;
      }
      if ("getSessionAndUserBySessionId" in sessionAdapter) {
        const { getSessionAndUserBySessionId: _, ...extractedSessionAdapter } = sessionAdapter;
        sessionAdapter = extractedSessionAdapter;
      }
      this.adapter = {
        ...userAdapter,
        ...sessionAdapter
      };
    } else {
      this.adapter = config.adapter(LuciaError);
    }
    this.generateUserId = config.generateCustomUserId ?? (() => generateRandomString(15));
    this.env = config.env;
    this.csrfProtection = config.csrfProtection ?? true;
    this.sessionExpiresIn = {
      activePeriod: config.sessionExpiresIn?.activePeriod ?? 1e3 * 60 * 60 * 24,
      idlePeriod: config.sessionExpiresIn?.idlePeriod ?? 1e3 * 60 * 60 * 24 * 14
    };
    this.autoDatabaseCleanup = config.autoDatabaseCleanup ?? true;
    this._transformDatabaseUser = (databaseUser) => {
      const defaultTransform = ({ id }) => {
        return {
          userId: id
        };
      };
      const transform = config.transformDatabaseUser ?? defaultTransform;
      return transform(databaseUser);
    };
    this.sessionCookieOption = config.sessionCookie ?? defaultSessionCookieOption;
    this.hash = {
      generate: config.hash?.generate ?? generateHashWithScrypt,
      validate: config.hash?.validate ?? validateScryptHash
    };
    this.middleware = config.middleware ?? lucia$1();
    this.origin = config.origin ?? [];
  }
  _transformDatabaseUser;
  transformDatabaseUser = (databaseUser) => {
    return this._transformDatabaseUser(databaseUser);
  };
  getUser = async (userId) => {
    const databaseUser = await this.adapter.getUser(userId);
    if (!databaseUser)
      throw new LuciaError("AUTH_INVALID_USER_ID");
    const user = this.transformDatabaseUser(databaseUser);
    return user;
  };
  getSessionUser = async (sessionId) => {
    if (sessionId.length !== 40)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    let databaseUser;
    let sessionData;
    if (this.adapter.getSessionAndUserBySessionId !== void 0) {
      const databaseUserSession = await this.adapter.getSessionAndUserBySessionId(sessionId);
      if (!databaseUserSession)
        throw new LuciaError("AUTH_INVALID_SESSION_ID");
      databaseUser = databaseUserSession.user;
      sessionData = databaseUserSession.session;
    } else {
      sessionData = await this.adapter.getSession(sessionId);
      databaseUser = sessionData ? await this.adapter.getUser(sessionData.user_id) : null;
    }
    if (!sessionData)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const session = validateDatabaseSession(sessionData);
    if (!session) {
      if (this.autoDatabaseCleanup) {
        await this.adapter.deleteSession(sessionId);
      }
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    }
    if (!databaseUser)
      throw new LuciaError("AUTH_INVALID_USER_ID");
    return {
      user: this.transformDatabaseUser(databaseUser),
      session
    };
  };
  createUser = async (data) => {
    const userId = await this.generateUserId();
    const userAttributes = data.attributes ?? {};
    if (data.primaryKey === null) {
      const databaseUser2 = await this.adapter.setUser(userId, userAttributes, null);
      const user2 = this.transformDatabaseUser(databaseUser2);
      return user2;
    }
    const keyId = `${data.primaryKey.providerId}:${data.primaryKey.providerUserId}`;
    const password = data.primaryKey.password;
    const hashedPassword = password ? await this.hash.generate(password) : null;
    const databaseUser = await this.adapter.setUser(userId, userAttributes, {
      id: keyId,
      user_id: userId,
      hashed_password: hashedPassword,
      primary_key: true,
      expires: null
    });
    const user = this.transformDatabaseUser(databaseUser);
    return user;
  };
  updateUserAttributes = async (userId, attributes) => {
    const [updatedDatabaseUser] = await Promise.all([
      this.adapter.updateUserAttributes(userId, attributes),
      this.autoDatabaseCleanup ? await this.deleteDeadUserSessions(userId) : null
    ]);
    if (updatedDatabaseUser)
      return this.transformDatabaseUser(updatedDatabaseUser);
    return await this.getUser(userId);
  };
  deleteUser = async (userId) => {
    await this.adapter.deleteSessionsByUserId(userId);
    await this.adapter.deleteKeysByUserId(userId);
    await this.adapter.deleteUser(userId);
  };
  useKey = async (providerId, providerUserId, password) => {
    const keyId = `${providerId}:${providerUserId}`;
    const shouldDataBeDeleted = async (data) => {
      const persistentKey = data.expires === null;
      if (persistentKey)
        return false;
      if (data.hashed_password === null)
        return true;
      if (password === null)
        return false;
      return await this.hash.validate(password, data.hashed_password);
    };
    const databaseKeyData = await this.adapter.getKey(keyId, shouldDataBeDeleted);
    if (!databaseKeyData)
      throw new LuciaError("AUTH_INVALID_KEY_ID");
    try {
      const singleUse = !!databaseKeyData.expires;
      const hashedPassword = databaseKeyData.hashed_password;
      if (hashedPassword) {
        if (!password)
          throw new LuciaError("AUTH_INVALID_PASSWORD");
        if (!hashedPassword)
          throw new LuciaError("AUTH_INVALID_PASSWORD");
        if (hashedPassword.startsWith("$2a"))
          throw new LuciaError("AUTH_OUTDATED_PASSWORD");
        const validPassword = await this.hash.validate(password, hashedPassword);
        if (!validPassword)
          throw new LuciaError("AUTH_INVALID_PASSWORD");
      }
      if (singleUse) {
        const withinExpiration = isWithinExpiration(databaseKeyData.expires);
        if (!withinExpiration)
          throw new LuciaError("AUTH_EXPIRED_KEY");
        await this.adapter.deleteNonPrimaryKey(databaseKeyData.id);
      }
      const key = transformDatabaseKey(databaseKeyData);
      return key;
    } catch (e) {
      if (e instanceof LuciaError && e.message === "AUTH_EXPIRED_KEY") {
        await this.adapter.deleteNonPrimaryKey(databaseKeyData.id);
      }
      throw e;
    }
  };
  getSession = async (sessionId) => {
    if (sessionId.length !== 40)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const databaseSession = await this.adapter.getSession(sessionId);
    if (!databaseSession)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const session = validateDatabaseSession(databaseSession);
    if (!session) {
      if (this.autoDatabaseCleanup) {
        await this.adapter.deleteSession(sessionId);
      }
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    }
    return session;
  };
  getAllUserSessions = async (userId) => {
    await this.getUser(userId);
    const databaseData = await this.adapter.getSessionsByUserId(userId);
    const validStoredUserSessions = databaseData.map((databaseSession) => {
      return validateDatabaseSession(databaseSession);
    }).filter((session) => session !== null);
    const deadStoredUserSessionIds = databaseData.map((databaseSession) => {
      return databaseSession.id;
    }).filter((sessionId) => {
      return !validStoredUserSessions.some((validSession) => validSession.sessionId === sessionId);
    });
    if (deadStoredUserSessionIds.length > 0) {
      await Promise.all(deadStoredUserSessionIds.map((deadSessionId) => this.adapter.deleteSession(deadSessionId)));
    }
    return validStoredUserSessions;
  };
  validateSession = async (sessionId) => {
    const session = await this.getSession(sessionId);
    if (session.state === "active")
      return session;
    const renewedSession = await this.renewSession(sessionId);
    return renewedSession;
  };
  validateSessionUser = async (sessionId) => {
    const { session, user } = await this.getSessionUser(sessionId);
    if (session.state === "active")
      return { session, user };
    const renewedSession = await this.renewSession(sessionId);
    return {
      session: renewedSession,
      user
    };
  };
  generateSessionId = () => {
    const sessionId = generateRandomString(40);
    const activePeriodExpiresAt = new Date((/* @__PURE__ */ new Date()).getTime() + this.sessionExpiresIn.activePeriod);
    const idlePeriodExpiresAt = new Date(activePeriodExpiresAt.getTime() + this.sessionExpiresIn.idlePeriod);
    return [sessionId, activePeriodExpiresAt, idlePeriodExpiresAt];
  };
  createSession = async (userId) => {
    const [sessionId, activePeriodExpiresAt, idlePeriodExpiresAt] = this.generateSessionId();
    await Promise.all([
      this.adapter.setSession({
        id: sessionId,
        user_id: userId,
        active_expires: activePeriodExpiresAt.getTime(),
        idle_expires: idlePeriodExpiresAt.getTime()
      }),
      this.autoDatabaseCleanup ? await this.deleteDeadUserSessions(userId) : null
    ]);
    return {
      userId,
      activePeriodExpiresAt,
      sessionId,
      idlePeriodExpiresAt,
      state: "active",
      fresh: true
    };
  };
  renewSession = async (sessionId) => {
    if (sessionId.length !== 40)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const databaseSession = await this.adapter.getSession(sessionId);
    if (!databaseSession)
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    const session = validateDatabaseSession(databaseSession);
    if (!session) {
      if (this.autoDatabaseCleanup) {
        await this.adapter.deleteSession(sessionId);
      }
      throw new LuciaError("AUTH_INVALID_SESSION_ID");
    }
    const [renewedSession] = await Promise.all([
      await this.createSession(session.userId),
      this.autoDatabaseCleanup ? await this.deleteDeadUserSessions(session.userId) : null
    ]);
    return renewedSession;
  };
  invalidateSession = async (sessionId) => {
    await this.adapter.deleteSession(sessionId);
  };
  invalidateAllUserSessions = async (userId) => {
    await this.adapter.deleteSessionsByUserId(userId);
  };
  deleteDeadUserSessions = async (userId) => {
    const databaseSessions = await this.adapter.getSessionsByUserId(userId);
    const deadSessionIds = databaseSessions.filter((databaseSession) => {
      return validateDatabaseSession(databaseSession) === null;
    }).map((databaseSession) => databaseSession.id);
    if (deadSessionIds.length === 0)
      return;
    await Promise.all(deadSessionIds.map((deadSessionId) => {
      this.adapter.deleteSession(deadSessionId);
    }));
  };
  parseRequestHeaders = (request) => {
    const cookies = parseCookie(request.headers.cookie ?? "");
    const sessionId = cookies[SESSION_COOKIE_NAME] ?? null;
    if (request.method === null || request.url === null)
      throw new LuciaError("AUTH_INVALID_REQUEST");
    const csrfCheck = request.method.toUpperCase() !== "GET" && request.method.toUpperCase() !== "HEAD";
    if (csrfCheck && this.csrfProtection) {
      const requestOrigin = request.headers.origin;
      if (!requestOrigin)
        throw new LuciaError("AUTH_INVALID_REQUEST");
      try {
        const url = new URL(request.url);
        if (![url.origin, ...this.origin].includes(requestOrigin))
          throw new LuciaError("AUTH_INVALID_REQUEST");
      } catch {
        throw new LuciaError("AUTH_INVALID_REQUEST");
      }
    }
    return sessionId;
  };
  handleRequest = (...args) => {
    const middleware = this.middleware;
    return new AuthRequest(this, middleware(...[...args, this.env]));
  };
  createSessionCookie = (session) => {
    return createSessionCookie(session, this.env, this.sessionCookieOption);
  };
  createKey = async (userId, keyData) => {
    const keyId = `${keyData.providerId}:${keyData.providerUserId}`;
    let hashedPassword = null;
    if (keyData.password !== null) {
      hashedPassword = await this.hash.generate(keyData.password);
    }
    if (keyData.type === "persistent") {
      await this.adapter.setKey({
        id: keyId,
        user_id: userId,
        hashed_password: hashedPassword,
        primary_key: false,
        expires: null
      });
      return {
        type: "persistent",
        providerId: keyData.providerId,
        providerUserId: keyData.providerUserId,
        primary: false,
        passwordDefined: !!keyData.password,
        userId
      };
    }
    const expiresAt = getOneTimeKeyExpiration(keyData.expiresIn);
    if (!expiresAt)
      throw new TypeError();
    await this.adapter.setKey({
      id: keyId,
      user_id: userId,
      hashed_password: hashedPassword,
      primary_key: false,
      expires: expiresAt.getTime()
    });
    return {
      type: "single_use",
      providerId: keyData.providerId,
      providerUserId: keyData.providerUserId,
      userId,
      expiresAt,
      expired: !isWithinExpiration(keyData.expiresIn),
      passwordDefined: !!keyData.password
    };
  };
  deleteKey = async (providerId, providerUserId) => {
    const keyId = `${providerId}:${providerUserId}`;
    await this.adapter.deleteNonPrimaryKey(keyId);
  };
  getKey = async (providerId, providerUserId) => {
    const keyId = `${providerId}:${providerUserId}`;
    const shouldDataBeDeleted = async () => false;
    const databaseKey = await this.adapter.getKey(keyId, shouldDataBeDeleted);
    if (!databaseKey)
      throw new LuciaError("AUTH_INVALID_KEY_ID");
    const key = transformDatabaseKey(databaseKey);
    return key;
  };
  getAllUserKeys = async (userId) => {
    await this.getUser(userId);
    const databaseData = await this.adapter.getKeysByUserId(userId);
    return databaseData.map((val) => transformDatabaseKey(val));
  };
  updateKeyPassword = async (providerId, providerUserId, password) => {
    const keyId = `${providerId}:${providerUserId}`;
    let updatedDatabaseKey;
    if (password === null) {
      updatedDatabaseKey = await this.adapter.updateKeyPassword(keyId, null);
    } else {
      const hashedPassword = await this.hash.generate(password);
      updatedDatabaseKey = await this.adapter.updateKeyPassword(keyId, hashedPassword);
    }
    if (updatedDatabaseKey)
      return;
    await this.getKey(providerId, providerUserId);
  };
}
const auth = lucia({
  adapter: prisma(new PrismaClient()),
  env: "PROD",
  middleware: sveltekit(),
  transformDatabaseUser: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
      name: userData.name,
      email: userData.email
    };
  }
});
export {
  LuciaError as L,
  auth as a
};

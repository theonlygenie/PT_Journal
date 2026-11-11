(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err2) => function __init() {
    if (err2) throw err2[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err2 = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all2) => {
    for (var name3 in all2)
      __defProp(target, name3, { get: all2[name3], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      init_buffer_shim();
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      init_buffer_shim();
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      init_buffer_shim();
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer5;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer5.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer5.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer5.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer5.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer5.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer5.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer5.prototype);
        return buf;
      }
      function Buffer5(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer5.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer5.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer5.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer5.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer5.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer5, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer5.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer5.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer5.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer5.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer5.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer5.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer5.alloc(+length);
      }
      Buffer5.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer5.prototype;
      };
      Buffer5.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer5.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer5.from(b, b.offset, b.byteLength);
        if (!Buffer5.isBuffer(a) || !Buffer5.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer5.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer5.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer5.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer5.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer5.isBuffer(buf)) buf = Buffer5.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer5.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer5.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer5.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer5.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer5.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer5.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer5.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer5.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer5.prototype.toLocaleString = Buffer5.prototype.toString;
      Buffer5.prototype.equals = function equals(b) {
        if (!Buffer5.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer5.compare(this, b) === 0;
      };
      Buffer5.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer5.prototype[customInspectSymbol] = Buffer5.prototype.inspect;
      }
      Buffer5.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer5.from(target, target.offset, target.byteLength);
        }
        if (!Buffer5.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer5.from(val, encoding);
        }
        if (Buffer5.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer5.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer5.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer5.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer5.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer5.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer5.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer5.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer5.prototype.readUintLE = Buffer5.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer5.prototype.readUintBE = Buffer5.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer5.prototype.readUint8 = Buffer5.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer5.prototype.readUint16LE = Buffer5.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer5.prototype.readUint16BE = Buffer5.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer5.prototype.readUint32LE = Buffer5.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer5.prototype.readUint32BE = Buffer5.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer5.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer5.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer5.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer5.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer5.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer5.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer5.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer5.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer5.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer5.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer5.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer5.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer5.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer5.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer5.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer5.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer5.prototype.writeUintLE = Buffer5.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer5.prototype.writeUintBE = Buffer5.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer5.prototype.writeUint8 = Buffer5.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer5.prototype.writeUint16LE = Buffer5.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer5.prototype.writeUint16BE = Buffer5.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer5.prototype.writeUint32LE = Buffer5.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer5.prototype.writeUint32BE = Buffer5.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer5.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer5.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer5.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer5.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer5.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer5.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer5.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer5.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer5.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer5.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer5.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer5.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer5.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer5.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer5.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer5.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer5.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer5.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer5.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer5.isBuffer(val) ? val : Buffer5.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name3) {
          if (name3) {
            return `${name3} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name3, actual) {
          return `The "${name3}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name3) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name3, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = (function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      })();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // src/buffer-shim.js
  var import_buffer;
  var init_buffer_shim = __esm({
    "src/buffer-shim.js"() {
      import_buffer = __toESM(require_buffer());
    }
  });

  // src/fs-shim.js
  var fs_shim_exports = {};
  __export(fs_shim_exports, {
    attach: () => attach,
    default: () => fs_shim_default,
    existsSync: () => existsSync,
    readFileSync: () => readFileSync,
    readdirSync: () => readdirSync,
    statSync: () => statSync
  });
  function attach(v) {
    vfs = v;
  }
  function existsSync(p) {
    return vfs.exists(p);
  }
  function readFileSync(p, enc) {
    const b = vfs.read(p);
    if (b === null) throw err("ENOENT", p);
    if (b === void 0) return enc ? "" : import_buffer2.Buffer.alloc(0);
    return enc ? b.toString(enc) : b;
  }
  function statSync(p) {
    const s = vfs.stat(p);
    if (s === null) throw err("ENOENT", p);
    return s === void 0 ? { mtimeMs: 0, size: 0, isFile: () => true } : s;
  }
  function readdirSync(p) {
    const l = vfs.list(p);
    if (l === null) throw err("ENOENT", p);
    return l === void 0 ? [] : l.slice();
  }
  var import_buffer2, vfs, err, fs_shim_default;
  var init_fs_shim = __esm({
    "src/fs-shim.js"() {
      init_buffer_shim();
      import_buffer2 = __toESM(require_buffer());
      vfs = null;
      err = (code, p) => Object.assign(new Error(code + ": " + p), { code });
      fs_shim_default = { existsSync, readFileSync, statSync, readdirSync };
    }
  });

  // node_modules/path-browserify/index.js
  var require_path_browserify = __commonJS({
    "node_modules/path-browserify/index.js"(exports, module) {
      "use strict";
      init_buffer_shim();
      function assertPath(path) {
        if (typeof path !== "string") {
          throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
        }
      }
      function normalizeStringPosix(path, allowAboveRoot) {
        var res = "";
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0; i <= path.length; ++i) {
          if (i < path.length)
            code = path.charCodeAt(i);
          else if (code === 47)
            break;
          else
            code = 47;
          if (code === 47) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
              if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                if (res.length > 2) {
                  var lastSlashIndex = res.lastIndexOf("/");
                  if (lastSlashIndex !== res.length - 1) {
                    if (lastSlashIndex === -1) {
                      res = "";
                      lastSegmentLength = 0;
                    } else {
                      res = res.slice(0, lastSlashIndex);
                      lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                    }
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = "";
                  lastSegmentLength = 0;
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
              if (allowAboveRoot) {
                if (res.length > 0)
                  res += "/..";
                else
                  res = "..";
                lastSegmentLength = 2;
              }
            } else {
              if (res.length > 0)
                res += "/" + path.slice(lastSlash + 1, i);
              else
                res = path.slice(lastSlash + 1, i);
              lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
          } else if (code === 46 && dots !== -1) {
            ++dots;
          } else {
            dots = -1;
          }
        }
        return res;
      }
      function _format(sep, pathObject) {
        var dir = pathObject.dir || pathObject.root;
        var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir) {
          return base;
        }
        if (dir === pathObject.root) {
          return dir + base;
        }
        return dir + sep + base;
      }
      var posix = {
        // path.resolve([from ...], to)
        resolve: function resolve() {
          var resolvedPath = "";
          var resolvedAbsolute = false;
          var cwd;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path;
            if (i >= 0)
              path = arguments[i];
            else {
              if (cwd === void 0)
                cwd = process.cwd();
              path = cwd;
            }
            assertPath(path);
            if (path.length === 0) {
              continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47;
          }
          resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
          if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
              return "/" + resolvedPath;
            else
              return "/";
          } else if (resolvedPath.length > 0) {
            return resolvedPath;
          } else {
            return ".";
          }
        },
        normalize: function normalize(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var isAbsolute = path.charCodeAt(0) === 47;
          var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
          path = normalizeStringPosix(path, !isAbsolute);
          if (path.length === 0 && !isAbsolute) path = ".";
          if (path.length > 0 && trailingSeparator) path += "/";
          if (isAbsolute) return "/" + path;
          return path;
        },
        isAbsolute: function isAbsolute(path) {
          assertPath(path);
          return path.length > 0 && path.charCodeAt(0) === 47;
        },
        join: function join() {
          if (arguments.length === 0)
            return ".";
          var joined;
          for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
              if (joined === void 0)
                joined = arg;
              else
                joined += "/" + arg;
            }
          }
          if (joined === void 0)
            return ".";
          return posix.normalize(joined);
        },
        relative: function relative(from, to) {
          assertPath(from);
          assertPath(to);
          if (from === to) return "";
          from = posix.resolve(from);
          to = posix.resolve(to);
          if (from === to) return "";
          var fromStart = 1;
          for (; fromStart < from.length; ++fromStart) {
            if (from.charCodeAt(fromStart) !== 47)
              break;
          }
          var fromEnd = from.length;
          var fromLen = fromEnd - fromStart;
          var toStart = 1;
          for (; toStart < to.length; ++toStart) {
            if (to.charCodeAt(toStart) !== 47)
              break;
          }
          var toEnd = to.length;
          var toLen = toEnd - toStart;
          var length = fromLen < toLen ? fromLen : toLen;
          var lastCommonSep = -1;
          var i = 0;
          for (; i <= length; ++i) {
            if (i === length) {
              if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                  return to.slice(toStart + i + 1);
                } else if (i === 0) {
                  return to.slice(toStart + i);
                }
              } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                  lastCommonSep = i;
                } else if (i === 0) {
                  lastCommonSep = 0;
                }
              }
              break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
              break;
            else if (fromCode === 47)
              lastCommonSep = i;
          }
          var out = "";
          for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === 47) {
              if (out.length === 0)
                out += "..";
              else
                out += "/..";
            }
          }
          if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
          else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47)
              ++toStart;
            return to.slice(toStart);
          }
        },
        _makeLong: function _makeLong(path) {
          return path;
        },
        dirname: function dirname(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var code = path.charCodeAt(0);
          var hasRoot = code === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1) return hasRoot ? "/" : ".";
          if (hasRoot && end === 1) return "//";
          return path.slice(0, end);
        },
        basename: function basename(path, ext) {
          if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
          assertPath(path);
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path) return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else {
                if (firstNonSlashEnd === -1) {
                  matchedSlash = false;
                  firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                  if (code === ext.charCodeAt(extIdx)) {
                    if (--extIdx === -1) {
                      end = i;
                    }
                  } else {
                    extIdx = -1;
                    end = firstNonSlashEnd;
                  }
                }
              }
            }
            if (start === end) end = firstNonSlashEnd;
            else if (end === -1) end = path.length;
            return path.slice(start, end);
          } else {
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1) return "";
            return path.slice(start, end);
          }
        },
        extname: function extname(path) {
          assertPath(path);
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path.slice(startDot, end);
        },
        format: function format(pathObject) {
          if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
          }
          return _format("/", pathObject);
        },
        parse: function parse(path) {
          assertPath(path);
          var ret = { root: "", dir: "", base: "", ext: "", name: "" };
          if (path.length === 0) return ret;
          var code = path.charCodeAt(0);
          var isAbsolute = code === 47;
          var start;
          if (isAbsolute) {
            ret.root = "/";
            start = 1;
          } else {
            start = 0;
          }
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var i = path.length - 1;
          var preDotState = 0;
          for (; i >= start; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1) startDot = i;
              else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
              if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
              else ret.base = ret.name = path.slice(startPart, end);
            }
          } else {
            if (startPart === 0 && isAbsolute) {
              ret.name = path.slice(1, startDot);
              ret.base = path.slice(1, end);
            } else {
              ret.name = path.slice(startPart, startDot);
              ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
          }
          if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
          else if (isAbsolute) ret.dir = "/";
          return ret;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
      };
      posix.posix = posix;
      module.exports = posix;
    }
  });

  // shared/parser.js
  var require_parser = __commonJS({
    "shared/parser.js"(exports, module) {
      init_buffer_shim();
      var fs = (init_fs_shim(), __toCommonJS(fs_shim_exports));
      var path = require_path_browserify();
      var LINE = /^(\d\d):(\d\d):(\d\d) (\w+)\s+(\w+)\s+(.*)$/;
      var WILD = /^shiny chance (\d+) in (\d+) for species (\d+) at level (\d+)/;
      var CAUGHT = /^caught battler \d+ slot \d+ species (\d+)/;
      var FAINT = /^battler \d+ state 0$/;
      var BATTLE_START = /^encounter effect took/;
      var THROW = /^ball (\d+) from battler \d+ at battler \d+/;
      var EXP_POOL = /foe gives (\d+);/;
      var RELOAD = "going back to the last save";
      function parseSession(file) {
        const m = path.basename(file).match(/^session-(\d{4})(\d\d)(\d\d)-(\d\d)(\d\d)(\d\d)\.log$/);
        const s = {
          file: path.basename(file),
          mtimeMs: fs.statSync(file).mtimeMs,
          started: m ? new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6]).toISOString() : null,
          seconds: 0,
          wild: 0,
          battles: 0,
          catches: 0,
          faints: 0,
          throws: 0,
          exp: 0,
          foes: 0,
          reloads: 0,
          shinyExp: 0,
          // the shiny chances added up: the number of shinies you would expect from these encounters
          seq: [],
          // species of each wild encounter, in the order they happened
          species: {},
          caught: {},
          balls: {},
          trades: [],
          // direct trades with a friend: { gave, got } species numbers
          gts: []
          // species that arrived from the GTS
        };
        let first = null, last = null, day = 0, lastBall = null;
        for (const line of fs.readFileSync(file, "latin1").split(/\r?\n/)) {
          const l = LINE.exec(line);
          if (!l) continue;
          let t = +l[1] * 3600 + +l[2] * 60 + +l[3] + day * 86400;
          if (last !== null && t < last) {
            day++;
            t += 86400;
          }
          if (first === null) first = t;
          last = t;
          const cat = l[5], msg = l[6];
          if (cat === "TRADE") {
            const t2 = /^traded (\d+) for (\d+)/.exec(msg);
            if (t2) s.trades.push({ gave: +t2[1], got: +t2[2] });
          } else if (cat === "RIFT") {
            const g = /^GTS: a Pokemon \(species (\d+)\) came to box/.exec(msg);
            if (g) s.gts.push(+g[1]);
          }
          if (cat === "WILD") {
            const w = WILD.exec(msg);
            if (w) {
              s.wild++;
              s.shinyExp += +w[1] / +w[2];
              s.seq.push(+w[3]);
              const e = s.species[w[3]] ||= { count: 0, levelSum: 0, min: 999, max: 0 };
              e.count++;
              e.levelSum += +w[4];
              e.min = Math.min(e.min, +w[4]);
              e.max = Math.max(e.max, +w[4]);
            }
          } else if (cat === "CATCH") {
            const t2 = THROW.exec(msg);
            if (t2) {
              s.throws++;
              lastBall = t2[1];
              (s.balls[lastBall] ||= { throws: 0, caught: 0 }).throws++;
            }
            const c = CAUGHT.exec(msg);
            if (c) {
              s.catches++;
              s.caught[c[1]] = (s.caught[c[1]] || 0) + 1;
              if (lastBall) (s.balls[lastBall] ||= { throws: 0, caught: 0 }).caught++;
            }
          } else if (cat === "EXP") {
            const x = EXP_POOL.exec(msg);
            if (x) {
              s.exp += +x[1];
              s.foes++;
            }
          } else if (cat === "RESET" && msg === RELOAD) s.reloads++;
          else if (cat === "FAINT" && FAINT.test(msg)) s.faints++;
          else if (cat === "BATTLE" && BATTLE_START.test(msg)) s.battles++;
        }
        s.seconds = first === null ? 0 : last - first;
        return s;
      }
      function parseEncounters(file) {
        const byRoute = {};
        for (const line of fs.readFileSync(file, "latin1").split(/\r?\n/)) {
          const p = line.trim().split(" ");
          if (p.length < 6) continue;
          const route = p.slice(5).join(" ");
          const e = byRoute[route] ||= { count: 0, species: {} };
          e.count++;
          e.species[p[1]] = (e.species[p[1]] || 0) + 1;
        }
        return byRoute;
      }
      function readText(file) {
        try {
          return fs.readFileSync(file, "utf8").trim();
        } catch {
          return "";
        }
      }
      function readItemNames(file, desc) {
        const names = {};
        try {
          for (const line of fs.readFileSync(file, "utf8").split("\n")) {
            const p = line.replace("\r", "").split("	");
            if (p.length >= 2 && /^[0-9]+$/.test(p[0])) {
              names[p[0]] = p[1];
              if (desc && p[2]) desc[p[0]] = p[2];
            }
          }
        } catch {
        }
        return names;
      }
      var BAG = [
        ["Items", 1596, 165],
        ["Key Items", 2256, 50],
        ["TMs & HMs", 2456, 100],
        ["Mail", 2856, 12],
        ["Medicine", 2904, 40],
        ["Berries", 3064, 64],
        ["Pok\xE9 Balls", 3320, 15],
        ["Battle Items", 3380, 30]
      ];
      function readBag(file, maxId) {
        let buf;
        try {
          buf = fs.readFileSync(file);
        } catch {
          return null;
        }
        if (buf.length < 270336) return null;
        const out = {};
        for (const [name3, off, n] of BAG) {
          const list = [];
          for (let i = 0; i < n; i++) {
            const id = buf[off + i * 4] | buf[off + i * 4 + 1] << 8, q = buf[off + i * 4 + 2] | buf[off + i * 4 + 3] << 8;
            if (id >= 1 && id <= maxId && q >= 1 && q <= 999) list.push([id, q]);
          }
          out[name3] = list;
        }
        return Object.values(out).some((l) => l.length) ? out : null;
      }
      function readTrainer(file) {
        let buf;
        try {
          buf = fs.readFileSync(file);
        } catch {
          return null;
        }
        if (buf.length < 270336) return null;
        const tid = buf.readUInt16LE(132), sid = buf.readUInt16LE(134), money = buf.readUInt32LE(136);
        if (money > 999999) return null;
        let name3 = "";
        for (let i = 0; i < 8; i++) {
          const c = buf.readUInt16LE(116 + i * 2);
          if (c === 65535) break;
          name3 += NICK_CHAR(c);
        }
        let badges = 0;
        for (let v = buf[142]; v; v >>= 1) badges += v & 1;
        return { tid, sid, money, gender: buf[140] === 1 ? "F" : "M", name: name3, badges, hours: buf.readUInt16LE(150), minutes: buf[152] };
      }
      var WORLD_KEYS = [
        "game_type",
        "rules",
        "level_caps",
        "party",
        "lives",
        "lives_scope",
        "pool_kind",
        "pool_type",
        "pool_wrong",
        "preset",
        "random_species",
        "randomize_eggs",
        "starter_region",
        "challenge_state",
        "run_over",
        "free_play",
        "modern_types",
        "double_battles",
        "expanded_encounters",
        "new_routes",
        "one_hour_day",
        "partner_starters",
        "start_exp_share",
        "skip_tutorials"
      ];
      function readWorldSettings(file) {
        const out = {};
        try {
          for (const line of fs.readFileSync(file, "utf8").split("\n")) {
            const m = /^([a-z_]+)=(-?[0-9]+)\s*$/.exec(line.replace("\r", ""));
            if (m && WORLD_KEYS.includes(m[1])) out[m[1]] = +m[2];
          }
        } catch {
          return null;
        }
        return Object.keys(out).length ? out : null;
      }
      function readSinnohDex(file) {
        try {
          const b = fs.readFileSync(file);
          if (b.toString("latin1", 0, 4) !== "NARC") return null;
          const fat = 16, count = b.readUInt16LE(fat + 8);
          if (!count) return null;
          let at = fat + b.readUInt32LE(fat + 4);
          at += b.readUInt32LE(at + 4);
          const start = at + 8 + b.readUInt32LE(fat + 12), end = at + 8 + b.readUInt32LE(fat + 16);
          const out = [];
          for (let o = start + 2; o + 2 <= end; o += 2) {
            const v = b.readUInt16LE(o);
            if (v >= 1 && v <= 493) out.push(v);
          }
          return out.length >= 100 ? out : null;
        } catch {
          return null;
        }
      }
      function readNpcTrades(file) {
        try {
          const b = fs.readFileSync(file);
          if (b.toString("latin1", 0, 4) !== "NARC") return [];
          const fat = 16, count = b.readUInt16LE(fat + 8);
          let at = fat + b.readUInt32LE(fat + 4);
          at += b.readUInt32LE(at + 4);
          const out = [];
          for (let i = 0; i < count; i++) {
            const start = at + 8 + b.readUInt32LE(fat + 12 + i * 8), end = at + 8 + b.readUInt32LE(fat + 16 + i * 8);
            if (end - start >= 36) out.push({ species: b.readUInt32LE(start), tid: b.readUInt32LE(start + 32) });
          }
          return out;
        } catch {
          return [];
        }
      }
      function readWorldCard(file) {
        try {
          const p = fs.readFileSync(file, "utf8").split(/\r?\n/)[0].split("	");
          if (p.length < 6) return null;
          return {
            trainer: p[0],
            badges: +p[1] || 0,
            playTime: p[2],
            place: p[3],
            party: p[5].split(",").map((x) => x.split(".")[0]).filter((x) => /^\d+$/.test(x))
          };
        } catch {
          return null;
        }
      }
      var DEX_MAGIC = import_buffer.Buffer.from([254, 202, 239, 190]);
      function readSaveDex(file) {
        let buf;
        try {
          buf = fs.readFileSync(file);
        } catch {
          return null;
        }
        if (buf.length < 270336) return null;
        for (const at of [4916, 267060]) {
          if (buf.compare(DEX_MAGIC, 0, 4, at, at + 4) !== 0) continue;
          const bit = (base, n) => buf[base + (n - 1 >> 3)] >> (n - 1 & 7) & 1;
          const seen = [], caught = [];
          for (let n = 1; n <= 493; n++) {
            if (bit(at + 68, n)) seen.push(n);
            if (bit(at + 4, n)) caught.push(n);
          }
          return { seen, caught };
        }
        return null;
      }
      var BLOCK_POS = [
        0,
        1,
        2,
        3,
        0,
        1,
        3,
        2,
        0,
        2,
        1,
        3,
        0,
        2,
        3,
        1,
        0,
        3,
        1,
        2,
        0,
        3,
        2,
        1,
        1,
        0,
        2,
        3,
        1,
        0,
        3,
        2,
        1,
        2,
        0,
        3,
        1,
        2,
        3,
        0,
        1,
        3,
        0,
        2,
        1,
        3,
        2,
        0,
        2,
        0,
        1,
        3,
        2,
        0,
        3,
        1,
        2,
        1,
        0,
        3,
        2,
        1,
        3,
        0,
        2,
        3,
        0,
        1,
        2,
        3,
        1,
        0,
        3,
        0,
        1,
        2,
        3,
        0,
        2,
        1,
        3,
        1,
        0,
        2,
        3,
        1,
        2,
        0,
        3,
        2,
        0,
        1,
        3,
        2,
        1,
        0
      ];
      var blockPos = (sv, block) => {
        for (let j = 0; j < 4; j++) if (BLOCK_POS[sv * 4 + j] === block) return j;
        return 0;
      };
      var NICK_CHAR = (c) => c >= 289 && c <= 298 ? String.fromCharCode(48 + c - 289) : c >= 299 && c <= 324 ? String.fromCharCode(65 + c - 299) : c >= 325 && c <= 350 ? String.fromCharCode(97 + c - 325) : c === 65535 ? "" : "";
      function decodeMon(buf, off) {
        const u16 = (o) => buf[o] | buf[o + 1] << 8;
        const pid = (buf[off] | buf[off + 1] << 8 | buf[off + 2] << 16 | buf[off + 3] << 24) >>> 0;
        if (!pid) return null;
        const stored = u16(off + 6);
        let seed = stored, sum = 0;
        const w = [];
        for (let i = 0; i < 64; i++) {
          seed = Math.imul(seed, 1103515245) + 24691 >>> 0;
          const x = (u16(off + 8 + i * 2) ^ seed >>> 16) & 65535;
          w.push(x);
          sum = sum + x & 65535;
        }
        if (sum !== stored) return null;
        const sv = ((pid & 253952) >> 13) % 24;
        const blk = (b) => w.slice(blockPos(sv, b) * 16, blockPos(sv, b) * 16 + 16);
        const A = blk(0), B = blk(1), C = blk(2), D = blk(3);
        const iv32 = (B[8] | B[9] << 16) >>> 0;
        const bits = (s) => iv32 >>> s & 31;
        return {
          pid,
          species: A[0],
          nature: pid % 25,
          item: A[1],
          moves: [B[0], B[1], B[2], B[3]],
          tid: A[2],
          sid: A[3],
          ot: D.slice(0, 8).map(NICK_CHAR).join(""),
          // original trainer: ID, secret ID and name
          // block D: where it was met (a place number), where its egg came from (0 if it was not an egg), the ball, and the level it was met at
          loc: D[12],
          eggLoc: D[11],
          ball: D[13] >> 8,
          mlv: D[14] & 127,
          nick: C.slice(0, 11).map(NICK_CHAR).join(""),
          iv: [bits(0), bits(5), bits(10), bits(20), bits(25), bits(15)],
          // HP, Atk, Def, SpA, SpD, Spe
          ev: [A[8] & 255, A[8] >> 8, A[9] & 255, A[10] & 255, A[10] >> 8, A[9] >> 8],
          // same order
          shiny: (A[2] ^ A[3] ^ pid >>> 16 ^ pid & 65535) < 8 ? 1 : 0,
          egg: iv32 >>> 30 & 1
        };
      }
      var ownedCache = /* @__PURE__ */ new Map();
      function readOwned(file) {
        let st;
        try {
          st = fs.statSync(file);
        } catch {
          return null;
        }
        const key = `${st.size}:${st.mtimeMs}`;
        const hit = ownedCache.get(file);
        if (hit && hit.key === key) return hit.value;
        let buf;
        try {
          buf = fs.readFileSync(file);
        } catch {
          return null;
        }
        if (buf.length < 270336) return null;
        const u16 = (o) => buf[o] | buf[o + 1] << 8;
        const u32 = (o) => (buf[o] | buf[o + 1] << 8 | buf[o + 2] << 16 | buf[o + 3] << 24) >>> 0;
        const half = 262144;
        const hits = [];
        for (let off = 0; off + 136 <= half; off++) {
          if (u32(off) === 0) continue;
          const stored = u16(off + 6);
          let seed = stored, sum = 0;
          for (let i = 0; i < 64; i++) {
            seed = Math.imul(seed, 1103515245) + 24691 >>> 0;
            sum = sum + ((u16(off + 8 + i * 2) ^ seed >>> 16) & 65535) & 65535;
          }
          if (sum === stored) hits.push(off);
        }
        const inRun = /* @__PURE__ */ new Set();
        for (const [stride, min] of [[136, 3], [236, 2]]) {
          let run2 = [];
          const flush = () => {
            if (run2.length >= min) run2.forEach((o) => inRun.add(o));
            run2 = [];
          };
          for (const h of hits) {
            if (run2.length && h - run2[run2.length - 1] === stride) run2.push(h);
            else {
              flush();
              run2 = [h];
            }
          }
          flush();
        }
        const counts = {}, mons = [];
        for (const off of [...inRun].sort((a, b) => a - b)) {
          const m = decodeMon(buf, off);
          if (!m || m.species <= 0 || m.species >= 2e3) continue;
          counts[m.species] = (counts[m.species] || 0) + 1;
          mons.push(m);
        }
        const all2 = [];
        for (const off of hits) {
          const m = decodeMon(buf, off);
          if (m && (m.species >= 1 && m.species <= 493 || m.species >= 512 && m.species <= 774)) all2.push(m.pid);
        }
        const value = { counts, total: inRun.size, mons, all: all2 };
        ownedCache.set(file, { key, value });
        return value;
      }
      function readParty(file) {
        let buf;
        try {
          buf = fs.readFileSync(file);
        } catch {
          return null;
        }
        if (buf.length < 4096) return null;
        const u16 = (o) => buf[o] | buf[o + 1] << 8;
        const u32 = (o) => (buf[o] | buf[o + 1] << 8 | buf[o + 2] << 16 | buf[o + 3] << 24) >>> 0;
        const record = (off) => {
          const m = decodeMon(buf, off);
          if (!m) return null;
          let s2 = m.pid;
          const tail = [];
          for (let k = 0; k < 5; k++) {
            s2 = Math.imul(s2, 1103515245) + 24691 >>> 0;
            tail.push((u16(off + 136 + k * 2) ^ s2 >>> 16) & 65535);
          }
          return { ...m, level: tail[2] & 255, hp: tail[3], maxHp: tail[4] };
        };
        let start = 172;
        if (!record(start)) {
          start = -1;
          for (let off = 32; off < 1024; off++) if (record(off)) {
            start = off;
            break;
          }
          if (start < 0) return null;
        }
        const party = [];
        for (let i = 0; i < 6; i++) {
          const m = record(start + i * 236);
          if (!m) break;
          party.push(m);
        }
        return party;
      }
      var fileCache = /* @__PURE__ */ new Map();
      function cached(kind, file, fn) {
        let st;
        try {
          st = fs.statSync(file);
        } catch {
          return fn(file);
        }
        const key = kind + "|" + file, stamp = st.size + ":" + st.mtimeMs, hit = fileCache.get(key);
        if (hit && hit.stamp === stamp) return hit.value;
        const value = fn(file);
        fileCache.set(key, { stamp, value });
        return value;
      }
      function load2(gameDir, archiveDir) {
        const out = { gameDir, sessions: [], worlds: [], missing: false };
        const logDir = path.join(gameDir, "logs");
        if (!fs.existsSync(logDir)) {
          const has = (n) => {
            try {
              return fs.existsSync(path.join(gameDir, n));
            } catch {
              return false;
            }
          };
          out.missing = true;
          out.found = { exists: has(""), exe: has("Platinum.exe"), logs: false, save: has("save.bin"), worlds: has("worlds") };
          return out;
        }
        const logs = /* @__PURE__ */ new Map();
        const isLog = (f) => /^session-.*\.log$/.test(f);
        for (const f of fs.readdirSync(logDir).filter(isLog)) logs.set(f, path.join(logDir, f));
        if (archiveDir && fs.existsSync(archiveDir)) {
          for (const f of fs.readdirSync(archiveDir).filter(isLog)) {
            const mine = path.join(archiveDir, f), cur = logs.get(f);
            try {
              if (!cur || fs.statSync(mine).size > fs.statSync(cur).size) logs.set(f, mine);
            } catch {
            }
          }
        }
        for (const f of [...logs.keys()].sort()) {
          try {
            out.sessions.push(cached("session", logs.get(f), parseSession));
          } catch {
          }
        }
        const dirs = [{ name: readText(path.join(gameDir, "world-name.txt")) || "Active world", dir: gameDir }];
        const wd = path.join(gameDir, "worlds");
        if (fs.existsSync(wd)) {
          for (const d of fs.readdirSync(wd)) {
            const full = path.join(wd, d);
            if (fs.existsSync(path.join(full, "encounters.ini"))) {
              dirs.push({ name: readText(path.join(full, "world-name.txt")) || `World ${d}`, dir: full });
            }
          }
        }
        for (const { name: name3, dir } of dirs) {
          const f = path.join(dir, "encounters.ini");
          if (fs.existsSync(f)) {
            try {
              out.worlds.push({ name: name3, routes: cached("enc", f, parseEncounters) });
            } catch {
            }
          }
        }
        const names = new Set(dirs.map((d) => d.name));
        for (const base of [wd, path.join(wd, "deleted")]) {
          if (!fs.existsSync(base)) continue;
          for (const d of fs.readdirSync(base)) {
            const n = readText(path.join(base, d, "world-name.txt"));
            if (n) names.add(n);
          }
        }
        out.knownWorlds = [...names].sort((a, b) => a.localeCompare(b));
        out.dex = {};
        const saves = [{ name: readText(path.join(gameDir, "world-name.txt")) || "Active world", file: path.join(gameDir, "save.bin") }];
        if (fs.existsSync(wd)) {
          for (const d of fs.readdirSync(wd)) {
            const f = path.join(wd, d, "save.bin");
            if (fs.existsSync(f)) saves.push({ name: readText(path.join(wd, d, "world-name.txt")) || `World ${d}`, file: f });
          }
        }
        out.owned = {};
        out.party = {};
        out.bag = {};
        out.trainer = {};
        for (const s of saves) {
          const dx = cached("dex", s.file, readSaveDex);
          if (dx && !out.dex[s.name]) {
            out.dex[s.name] = dx;
            const ow = readOwned(s.file);
            if (ow) out.owned[s.name] = ow;
            const pa = cached("party", s.file, readParty);
            if (pa && pa.length) out.party[s.name] = pa;
            const bg = cached("bag", s.file, (f) => readBag(f, 700));
            if (bg) out.bag[s.name] = bg;
            const tr = cached("trainer", s.file, readTrainer);
            if (tr) out.trainer[s.name] = tr;
          }
        }
        out.settings = {};
        for (const { name: name3, dir } of dirs) {
          if (!out.settings[name3]) {
            const st = cached("world", path.join(dir, "world.ini"), readWorldSettings);
            if (st) out.settings[name3] = st;
          }
        }
        out.goneWorlds = [];
        const delDir = path.join(wd, "deleted");
        if (fs.existsSync(delDir)) {
          for (const d of fs.readdirSync(delDir).sort().reverse()) {
            const n = readText(path.join(delDir, d, "world-name.txt"));
            if (!n || out.settings[n]) continue;
            const st = cached("world", path.join(delDir, d, "world.ini"), readWorldSettings);
            if (st) {
              out.settings[n] = st;
              out.goneWorlds.push(n);
            }
          }
        }
        out.sinnoh = cached("sinnoh", path.join(gameDir, "poketool", "shinzukan.narc"), readSinnohDex);
        out.npcTrades = cached("npc", path.join(gameDir, "fielddata", "pokemon_trade", "fld_trade.narc"), readNpcTrades);
        out.itemDesc = {};
        out.itemNames = readItemNames(path.join(gameDir, "kit-item-text.txt"), out.itemDesc);
        out.worldCard = readWorldCard(path.join(gameDir, "world-card.ini"));
        return out;
      }
      module.exports = { load: load2 };
    }
  });

  // shared/spawns-build.js
  var require_spawns_build = __commonJS({
    "shared/spawns-build.js"(exports, module) {
      init_buffer_shim();
      var norm2 = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
      var maxLevel = (s) => Math.max(...String(s).split(/[–-]/).map(Number).filter(Number.isFinite));
      function looksLikeWiki2(W) {
        return !!W && typeof W === "object" && Array.isArray(W.species) && W.species.length > 100 && Array.isArray(W.wild) && W.wild.length > 100 && Array.isArray(W.other) && Array.isArray(W.evolutions) && W.places && typeof W.places === "object";
      }
      function build2(W, names) {
        const numByName = {};
        for (const [n, nm] of Object.entries(names)) numByName[norm2(nm)] = +n;
        const num = {}, missing = [];
        for (const sp of W.species) {
          const n = numByName[norm2(sp.name)];
          if (n != null) num[sp.id] = n;
          else missing.push(sp.name);
        }
        const N = (id) => num[id];
        const matched = Object.keys(num).length;
        if (matched < 300) throw new Error("only " + matched + " wiki species could be matched by name, so the species names are probably missing");
        const places = {};
        for (const x of W.wild) {
          const area = W.places[x.area];
          if (!area) continue;
          const g = area.group, p = places[g] ||= { level: 0, normal: /* @__PURE__ */ new Set(), special: /* @__PURE__ */ new Set() };
          if (N(x.species) != null) p.normal.add(N(x.species));
          if (x.method === "grass") {
            const lv = maxLevel(x.levels);
            if (Number.isFinite(lv)) p.level = Math.max(p.level, lv);
          }
        }
        const rareTiers = {}, anywhere = /* @__PURE__ */ new Set();
        for (const o of W.other) {
          const n = N(o.species);
          if (n == null) continue;
          if (/Rare grass patches/.test(o.where)) {
            const lv = /Lv\. (\d+)/.exec(o.where);
            (rareTiers[lv ? +lv[1] : 0] ||= /* @__PURE__ */ new Set()).add(n);
            continue;
          }
          if (/RiftPad/.test(o.where) || o.how === "Egg" || o.how === "Breed") continue;
          let placed = false;
          for (const g of Object.keys(places)) if (o.where.includes(g.replace(/ (City|Town)$/, ""))) {
            places[g].special.add(n);
            placed = true;
          }
          if (!placed) anywhere.add(n);
        }
        const evo = {};
        for (const e of W.evolutions) {
          const a = N(e.species), b = N(e.from);
          if (a != null && b != null) (evo[a] ||= []).push(b);
        }
        const out = {
          source: `platinumtogether.online wiki (${W.source}, v${W.version})`,
          wikiSource: String(W.source || ""),
          wikiVersion: String(W.version || ""),
          matched,
          built: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          places: Object.fromEntries(Object.entries(places).map(([g, p]) => [g, { level: p.level, normal: [...p.normal].sort((a, b) => a - b), special: [...p.special].sort((a, b) => a - b) }])),
          rare: Object.entries(rareTiers).map(([lv, set2]) => [+lv, [...set2].sort((a, b) => a - b)]).sort((a, b) => a[0] - b[0]),
          evo,
          anywhere: [...anywhere].sort((a, b) => a - b)
        };
        return { out, missing };
      }
      module.exports = { build: build2, looksLikeWiki: looksLikeWiki2 };
    }
  });

  // src/entry.js
  init_buffer_shim();

  // src/stats-api.js
  init_buffer_shim();
  var import_parser = __toESM(require_parser());

  // src/store.js
  init_buffer_shim();
  var NAME = "pt-journal";
  var dbp = null;
  function open() {
    if (!dbp) dbp = new Promise((ok, no) => {
      const r = indexedDB.open(NAME, 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        db.createObjectStore("kv");
        db.createObjectStore("logs");
      };
      r.onsuccess = () => ok(r.result);
      r.onerror = () => no(r.error);
    });
    return dbp;
  }
  var run = async (store, mode, fn) => {
    const db = await open();
    return new Promise((ok, no) => {
      const tx = db.transaction(store, mode), s = tx.objectStore(store), req = fn(s);
      tx.oncomplete = () => ok(req ? req.result : void 0);
      tx.onerror = () => no(tx.error);
      tx.onabort = () => no(tx.error);
    });
  };
  var get = async (store, key) => {
    try {
      return await run(store, "readonly", (s) => s.get(key));
    } catch {
      return void 0;
    }
  };
  var set = (store, key, value) => run(store, "readwrite", (s) => s.put(value, key)).catch(() => {
  });
  var all = async (store) => {
    try {
      const db = await open();
      return await new Promise((ok, no) => {
        const out = {}, tx = db.transaction(store, "readonly"), req = tx.objectStore(store).openCursor();
        req.onsuccess = () => {
          const c = req.result;
          if (c) {
            out[c.key] = c.value;
            c.continue();
          } else ok(out);
        };
        req.onerror = () => no(req.error);
      });
    } catch {
      return {};
    }
  };

  // src/stats-api.js
  init_fs_shim();

  // src/vfs.js
  init_buffer_shim();
  var import_buffer3 = __toESM(require_buffer());
  var isMissing = (e) => e && (e.name === "NotFoundError" || e.name === "TypeMismatchError");
  var HandleBackend = class {
    constructor(root) {
      this.root = root;
      this.name = root.name;
      this.kind = "handle";
    }
    async dir(parts) {
      let h = this.root;
      for (const p of parts) h = await h.getDirectoryHandle(p);
      return h;
    }
    async node(parts) {
      if (!parts.length) return { kind: "dir" };
      try {
        const d = await this.dir(parts.slice(0, -1)), n = parts[parts.length - 1];
        try {
          await d.getFileHandle(n);
          return { kind: "file" };
        } catch (e) {
          if (e && e.name === "TypeError") {
            const h = await this.find(d, n);
            if (h) return { kind: h.kind };
          } else if (!isMissing(e)) throw e;
        }
        try {
          await d.getDirectoryHandle(n);
          return { kind: "dir" };
        } catch (e) {
          if (!isMissing(e) && !(e && e.name === "TypeError")) throw e;
        }
        return null;
      } catch (e) {
        if (isMissing(e)) return null;
        throw e;
      }
    }
    // look a name up by listing the folder, which works even for names the browser will not hand out by name
    async find(d, name3) {
      for await (const h of d.values()) if (h.name === name3) return h;
      return null;
    }
    async file(parts) {
      try {
        const d = await this.dir(parts.slice(0, -1)), n = parts[parts.length - 1];
        let fh;
        try {
          fh = await d.getFileHandle(n);
        } catch (e) {
          if (e && e.name === "TypeError") fh = await this.find(d, n);
          else throw e;
        }
        return fh && fh.kind === "file" ? await fh.getFile() : null;
      } catch (e) {
        if (isMissing(e)) return null;
        throw e;
      }
    }
    async list(parts) {
      try {
        const d = await this.dir(parts), names = [];
        for await (const [name3] of d.entries()) names.push(name3);
        return names;
      } catch (e) {
        if (isMissing(e)) return null;
        throw e;
      }
    }
  };
  var FileListBackend = class {
    // files: [{ path: 'a/b.txt' (without the top folder), file: File-like }]
    constructor(files, name3) {
      this.name = name3 || "folder";
      this.kind = "files";
      this.files = /* @__PURE__ */ new Map();
      this.dirs = /* @__PURE__ */ new Map([["", /* @__PURE__ */ new Set()]]);
      for (const { path, file } of files) {
        this.files.set(path, file);
        const parts = path.split("/");
        for (let i = 0; i < parts.length; i++) {
          const parent = parts.slice(0, i).join("/"), child = parts[i];
          (this.dirs.get(parent) || this.dirs.set(parent, /* @__PURE__ */ new Set()).get(parent)).add(child);
          if (i < parts.length - 1 && !this.dirs.has(parts.slice(0, i + 1).join("/"))) this.dirs.set(parts.slice(0, i + 1).join("/"), /* @__PURE__ */ new Set());
        }
      }
    }
    async node(parts) {
      const k = parts.join("/");
      return this.files.has(k) ? { kind: "file" } : this.dirs.has(k) ? { kind: "dir" } : null;
    }
    async file(parts) {
      return this.files.get(parts.join("/")) || null;
    }
    async list(parts) {
      const s = this.dirs.get(parts.join("/"));
      return s ? [...s] : null;
    }
  };
  var norm = (p) => "/" + String(p).split("/").filter(Boolean).join("/");
  var stat = (f) => ({ mtimeMs: f.lastModified, size: f.size, isFile: () => true });
  var Vfs = class {
    constructor(backend2, rootName = "game") {
      this.b = backend2;
      this.rootName = rootName;
      this.c = /* @__PURE__ */ new Map();
      this.miss = /* @__PURE__ */ new Map();
      this.mounted = /* @__PURE__ */ new Set();
      this.errors = [];
    }
    // what the parser asks
    exists(p) {
      const k = norm(p), e = this.c.get(k);
      if (e) return e.kind !== "none";
      this.miss.set(k, this.miss.get(k) || "exists");
      return false;
    }
    // The answers: the thing itself, null (it is not there), or undefined (not loaded yet: the question is noted for the next round)
    read(p) {
      const k = norm(p), e = this.c.get(k);
      if (e && e.data) return e.data;
      if (e && e.kind === "none") return null;
      this.miss.set(k, "read");
      return void 0;
    }
    stat(p) {
      const k = norm(p), e = this.c.get(k);
      if (e && e.stat) return e.stat;
      if (e && e.kind === "none") return null;
      this.miss.set(k, this.miss.get(k) === "read" ? "read" : "stat");
      return void 0;
    }
    list(p) {
      const k = norm(p), e = this.c.get(k);
      if (e && e.list) return e.list;
      if (e && e.kind === "none") return null;
      this.miss.set(k, "list");
      return void 0;
    }
    beginPass() {
      this.miss.clear();
    }
    hasMisses() {
      return this.miss.size > 0;
    }
    // parts of a path below the game folder ('/game/logs/x' -> ['logs', 'x'])
    parts(k) {
      const a = k.split("/").filter(Boolean);
      return a.slice(1);
    }
    // one attempt, then a second if the browser says the file changed or is busy (the game writes its logs while we read them)
    async resolve(k, kind) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await this.resolveOnce(k, kind);
        } catch (e) {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 150));
            continue;
          }
          this.errors.push(k + ": " + (e && e.name || "error") + (e && e.message ? " (" + String(e.message).slice(0, 90) + ")" : ""));
          this.c.set(k, { kind: "none" });
        }
      }
    }
    async resolveOnce(k, kind) {
      if (this.mounted.has(k) || k.startsWith("/__archive")) return;
      const parts = this.parts(k), old = this.c.get(k) || {};
      if (kind === "list") {
        const names = await this.b.list(parts);
        this.c.set(k, names ? { ...old, kind: "dir", list: names } : { kind: "none" });
      } else if (kind === "exists") {
        const n = await this.b.node(parts);
        this.c.set(k, n ? { ...old, kind: n.kind } : { kind: "none" });
      } else {
        const f = await this.b.file(parts);
        if (!f) {
          this.c.set(k, old.kind === "dir" ? old : { kind: "none" });
          return;
        }
        const e = { ...old, kind: "file", stat: stat(f) };
        if (kind === "read") e.data = import_buffer3.Buffer.from(await f.arrayBuffer());
        this.c.set(k, e);
      }
    }
    // fetch everything the last pass asked for (a few at a time)
    async settle() {
      const todo = [...this.miss.entries()];
      this.miss.clear();
      let i = 0;
      const worker = async () => {
        while (i < todo.length) {
          const [k, kind] = todo[i++];
          await this.resolve(k, kind);
        }
      };
      await Promise.all(Array.from({ length: Math.min(12, todo.length) }, worker));
    }
    // before each refresh: forget what changed in the folder, keep what did not (so only new or grown files are read again)
    async revalidate() {
      const entries = [...this.c.entries()].filter(([k]) => !this.mounted.has(k));
      let i = 0;
      const worker = async () => {
        while (i < entries.length) {
          const [k, e] = entries[i++], parts = this.parts(k);
          if (e.kind === "file") {
            const f = await this.b.file(parts);
            if (!f) this.c.set(k, { kind: "none" });
            else if (!e.stat || f.lastModified !== e.stat.mtimeMs || f.size !== e.stat.size) this.c.delete(k);
          } else if (e.kind === "dir") {
            const names = await this.b.list(parts);
            this.c.set(k, names ? { ...e, list: names } : { kind: "none" });
          } else this.c.delete(k);
        }
      };
      await Promise.all(Array.from({ length: Math.min(12, entries.length) }, worker));
    }
    // files that are not in the game folder but should look like they are (the optional log archive)
    mount(dirPath, files) {
      const d = norm(dirPath);
      for (const k of [...this.c.keys()]) if (k === d || k.startsWith(d + "/")) this.c.delete(k);
      this.mounted.add(d);
      if (!files) {
        this.c.set(d, { kind: "none" });
        return;
      }
      this.c.set(d, { kind: "dir", list: Object.keys(files) });
      for (const [name3, f] of Object.entries(files)) {
        const k = d + "/" + name3;
        this.mounted.add(k);
        this.c.set(k, { kind: "file", stat: { mtimeMs: f.mtimeMs, size: f.size, isFile: () => true }, data: import_buffer3.Buffer.from(f.data) });
      }
    }
    // loaded files below a folder (used to keep a copy of the logs)
    loadedFiles(dirPath) {
      const d = norm(dirPath) + "/", out = [];
      for (const [k, e] of this.c) if (k.startsWith(d) && e.data && !this.mounted.has(k)) out.push([k.slice(d.length), e]);
      return out;
    }
    async readBlob(parts) {
      const f = await this.b.file(parts);
      return f || null;
    }
  };

  // src/wiki.js
  init_buffer_shim();
  var import_spawns_build = __toESM(require_spawns_build());
  var URL_ = "https://platinumtogether.online/wiki/data/wiki.json";
  var EVERY = 6 * 36e5;
  var RETRY = 36e5;
  var MAX_BYTES = 25 * 1024 * 1024;
  var TIMEOUT = 45e3;
  var valid = (t) => t && t.places && typeof t.places === "object" && Object.keys(t.places).length > 20 && Array.isArray(t.rare) && t.evo && t.matched >= 300;
  async function createWiki({ shipped, getNames, getOn, getSig, onUpdated }) {
    let state = await get("kv", "wikiState") || {}, mine = await get("kv", "wikiTables"), busy = false;
    if (!valid(mine)) mine = null;
    const save = () => set("kv", "wikiState", state);
    const tables = () => mine ? { t: mine, shipped: false } : { t: shipped, shipped: true };
    const status = () => {
      const { t, shipped: isShipped } = tables();
      return { on: getOn(), shipped: isShipped, version: t ? t.wikiVersion || "" : "", source: t ? t.wikiSource || "" : "", built: t ? t.built || "" : "", checkedAt: state.checkedAt || 0, result: state.result || "", error: state.error || "", busy };
    };
    async function run2(opts) {
      if (busy) return;
      busy = true;
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), TIMEOUT);
      try {
        const res = await fetch(URL_, { signal: ctl.signal, credentials: "omit", cache: "no-store" });
        if (!res.ok) throw new Error(`the wiki answered ${res.status}`);
        const len = +res.headers.get("content-length") || 0;
        if (len > MAX_BYTES) throw new Error("the file is larger than expected");
        const text = await res.text();
        if (text.length > MAX_BYTES) throw new Error("the file is larger than expected");
        const W = JSON.parse(text);
        if (!(0, import_spawns_build.looksLikeWiki)(W)) throw new Error("the file does not look like the wiki data");
        const cur = tables();
        if (!opts.force && !cur.shipped && cur.t.wikiSource === String(W.source || "") && cur.t.wikiVersion === String(W.version || "")) {
          state.checkedAt = Date.now();
          state.result = "Up to date";
          state.error = "";
          return;
        }
        const { out, missing } = (0, import_spawns_build.build)(W, getNames());
        const places = Object.keys(out.places).length, before = cur.t ? Object.keys(cur.t.places).length : 0;
        if (places < 20 || before && places < before * 0.8) throw new Error("the new tables look incomplete, so they were not used");
        mine = out;
        await set("kv", "wikiTables", out);
        state.checkedAt = Date.now();
        state.error = "";
        state.result = `Updated to v${out.wikiVersion}${missing.length ? ` (${missing.length} species not matched by name)` : ""}`;
        try {
          onUpdated(out);
        } catch {
        }
      } catch (e) {
        state.lastTry = Date.now();
        state.error = e && e.name === "AbortError" ? "The wiki did not answer in time" : String(e && e.message || e).slice(0, 160);
        state.result = "Could not update, using the last good data";
      } finally {
        clearTimeout(timer);
        busy = false;
        save();
      }
    }
    async function check(opts = {}) {
      await run2(opts);
      return status();
    }
    function tick() {
      if (!getOn() || busy) return;
      const sig = getSig(), changed = sig && state.gameSig && sig !== state.gameSig;
      if (sig && sig !== state.gameSig) {
        state.gameSig = sig;
        save();
      }
      const now = Date.now(), due = !state.checkedAt || now - state.checkedAt > EVERY;
      const retryOk = !state.lastTry || now - state.lastTry > RETRY || (state.checkedAt || 0) > state.lastTry;
      if (changed || due && retryOk) run2({ force: !!changed });
    }
    return { tables, status, check, tick };
  }

  // src/card.js
  init_buffer_shim();
  function cardFromSave(data, world) {
    const tr = (data.trainer || {})[world];
    if (!tr || !tr.name) return null;
    return { trainer: tr.name, badges: tr.badges || 0, playTime: `${tr.hours}:${String(tr.minutes).padStart(2, "0")}`, place: "", party: [], fromSave: true };
  }

  // shared/species.json
  var species_default = { "1": "Bulbasaur", "2": "Ivysaur", "3": "Venusaur", "4": "Charmander", "5": "Charmeleon", "6": "Charizard", "7": "Squirtle", "8": "Wartortle", "9": "Blastoise", "10": "Caterpie", "11": "Metapod", "12": "Butterfree", "13": "Weedle", "14": "Kakuna", "15": "Beedrill", "16": "Pidgey", "17": "Pidgeotto", "18": "Pidgeot", "19": "Rattata", "20": "Raticate", "21": "Spearow", "22": "Fearow", "23": "Ekans", "24": "Arbok", "25": "Pikachu", "26": "Raichu", "27": "Sandshrew", "28": "Sandslash", "29": "Nidoran\u2640", "30": "Nidorina", "31": "Nidoqueen", "32": "Nidoran\u2642", "33": "Nidorino", "34": "Nidoking", "35": "Clefairy", "36": "Clefable", "37": "Vulpix", "38": "Ninetales", "39": "Jigglypuff", "40": "Wigglytuff", "41": "Zubat", "42": "Golbat", "43": "Oddish", "44": "Gloom", "45": "Vileplume", "46": "Paras", "47": "Parasect", "48": "Venonat", "49": "Venomoth", "50": "Diglett", "51": "Dugtrio", "52": "Meowth", "53": "Persian", "54": "Psyduck", "55": "Golduck", "56": "Mankey", "57": "Primeape", "58": "Growlithe", "59": "Arcanine", "60": "Poliwag", "61": "Poliwhirl", "62": "Poliwrath", "63": "Abra", "64": "Kadabra", "65": "Alakazam", "66": "Machop", "67": "Machoke", "68": "Machamp", "69": "Bellsprout", "70": "Weepinbell", "71": "Victreebel", "72": "Tentacool", "73": "Tentacruel", "74": "Geodude", "75": "Graveler", "76": "Golem", "77": "Ponyta", "78": "Rapidash", "79": "Slowpoke", "80": "Slowbro", "81": "Magnemite", "82": "Magneton", "83": "Farfetch'd", "84": "Doduo", "85": "Dodrio", "86": "Seel", "87": "Dewgong", "88": "Grimer", "89": "Muk", "90": "Shellder", "91": "Cloyster", "92": "Gastly", "93": "Haunter", "94": "Gengar", "95": "Onix", "96": "Drowzee", "97": "Hypno", "98": "Krabby", "99": "Kingler", "100": "Voltorb", "101": "Electrode", "102": "Exeggcute", "103": "Exeggutor", "104": "Cubone", "105": "Marowak", "106": "Hitmonlee", "107": "Hitmonchan", "108": "Lickitung", "109": "Koffing", "110": "Weezing", "111": "Rhyhorn", "112": "Rhydon", "113": "Chansey", "114": "Tangela", "115": "Kangaskhan", "116": "Horsea", "117": "Seadra", "118": "Goldeen", "119": "Seaking", "120": "Staryu", "121": "Starmie", "122": "Mr. Mime", "123": "Scyther", "124": "Jynx", "125": "Electabuzz", "126": "Magmar", "127": "Pinsir", "128": "Tauros", "129": "Magikarp", "130": "Gyarados", "131": "Lapras", "132": "Ditto", "133": "Eevee", "134": "Vaporeon", "135": "Jolteon", "136": "Flareon", "137": "Porygon", "138": "Omanyte", "139": "Omastar", "140": "Kabuto", "141": "Kabutops", "142": "Aerodactyl", "143": "Snorlax", "144": "Articuno", "145": "Zapdos", "146": "Moltres", "147": "Dratini", "148": "Dragonair", "149": "Dragonite", "150": "Mewtwo", "151": "Mew", "152": "Chikorita", "153": "Bayleef", "154": "Meganium", "155": "Cyndaquil", "156": "Quilava", "157": "Typhlosion", "158": "Totodile", "159": "Croconaw", "160": "Feraligatr", "161": "Sentret", "162": "Furret", "163": "Hoothoot", "164": "Noctowl", "165": "Ledyba", "166": "Ledian", "167": "Spinarak", "168": "Ariados", "169": "Crobat", "170": "Chinchou", "171": "Lanturn", "172": "Pichu", "173": "Cleffa", "174": "Igglybuff", "175": "Togepi", "176": "Togetic", "177": "Natu", "178": "Xatu", "179": "Mareep", "180": "Flaaffy", "181": "Ampharos", "182": "Bellossom", "183": "Marill", "184": "Azumarill", "185": "Sudowoodo", "186": "Politoed", "187": "Hoppip", "188": "Skiploom", "189": "Jumpluff", "190": "Aipom", "191": "Sunkern", "192": "Sunflora", "193": "Yanma", "194": "Wooper", "195": "Quagsire", "196": "Espeon", "197": "Umbreon", "198": "Murkrow", "199": "Slowking", "200": "Misdreavus", "201": "Unown", "202": "Wobbuffet", "203": "Girafarig", "204": "Pineco", "205": "Forretress", "206": "Dunsparce", "207": "Gligar", "208": "Steelix", "209": "Snubbull", "210": "Granbull", "211": "Qwilfish", "212": "Scizor", "213": "Shuckle", "214": "Heracross", "215": "Sneasel", "216": "Teddiursa", "217": "Ursaring", "218": "Slugma", "219": "Magcargo", "220": "Swinub", "221": "Piloswine", "222": "Corsola", "223": "Remoraid", "224": "Octillery", "225": "Delibird", "226": "Mantine", "227": "Skarmory", "228": "Houndour", "229": "Houndoom", "230": "Kingdra", "231": "Phanpy", "232": "Donphan", "233": "Porygon2", "234": "Stantler", "235": "Smeargle", "236": "Tyrogue", "237": "Hitmontop", "238": "Smoochum", "239": "Elekid", "240": "Magby", "241": "Miltank", "242": "Blissey", "243": "Raikou", "244": "Entei", "245": "Suicune", "246": "Larvitar", "247": "Pupitar", "248": "Tyranitar", "249": "Lugia", "250": "Ho-Oh", "251": "Celebi", "252": "Treecko", "253": "Grovyle", "254": "Sceptile", "255": "Torchic", "256": "Combusken", "257": "Blaziken", "258": "Mudkip", "259": "Marshtomp", "260": "Swampert", "261": "Poochyena", "262": "Mightyena", "263": "Zigzagoon", "264": "Linoone", "265": "Wurmple", "266": "Silcoon", "267": "Beautifly", "268": "Cascoon", "269": "Dustox", "270": "Lotad", "271": "Lombre", "272": "Ludicolo", "273": "Seedot", "274": "Nuzleaf", "275": "Shiftry", "276": "Taillow", "277": "Swellow", "278": "Wingull", "279": "Pelipper", "280": "Ralts", "281": "Kirlia", "282": "Gardevoir", "283": "Surskit", "284": "Masquerain", "285": "Shroomish", "286": "Breloom", "287": "Slakoth", "288": "Vigoroth", "289": "Slaking", "290": "Nincada", "291": "Ninjask", "292": "Shedinja", "293": "Whismur", "294": "Loudred", "295": "Exploud", "296": "Makuhita", "297": "Hariyama", "298": "Azurill", "299": "Nosepass", "300": "Skitty", "301": "Delcatty", "302": "Sableye", "303": "Mawile", "304": "Aron", "305": "Lairon", "306": "Aggron", "307": "Meditite", "308": "Medicham", "309": "Electrike", "310": "Manectric", "311": "Plusle", "312": "Minun", "313": "Volbeat", "314": "Illumise", "315": "Roselia", "316": "Gulpin", "317": "Swalot", "318": "Carvanha", "319": "Sharpedo", "320": "Wailmer", "321": "Wailord", "322": "Numel", "323": "Camerupt", "324": "Torkoal", "325": "Spoink", "326": "Grumpig", "327": "Spinda", "328": "Trapinch", "329": "Vibrava", "330": "Flygon", "331": "Cacnea", "332": "Cacturne", "333": "Swablu", "334": "Altaria", "335": "Zangoose", "336": "Seviper", "337": "Lunatone", "338": "Solrock", "339": "Barboach", "340": "Whiscash", "341": "Corphish", "342": "Crawdaunt", "343": "Baltoy", "344": "Claydol", "345": "Lileep", "346": "Cradily", "347": "Anorith", "348": "Armaldo", "349": "Feebas", "350": "Milotic", "351": "Castform", "352": "Kecleon", "353": "Shuppet", "354": "Banette", "355": "Duskull", "356": "Dusclops", "357": "Tropius", "358": "Chimecho", "359": "Absol", "360": "Wynaut", "361": "Snorunt", "362": "Glalie", "363": "Spheal", "364": "Sealeo", "365": "Walrein", "366": "Clamperl", "367": "Huntail", "368": "Gorebyss", "369": "Relicanth", "370": "Luvdisc", "371": "Bagon", "372": "Shelgon", "373": "Salamence", "374": "Beldum", "375": "Metang", "376": "Metagross", "377": "Regirock", "378": "Regice", "379": "Registeel", "380": "Latias", "381": "Latios", "382": "Kyogre", "383": "Groudon", "384": "Rayquaza", "385": "Jirachi", "386": "Deoxys", "387": "Turtwig", "388": "Grotle", "389": "Torterra", "390": "Chimchar", "391": "Monferno", "392": "Infernape", "393": "Piplup", "394": "Prinplup", "395": "Empoleon", "396": "Starly", "397": "Staravia", "398": "Staraptor", "399": "Bidoof", "400": "Bibarel", "401": "Kricketot", "402": "Kricketune", "403": "Shinx", "404": "Luxio", "405": "Luxray", "406": "Budew", "407": "Roserade", "408": "Cranidos", "409": "Rampardos", "410": "Shieldon", "411": "Bastiodon", "412": "Burmy", "413": "Wormadam", "414": "Mothim", "415": "Combee", "416": "Vespiquen", "417": "Pachirisu", "418": "Buizel", "419": "Floatzel", "420": "Cherubi", "421": "Cherrim", "422": "Shellos", "423": "Gastrodon", "424": "Ambipom", "425": "Drifloon", "426": "Drifblim", "427": "Buneary", "428": "Lopunny", "429": "Mismagius", "430": "Honchkrow", "431": "Glameow", "432": "Purugly", "433": "Chingling", "434": "Stunky", "435": "Skuntank", "436": "Bronzor", "437": "Bronzong", "438": "Bonsly", "439": "Mime Jr.", "440": "Happiny", "441": "Chatot", "442": "Spiritomb", "443": "Gible", "444": "Gabite", "445": "Garchomp", "446": "Munchlax", "447": "Riolu", "448": "Lucario", "449": "Hippopotas", "450": "Hippowdon", "451": "Skorupi", "452": "Drapion", "453": "Croagunk", "454": "Toxicroak", "455": "Carnivine", "456": "Finneon", "457": "Lumineon", "458": "Mantyke", "459": "Snover", "460": "Abomasnow", "461": "Weavile", "462": "Magnezone", "463": "Lickilicky", "464": "Rhyperior", "465": "Tangrowth", "466": "Electivire", "467": "Magmortar", "468": "Togekiss", "469": "Yanmega", "470": "Leafeon", "471": "Glaceon", "472": "Gliscor", "473": "Mamoswine", "474": "Porygon-Z", "475": "Gallade", "476": "Probopass", "477": "Dusknoir", "478": "Froslass", "479": "Rotom", "480": "Uxie", "481": "Mesprit", "482": "Azelf", "483": "Dialga", "484": "Palkia", "485": "Heatran", "486": "Regigigas", "487": "Giratina", "488": "Cresselia", "489": "Phione", "490": "Manaphy", "491": "Darkrai", "492": "Shaymin", "493": "Arceus" };

  // shared/species-extra.json
  var species_extra_default = {
    "512": "Victini",
    "513": "Snivy",
    "514": "Servine",
    "515": "Serperior",
    "516": "Oshawott",
    "517": "Dewott",
    "518": "Samurott",
    "519": "Cottonee",
    "520": "Whimsicott",
    "521": "Sandile",
    "522": "Krokorok",
    "523": "Krookodile",
    "524": "Zorua",
    "525": "Zoroark",
    "526": "Litwick",
    "527": "Lampent",
    "528": "Chandelure",
    "529": "Axew",
    "530": "Fraxure",
    "531": "Haxorus",
    "532": "Deino",
    "533": "Zweilous",
    "534": "Hydreigon",
    "535": "Larvesta",
    "536": "Volcarona",
    "537": "Reshiram",
    "538": "Zekrom",
    "539": "Froakie",
    "540": "Frogadier",
    "541": "Greninja",
    "542": "Fletchling",
    "543": "Fletchinder",
    "544": "Talonflame",
    "545": "Honedge",
    "546": "Doublade",
    "547": "Aegislash",
    "548": "Swirlix",
    "549": "Slurpuff",
    "550": "Tyrunt",
    "551": "Tyrantrum",
    "552": "Sylveon",
    "553": "Hawlucha",
    "554": "Goomy",
    "555": "Sliggoo",
    "556": "Goodra",
    "557": "Noibat",
    "558": "Noivern",
    "559": "Xerneas",
    "560": "Yveltal",
    "561": "Wishiwashi",
    "562": "Mimikyu",
    "563": "Rookidee",
    "564": "Corvisquire",
    "565": "Corviknight",
    "566": "Hatenna",
    "567": "Hattrem",
    "568": "Hatterene",
    "569": "Kubfu",
    "570": "Urshifu",
    "571": "Sprigatito",
    "572": "Floragato",
    "573": "Meowscarada",
    "574": "Tinkatink",
    "575": "Tinkatuff",
    "576": "Tinkaton",
    "577": "Chespin",
    "578": "Quilladin",
    "579": "Chesnaught",
    "580": "Fennekin",
    "581": "Braixen",
    "582": "Delphox",
    "583": "Audino",
    "584": "Tepig",
    "585": "Pignite",
    "586": "Emboar",
    "587": "Drilbur",
    "588": "Excadrill",
    "589": "Venipede",
    "590": "Whirlipede",
    "591": "Scolipede",
    "592": "Scraggy",
    "593": "Scrafty",
    "594": "Tynamo",
    "595": "Eelektrik",
    "596": "Eelektross",
    "597": "Golett",
    "598": "Golurk",
    "599": "Litleo",
    "600": "Pyroar",
    "601": "Flab\xE9b\xE9",
    "602": "Floette",
    "603": "Florges",
    "604": "Espurr",
    "605": "Meowstic",
    "606": "Inkay",
    "607": "Malamar",
    "608": "Binacle",
    "609": "Barbaracle",
    "610": "Skrelp",
    "611": "Dragalge",
    "612": "Zygarde",
    "613": "Diancie",
    "614": "Crabrawler",
    "615": "Crabominable",
    "616": "Wimpod",
    "617": "Golisopod",
    "618": "Drampa",
    "619": "Magearna",
    "620": "Zeraora",
    "621": "Falinks",
    "622": "Capsakid",
    "623": "Scovillain",
    "624": "Glimmet",
    "625": "Glimmora",
    "626": "Tatsugiri",
    "627": "Dondozo",
    "628": "Frigibax",
    "629": "Arctibax",
    "630": "Baxcalibur",
    "730": "Zygarde (Complete)",
    "731": "Deoxys (Speed)",
    "732": "Deoxys (Attack)",
    "733": "Deoxys (Defense)",
    "734": "Unown A",
    "735": "Unown B",
    "736": "Unown C",
    "737": "Unown D",
    "738": "Unown E",
    "739": "Unown F",
    "740": "Unown G",
    "741": "Unown H",
    "742": "Unown I",
    "743": "Unown J",
    "744": "Unown K",
    "745": "Unown L",
    "746": "Unown M",
    "747": "Unown N",
    "748": "Unown O",
    "749": "Unown P",
    "750": "Unown Q",
    "751": "Unown R",
    "752": "Unown S",
    "753": "Unown T",
    "754": "Unown U",
    "755": "Unown V",
    "756": "Unown W",
    "757": "Unown X",
    "758": "Unown Y",
    "759": "Unown Z",
    "760": "Unown !",
    "761": "Unown ?",
    "762": "Burmy (Sandy)",
    "763": "Burmy (Trash)",
    "764": "Wormadam (Sandy)",
    "765": "Wormadam (Trash)",
    "766": "Shellos",
    "767": "Gastrodon",
    "768": "Giratina (Origin)",
    "769": "Shaymin (Sky)",
    "770": "Rotom (Heat)",
    "771": "Rotom (Wash)",
    "772": "Rotom (Frost)",
    "773": "Rotom (Fan)",
    "774": "Rotom (Mow)"
  };

  // shared/data/wiki-spawns.json
  var wiki_spawns_default = { source: "platinumtogether.online wiki (wt-relay-20261028 @ 8f7b70500, v0.3.4)", wikiSource: "wt-relay-20261028 @ 8f7b70500", wikiVersion: "0.3.4", matched: 611, built: "2026-11-11", places: { "Acuity Lakefront": { level: 35, normal: [215, 220, 361, 459], special: [] }, "Canalave City": { level: 0, normal: [72, 73, 98, 120, 129, 130, 211, 456, 457, 766, 767], special: [491] }, "Celestic Town": { level: 0, normal: [54, 55, 118, 119, 129, 130, 341, 342], special: [] }, "Eterna City": { level: 0, normal: [54, 55, 60, 129, 130, 339, 340, 341], special: [287, 441, 479] }, "Eterna Forest": { level: 14, normal: [43, 92, 163, 198, 200, 204, 265, 266, 267, 268, 269, 290, 399, 401, 406, 427, 562, 589], special: [287] }, "Fuego Ironworks": { level: 31, normal: [72, 73, 81, 90, 98, 100, 126, 129, 130, 218, 304, 419, 456, 457, 594, 766, 767], special: [] }, "Great Marsh": { level: 31, normal: [114, 129, 130, 163, 164, 193, 194, 195, 318, 339, 340, 357, 400, 554], special: [46, 102, 114, 115, 193, 194, 195, 285, 316, 352, 357, 451, 452, 453, 454, 455] }, "Iron Island": { level: 0, normal: [41, 42, 72, 73, 74, 75, 95, 129, 130, 208, 211, 222, 278, 279, 302, 303, 320, 447, 456, 457, 458, 557, 624], special: [] }, "Lake Acuity": { level: 41, normal: [54, 55, 118, 119, 129, 130, 131, 215, 361, 400, 459, 567], special: [480] }, "Lake Valor": { level: 41, normal: [54, 55, 118, 119, 129, 130, 202, 397, 400, 567], special: [482] }, "Lake Verity": { level: 4, normal: [54, 55, 118, 119, 129, 130, 202, 396, 399, 566], special: [481] }, "Maniac Tunnel": { level: 26, normal: [74, 449], special: [] }, "Mt. Coronet": { level: 40, normal: [35, 41, 42, 66, 67, 74, 75, 129, 130, 147, 148, 164, 173, 206, 294, 299, 307, 308, 339, 340, 349, 358, 359, 433, 436, 437, 459, 460, 529, 545, 557, 575, 597, 598, 615, 628], special: [349, 483, 484, 538] }, "Old Chateau": { level: 0, normal: [92, 545], special: [479] }, "Oreburgh Gate": { level: 0, normal: [27, 41, 42, 54, 55, 74, 129, 130, 339, 340, 557], special: [] }, "Oreburgh Mine": { level: 0, normal: [41, 50, 74, 95, 304, 557, 574, 587], special: [] }, "Pastoria City": { level: 0, normal: [72, 73, 120, 129, 130, 223, 224, 278, 766, 767], special: [46, 102, 114, 115, 193, 194, 195, 285, 316, 352, 357, 451, 452, 453, 454, 455] }, "Pok\xE9mon League": { level: 0, normal: [73, 129, 130, 223, 224, 278, 279, 370], special: [] }, "Ravaged Path": { level: 0, normal: [41, 42, 54, 55, 129, 130, 339, 340, 557], special: [] }, "Resort Area": { level: 0, normal: [54, 55, 129], special: [] }, "Route 201": { level: 3, normal: [16, 32, 161, 396, 399, 401, 542], special: [1, 4, 7, 25, 35, 84, 133, 152, 155, 158, 252, 255, 258, 387, 390, 393] }, "Route 202": { level: 4, normal: [19, 161, 263, 396, 399, 401, 403, 563], special: [263] }, "Route 203": { level: 7, normal: [32, 41, 54, 55, 63, 118, 119, 129, 130, 396, 399, 401, 403, 542], special: [104] }, "Route 204": { level: 11, normal: [10, 13, 41, 43, 54, 55, 118, 119, 129, 130, 187, 191, 265, 273, 396, 399, 401, 403, 406, 519, 542, 563], special: [] }, "Route 205": { level: 15, normal: [43, 48, 54, 55, 69, 72, 73, 79, 90, 129, 130, 163, 187, 216, 265, 266, 267, 268, 269, 287, 290, 339, 340, 399, 401, 406, 417, 418, 456, 457, 519, 542, 766, 767], special: [] }, "Route 206": { level: 19, normal: [23, 41, 66, 74, 77, 207, 246, 261, 343, 402, 521, 563], special: [246] }, "Route 207": { level: 8, normal: [21, 41, 56, 66, 74, 77, 231, 234, 246, 401, 542], special: [231] }, "Route 208": { level: 20, normal: [41, 43, 54, 55, 118, 119, 129, 130, 235, 280, 315, 399, 400, 406, 564, 583, 604], special: [206] }, "Route 209": { level: 20, normal: [37, 41, 43, 54, 55, 113, 118, 119, 129, 130, 209, 280, 281, 315, 355, 397, 400, 543, 562, 599], special: [209, 442] }, "Lost Tower": { level: 0, normal: [41, 42, 92, 200, 355, 526], special: [] }, "Route 210": { level: 30, normal: [54, 55, 66, 67, 74, 77, 113, 123, 128, 129, 130, 163, 164, 198, 227, 241, 307, 315, 333, 339, 340, 371, 397, 400, 524, 543, 564, 599, 605, 618], special: [] }, "Route 211": { level: 30, normal: [41, 66, 67, 75, 163, 164, 177, 236, 296, 307, 327, 399, 433, 436, 563, 605, 618], special: [] }, "Route 212": { level: 26, normal: [43, 54, 55, 60, 72, 73, 88, 116, 118, 119, 129, 130, 183, 195, 223, 224, 235, 271, 280, 281, 283, 300, 315, 397, 418, 453, 543, 554, 561, 583, 590, 766, 767], special: [35, 39, 52, 113, 132, 133, 173, 174, 183, 298, 311, 312, 351, 438, 439, 440] }, "Route 213": { level: 26, normal: [72, 73, 120, 129, 130, 223, 224, 277, 278, 418, 441, 606, 608, 610, 616, 766, 767], special: [] }, "Route 214": { level: 24, normal: [41, 54, 55, 58, 74, 75, 109, 111, 118, 119, 129, 130, 131, 228, 261, 322, 331, 564, 592], special: [325] }, "Route 215": { level: 22, normal: [63, 64, 96, 108, 123, 183, 325, 397, 447, 543], special: [96] }, "Route 216": { level: 35, normal: [41, 75, 215, 225, 238, 307, 361, 459, 614], special: [] }, "Route 217": { level: 35, normal: [215, 220, 221, 361, 459, 614, 628], special: [225] }, "Route 218": { level: 31, normal: [72, 73, 120, 122, 129, 130, 419, 431, 441, 456, 457, 458, 562, 604, 766, 767], special: [100] }, "Route 219": { level: 0, normal: [72, 73, 120, 129, 130, 278, 279, 456, 457], special: [] }, "Route 220": { level: 0, normal: [72, 73, 120, 129, 130, 170, 278, 279, 456, 457, 561, 608, 626], special: [] }, "Route 221": { level: 31, normal: [30, 33, 72, 73, 120, 129, 130, 185, 203, 278, 279, 315, 370, 419, 456, 457, 564, 583, 590, 626], special: [83] }, "Route 222": { level: 41, normal: [72, 73, 81, 82, 125, 129, 130, 180, 223, 224, 278, 279, 404, 419, 431, 441, 561, 595, 606, 607, 610, 616], special: [300] }, "Route 223": { level: 0, normal: [73, 129, 130, 223, 224, 279, 320, 321, 458, 561, 609, 611, 626, 627], special: [] }, "Route 224": { level: 52, normal: [43, 44, 69, 70, 73, 129, 130, 213, 223, 224, 267, 269, 279, 315, 370, 419, 561, 617, 767], special: [177] }, "Route 225": { level: 50, normal: [19, 20, 21, 22, 54, 55, 56, 57, 67, 75, 129, 130, 339, 340, 354, 371, 553, 565, 593, 621], special: [296] }, "Route 226": { level: 50, normal: [19, 20, 22, 56, 57, 67, 73, 75, 116, 117, 129, 130, 278, 279, 354, 369, 553, 565, 593, 621], special: [98, 129] }, "Route 227": { level: 54, normal: [22, 42, 60, 61, 75, 110, 111, 112, 129, 130, 227, 322, 323, 324, 339, 340, 600], special: [327] }, "Route 228": { level: 52, normal: [50, 51, 60, 61, 112, 129, 130, 328, 329, 331, 332, 339, 340, 374, 450, 522, 523, 622, 623], special: [374] }, "Route 229": { level: 50, normal: [16, 48, 49, 118, 119, 129, 130, 166, 168, 267, 269, 283, 284, 313, 314, 315, 520, 591, 603], special: [127] }, "Route 230": { level: 50, normal: [43, 44, 69, 70, 73, 129, 130, 175, 223, 224, 278, 279, 315, 320, 321, 364, 419, 561, 596, 611, 627], special: [222] }, "Ruin Maniac Cave": { level: 0, normal: [74, 449], special: [] }, "Sendoff Spring": { level: 40, normal: [42, 55, 75, 118, 119, 129, 130, 356, 397, 400, 433], special: [] }, "Snowpoint Temple": { level: 0, normal: [42, 124, 215, 238, 547, 629, 630], special: [486] }, "Solaceon Ruins": { level: 0, normal: [761], special: [] }, "Stark Mountain": { level: 54, normal: [22, 42, 75, 109, 110, 111, 112, 218, 219, 227, 322, 323, 324, 533, 535, 544, 558, 625], special: [485, 537] }, "Sunyshore City": { level: 0, normal: [72, 73, 120, 129, 130, 223, 224, 278, 279], special: [512] }, "Trophy Garden": { level: 24, normal: [25, 172, 315, 397, 402, 602], special: [35, 39, 52, 113, 132, 133, 173, 174, 183, 298, 311, 312, 351, 438, 439, 440] }, "Turnback Cave": { level: 0, normal: [42, 92, 93, 355, 356, 358, 433, 436, 437, 527, 532], special: [487, 560] }, "Twinleaf Town": { level: 0, normal: [54, 55, 118, 119, 129, 130], special: [] }, "Valley Windworks": { level: 12, normal: [72, 73, 90, 129, 130, 179, 309, 403, 417, 418, 456, 457, 519, 594, 766, 767], special: [309, 425] }, "Valor Lakefront": { level: 28, normal: [30, 33, 83, 203, 228, 335, 336, 397, 400, 402], special: [] }, "Victory Road": { level: 0, normal: [42, 75, 82, 87, 95, 111, 112, 129, 130, 131, 184, 208, 419, 444, 530, 588], special: [] }, "Wayward Cave": { level: 0, normal: [41, 74, 95, 302, 303, 436, 443, 557, 587, 624], special: [] } }, rare: [[0, [1, 4, 7, 63, 92, 133, 147, 152, 155, 158, 172, 175, 239, 240, 246, 252, 255, 258, 280, 328, 333, 371, 374, 387, 390, 393, 443, 539, 577, 580, 584, 594, 624, 628]], [16, [37, 58, 95, 108, 114, 123, 127, 193, 198, 200, 207, 214, 215, 227, 228, 236, 353, 355, 359, 361, 408, 410, 442, 446, 447, 540, 578, 581, 583]], [17, [585]], [25, [618]], [30, [113, 115, 128, 131, 132, 137, 142, 143, 241, 357, 621]], [35, [625, 629]], [45, [541, 579, 582, 586]]], evo: { "2": [1], "3": [2], "5": [4], "6": [5], "8": [7], "9": [8], "11": [10], "12": [11], "14": [13], "15": [14], "17": [16], "18": [17], "20": [19], "22": [21], "24": [23], "25": [172], "26": [25], "28": [27], "30": [32], "31": [30], "33": [32], "34": [33], "35": [173], "36": [35], "38": [37], "39": [174], "40": [39], "42": [41], "44": [43], "45": [44], "47": [46], "49": [48], "51": [50], "53": [52], "55": [54], "57": [56], "59": [58], "61": [60], "62": [61], "64": [63], "65": [64], "67": [66], "68": [67], "70": [69], "71": [70], "73": [72], "75": [74], "76": [75], "78": [77], "80": [79], "82": [81], "85": [84], "87": [86], "89": [88], "91": [90], "93": [92], "94": [93], "97": [96], "99": [98], "101": [100], "103": [102], "105": [104], "106": [236], "107": [236], "110": [109], "112": [111], "113": [440], "117": [116], "119": [118], "121": [120], "122": [439], "124": [238], "125": [239], "126": [240], "130": [129], "134": [133], "135": [133], "136": [133], "139": [138], "141": [140], "143": [446], "148": [147], "149": [148], "153": [152], "154": [153], "156": [155], "157": [156], "159": [158], "160": [159], "162": [161], "164": [163], "166": [165], "168": [167], "169": [42], "171": [170], "176": [175], "178": [177], "180": [179], "181": [180], "182": [44], "183": [298], "184": [183], "185": [438], "186": [61], "188": [187], "189": [188], "192": [191], "195": [194], "196": [133], "197": [133], "199": [79], "202": [360], "205": [204], "208": [95], "210": [209], "212": [123], "217": [216], "219": [218], "221": [220], "224": [223], "226": [458], "229": [228], "230": [117], "232": [231], "233": [137], "237": [236], "242": [113], "247": [246], "248": [247], "253": [252], "254": [253], "256": [255], "257": [256], "259": [258], "260": [259], "262": [261], "264": [263], "266": [265], "267": [266], "268": [265], "269": [268], "271": [270], "272": [271], "274": [273], "275": [274], "277": [276], "279": [278], "281": [280], "282": [281], "284": [283], "286": [285], "288": [287], "289": [288], "291": [290], "292": [290], "294": [293], "295": [294], "297": [296], "301": [300], "305": [304], "306": [305], "308": [307], "310": [309], "315": [406], "317": [316], "319": [318], "321": [320], "323": [322], "326": [325], "329": [328], "330": [329], "332": [331], "334": [333], "340": [339], "342": [341], "344": [343], "346": [345], "348": [347], "350": [349], "354": [353], "356": [355], "358": [433], "362": [361], "364": [363], "365": [364], "367": [366], "368": [366], "372": [371], "373": [372], "375": [374], "376": [375], "388": [387], "389": [388], "391": [390], "392": [391], "394": [393], "395": [394], "397": [396], "398": [397], "400": [399], "402": [401], "404": [403], "405": [404], "407": [315], "409": [408], "411": [410], "413": [412], "414": [412], "416": [415], "419": [418], "421": [420], "424": [190], "426": [425], "428": [427], "429": [200], "430": [198], "432": [431], "435": [434], "437": [436], "444": [443], "445": [444], "448": [447], "450": [449], "452": [451], "454": [453], "457": [456], "460": [459], "461": [215], "462": [82], "463": [108], "464": [112], "465": [114], "466": [125], "467": [126], "468": [176], "469": [193], "470": [133], "471": [133], "472": [207], "473": [221], "474": [233], "475": [281], "476": [299], "477": [356], "478": [361], "514": [513], "515": [514], "517": [516], "518": [517], "520": [519], "522": [521], "523": [522], "525": [524], "527": [526], "528": [527], "530": [529], "531": [530], "533": [532], "534": [533], "536": [535], "540": [539], "541": [540], "543": [542], "544": [543], "546": [545], "547": [546], "549": [548], "551": [550], "552": [133], "555": [554], "556": [555], "558": [557], "564": [563], "565": [564], "567": [566], "568": [567], "570": [569], "572": [571], "573": [572], "575": [574], "576": [575], "578": [577], "579": [578], "581": [580], "582": [581], "585": [584], "586": [585], "588": [587], "590": [589], "591": [590], "593": [592], "595": [594], "596": [595], "598": [597], "600": [599], "603": [602], "605": [604], "607": [606], "609": [608], "611": [610], "615": [614], "617": [616], "623": [622], "625": [624], "629": [628], "630": [629], "767": [766] }, anywhere: [10, 13, 46, 48, 63, 93, 127, 133, 137, 138, 140, 142, 144, 145, 146, 190, 204, 214, 216, 265, 273, 345, 347, 377, 378, 379, 408, 410, 412, 415, 420, 434, 446, 488, 492, 493, 535, 548, 549, 550, 559, 589] };

  // src/stats-api.js
  var supported = typeof window.showDirectoryPicker === "function";
  var settings = {};
  var released = null;
  var itemsLed = {};
  var custom = {};
  var speciesNames = {};
  var spawnTables = null;
  var snapLast = null;
  var wiki = null;
  var lastErrors = [];
  var lastNote = "";
  var lastCard = {};
  var backend = null;
  var vfs2 = null;
  var handle = null;
  var handleName = "";
  var needsPermission = false;
  var inflight = null;
  var initP = null;
  var connected;
  var connect_;
  var resetConnected = () => {
    connected = new Promise((r) => {
      connect_ = r;
    });
  };
  resetConnected();
  var imgCache = {};
  var saveSettings = () => set("kv", "settings", settings);
  var isLogName = (f) => /^session-[\w-]+\.log$/.test(f);
  async function init() {
    if (initP) return initP;
    initP = (async () => {
      settings = await get("kv", "settings") || {};
      released = await get("kv", "released") || null;
      itemsLed = await get("kv", "items") || {};
      custom = await get("kv", "names") || {};
      speciesNames = { ...species_default, ...species_extra_default };
      const shipped = wiki_spawns_default;
      wiki = await createWiki({
        shipped,
        getNames: () => ({ ...speciesNames, ...custom }),
        getOn: () => settings.wikiAuto !== false,
        getSig: () => {
          const s = vfs2 && vfs2.c.get("/game/Platinum.exe");
          return s && s.stat ? `${s.stat.size}:${Math.round(s.stat.mtimeMs)}` : "";
        },
        onUpdated: (t) => {
          spawnTables = t;
        }
      });
      spawnTables = wiki.tables().t;
      handle = await get("kv", "handle") || null;
      if (handle) {
        handleName = handle.name || "";
        let perm = "prompt";
        try {
          perm = await handle.queryPermission({ mode: "read" });
        } catch {
        }
        if (perm === "granted") useHandle(handle);
        else needsPermission = true;
      }
    })();
    return initP;
  }
  function useBackend(b) {
    backend = b;
    vfs2 = new Vfs(b);
    attach(vfs2);
    needsPermission = false;
    for (const k of Object.keys(imgCache)) delete imgCache[k];
    connect_();
  }
  var useHandle = (h) => {
    handle = h;
    handleName = h.name || "";
    useBackend(new HandleBackend(h));
  };
  function notConnected(note) {
    return { gameDir: handleName || "", sessions: [], worlds: [], missing: true, found: {}, web: { state: needsPermission ? "needs-permission" : "no-folder", folder: handleName, supported, note: note || lastNote || "" } };
  }
  async function snapshot() {
    await vfs2.revalidate();
    vfs2.mount("/__archive/logs", settings.archive ? await archivedLogs() : null);
    let data = null;
    for (let i = 0; i < 12; i++) {
      vfs2.beginPass();
      data = (0, import_parser.load)("/game", settings.archive ? "/__archive/logs" : null);
      try {
        statSync("/game/Platinum.exe");
      } catch {
      }
      try {
        readFileSync("/game/world-name.txt", "utf8");
      } catch {
      }
      if (!vfs2.hasMisses()) break;
      await vfs2.settle();
    }
    lastErrors = vfs2.errors.splice(0);
    if (lastErrors.length) console.warn("PT Journal: some files could not be read", lastErrors);
    lastNote = "";
    return finish(data);
  }
  var activeWorld = () => {
    try {
      return readFileSync("/game/world-name.txt", "utf8").trim().slice(0, 60);
    } catch {
      return "";
    }
  };
  async function finish(data) {
    if (data.missing) return { ...data, gameDir: backend.name, web: { state: "wrong-folder", folder: backend.name, supported } };
    if (settings.archive) await archiveLogs();
    const tags = settings.tags || (settings.tags = {});
    const live = data.sessions.reduce((a, s) => !a || s.mtimeMs > a.mtimeMs ? s : a, null);
    const world = activeWorld();
    if (live && world && !tags[live.file] && Date.now() - live.mtimeMs < 12e4) {
      tags[live.file] = world;
      saveSettings();
    }
    const rel = trackReleased(data), itemsEver = trackItems(data);
    if (settings.snapshots) await snapshotArchive(data);
    if (wiki) wiki.tick();
    if (data.worldCard) lastCard[world] = data.worldCard;
    else data.worldCard = lastCard[world] || cardFromSave(data, world);
    return { ...data, gameDir: backend.name, tags, activeWorld: world, speciesNames: { ...speciesNames, ...custom }, customNames: custom, released: rel, itemsEver, spawns: spawnTables, web: { state: "ok", folder: backend.name, supported, errors: lastErrors } };
  }
  async function archivedLogs() {
    const rows = await all("logs"), out = {};
    for (const [name3, v] of Object.entries(rows)) out[name3] = { data: v.data, mtimeMs: v.mtimeMs, size: v.size };
    return out;
  }
  async function archiveLogs() {
    const meta = await get("kv", "logmeta") || {};
    for (const [name3, e] of vfs2.loadedFiles("/game/logs")) {
      if (!isLogName(name3) || meta[name3] && meta[name3] >= e.stat.size) continue;
      await set("logs", name3, { data: new Uint8Array(e.data), mtimeMs: e.stat.mtimeMs, size: e.stat.size });
      meta[name3] = e.stat.size;
    }
    await set("kv", "logmeta", meta);
  }
  var monRow = (m) => [m.pid, m.species, m.nick || "", m.loc, m.ball, m.shiny ? 1 : 0, m.nature, m.iv, m.ev, m.moves, m.item, m.mlv];
  var hash = (s) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i) | 0;
    return (h >>> 0).toString(16) + s.length.toString(16);
  };
  async function snapshotArchive(data) {
    try {
      const worlds = {};
      for (const name3 of Object.keys(data.dex || {})) {
        const ow = (data.owned || {})[name3], pa = (data.party || {})[name3] || [];
        worlds[name3] = { seen: data.dex[name3].seen, caught: data.dex[name3].caught, boxes: ow ? ow.mons.map(monRow) : [], party: pa.map((m) => [...monRow(m), m.level]), bag: (data.bag || {})[name3] || {} };
      }
      const body = JSON.stringify(worlds), h = hash(body);
      const list = await get("kv", "snapshots") || [];
      if (!snapLast) {
        snapLast = { hash: "", t: 0 };
        try {
          const last = JSON.parse(list[list.length - 1]);
          snapLast = { hash: last.h, t: Date.parse(last.t) || 0 };
        } catch {
        }
      }
      if (h !== snapLast.hash && Date.now() - snapLast.t >= 6e5 && Object.keys(worlds).length) {
        list.push(JSON.stringify({ t: (/* @__PURE__ */ new Date()).toISOString(), h, worlds }));
        await set("kv", "snapshots", list.slice(-200));
        snapLast = { hash: h, t: Date.now() };
      }
    } catch {
    }
  }
  async function archiveInfo() {
    const meta = await get("kv", "logmeta") || {}, snaps = await get("kv", "snapshots") || [];
    return { on: !!settings.archive, count: Object.keys(meta).length, bytes: Object.values(meta).reduce((a, b) => a + b, 0), snapsOn: !!settings.snapshots, snaps: snaps.length, snapBytes: snaps.reduce((a, s) => a + s.length, 0) };
  }
  function trackReleased(data) {
    let led = released, dirty = false;
    if (!led || typeof led !== "object" || !led.worlds) {
      led = released = { since: (/* @__PURE__ */ new Date()).toISOString(), worlds: {} };
      dirty = true;
    }
    const now = Date.now(), out = {};
    for (const [name3, ow] of Object.entries(data.owned || {})) {
      if (!ow || !Array.isArray(ow.all) || !ow.mons.length) continue;
      const present = new Set(ow.all), info = (m) => ({ s: m.species, n: m.nick || "", l: m.loc, b: m.ball, sh: m.shiny ? 1 : 0 });
      let W = led.worlds[name3];
      if (!W) {
        W = led.worlds[name3] = { tracked: {}, missing: {}, left: [] };
        for (const m of ow.mons) W.tracked[m.pid] = info(m);
        dirty = true;
      } else {
        for (const m of ow.mons) {
          const was = W.tracked[m.pid], now2 = info(m);
          if (!was || was.s !== now2.s || was.n !== now2.n) {
            W.tracked[m.pid] = now2;
            dirty = true;
          }
          if (W.missing[m.pid]) {
            delete W.missing[m.pid];
            dirty = true;
          }
          const back = W.left.findIndex((x) => x.pid === m.pid);
          if (back >= 0) {
            W.left.splice(back, 1);
            dirty = true;
          }
        }
        const tracked = Object.keys(W.tracked), absent = tracked.filter((p) => !present.has(Number(p)));
        if (tracked.length >= 10 && absent.length > tracked.length / 2) {
          if (Object.keys(W.missing).length) {
            W.missing = {};
            dirty = true;
          }
        } else {
          for (const p of tracked) {
            if (present.has(Number(p))) {
              if (W.missing[p]) {
                delete W.missing[p];
                dirty = true;
              }
              continue;
            }
            if (!W.missing[p]) {
              W.missing[p] = now;
              dirty = true;
            } else if (now - W.missing[p] >= 2e4) {
              W.left.push({ pid: Number(p), species: W.tracked[p].s, nick: W.tracked[p].n, loc: W.tracked[p].l, ball: W.tracked[p].b, shiny: W.tracked[p].sh, when: (/* @__PURE__ */ new Date()).toISOString() });
              delete W.tracked[p];
              delete W.missing[p];
              dirty = true;
            }
          }
        }
      }
      out[name3] = { count: W.left.length, left: W.left.slice(-300).reverse() };
    }
    if (dirty) set("kv", "released", led);
    return { since: led.since, worlds: out };
  }
  function trackItems(data) {
    let dirty = false;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    for (const name3 of Object.keys(data.bag || {})) {
      const have = {};
      for (const list of Object.values(data.bag[name3])) for (const [id, q] of list) have[id] = (have[id] || 0) + q;
      const ow = (data.owned || {})[name3], pa = (data.party || {})[name3] || [];
      for (const m of [...ow ? ow.mons : [], ...pa]) if (m.item) have[m.item] = (have[m.item] || 0) + 1;
      const W = itemsLed[name3] ||= {};
      for (const [id, q] of Object.entries(have)) {
        const cur = W[id];
        if (!cur) {
          W[id] = [q, now];
          dirty = true;
        } else if (q > cur[0]) {
          cur[0] = q;
          dirty = true;
        }
      }
    }
    if (dirty) set("kv", "items", itemsLed);
    return itemsLed;
  }
  async function dataUrl(name3) {
    await connected;
    if (name3 in imgCache) return imgCache[name3];
    let out = null;
    try {
      const f = await vfs2.readBlob([name3]);
      if (f) {
        const blob = f instanceof Blob ? f : new Blob([await f.arrayBuffer()], { type: "image/png" });
        out = await new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result).replace(/^data:[^;,]*/, "data:image/png"));
          r.onerror = () => res(null);
          r.readAsDataURL(blob);
        });
      }
    } catch {
    }
    return imgCache[name3] = out;
  }
  function pickViaInput() {
    return new Promise((resolve) => {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.webkitdirectory = true;
      inp.multiple = true;
      inp.style.display = "none";
      document.body.append(inp);
      inp.onchange = () => {
        const l = [...inp.files];
        inp.remove();
        resolve(l);
      };
      inp.oncancel = () => {
        inp.remove();
        resolve(null);
      };
      inp.click();
    });
  }
  function useFiles(list, name3) {
    useBackend(new FileListBackend(list, name3));
    handle = null;
    handleName = name3;
  }
  var api = {
    web: true,
    supported,
    async load() {
      if (inflight) return inflight;
      inflight = (async () => {
        await init();
        if (!backend) return notConnected();
        if (backend.kind === "handle") {
          let perm = "denied";
          try {
            perm = await handle.queryPermission({ mode: "read" });
          } catch {
          }
          if (perm !== "granted") {
            backend = null;
            resetConnected();
            needsPermission = true;
            return notConnected();
          }
        }
        try {
          return await snapshot();
        } catch (e) {
          console.warn("PT Journal: could not read the folder", e);
          const wasHandle = backend.kind === "handle";
          backend = null;
          resetConnected();
          needsPermission = wasHandle;
          lastNote = "Could not read the folder: " + String(e && e.message || e);
          return notConnected(lastNote);
        }
      })().finally(() => {
        inflight = null;
      });
      return inflight;
    },
    // Chrome and Edge: the folder picker, remembered for next time. Other browsers: a plain "choose a folder" box (not remembered).
    async pick() {
      if (supported) {
        let h = null;
        try {
          h = await window.showDirectoryPicker({ id: "pt-journal", mode: "read" });
        } catch (e) {
          if (e && e.name !== "AbortError") console.warn(e);
        }
        await init();
        if (inflight) await inflight.catch(() => {
        });
        if (h) {
          await set("kv", "handle", h);
          useHandle(h);
        }
      } else {
        const files = await pickViaInput();
        await init();
        if (files && files.length) {
          const top = (files[0].webkitRelativePath || "").split("/")[0] || "folder";
          useFiles(files.map((f) => ({ path: (f.webkitRelativePath || f.name).split("/").slice(1).join("/"), file: f })).filter((x) => x.path), top);
        }
      }
      return api.load();
    },
    // the folder is remembered but the browser wants a click before it will read it again
    async reconnect() {
      let perm = "denied", why = "";
      const t0 = performance.now();
      if (handle) {
        try {
          perm = await handle.requestPermission({ mode: "read" });
        } catch (e) {
          why = String(e && e.message || e);
        }
      }
      const quick = performance.now() - t0 < 600;
      await init();
      if (inflight) await inflight.catch(() => {
      });
      if (perm === "granted") useHandle(handle);
      else if (supported && quick) {
        try {
          const h = await window.showDirectoryPicker({ id: "pt-journal", mode: "read", startIn: handle || void 0 });
          await set("kv", "handle", h);
          useHandle(h);
        } catch (e) {
          if (!e || e.name !== "AbortError") lastNote = "Could not open the folder box: " + String(e && e.message || e);
        }
      } else lastNote = "The browser did not give permission" + (perm ? " (it said: " + perm + ")" : "") + (why ? ". " + why : "") + ". Press Reconnect again and choose Allow, or choose the folder again.";
      return api.load();
    },
    async tag(file, world) {
      await init();
      if (typeof file !== "string" || !isLogName(file)) return;
      settings.tags = settings.tags || {};
      if (typeof world === "string" && world && world.length <= 60) settings.tags[file] = world;
      else delete settings.tags[file];
      saveSettings();
    },
    async tagMany(files, world) {
      await init();
      if (!Array.isArray(files) || typeof world !== "string" || !world || world.length > 60) return;
      settings.tags = settings.tags || {};
      for (const f of files) if (typeof f === "string" && isLogName(f)) settings.tags[f] = world;
      saveSettings();
    },
    async archiveGet() {
      await init();
      return archiveInfo();
    },
    async archiveSet(which, on) {
      await init();
      settings[which === "snapshots" ? "snapshots" : "archive"] = on === true;
      await saveSettings();
      return archiveInfo();
    },
    async wikiGet() {
      await init();
      return wiki.status();
    },
    async wikiCheck() {
      await init();
      return wiki.check({ force: true });
    },
    async wikiSet(on) {
      await init();
      settings.wikiAuto = on === true;
      await saveSettings();
      return wiki.status();
    },
    icons: () => dataUrl("kit-mon-icons.png"),
    itemIcons: () => dataUrl("kit-item-icons.png"),
    shinyFronts: () => dataUrl("kit-mon-front-shiny.png"),
    townMap: () => dataUrl("town-map.png"),
    async mapLoad() {
      await init();
      return await get("kv", "maplabels") || null;
    },
    async mapSave(assign) {
      if (!assign || typeof assign !== "object") return;
      const clean = {};
      for (const [key, place] of Object.entries(assign).slice(0, 600)) if (/^\d{1,3},\d{1,3}$/.test(key) && Number.isInteger(place) && place >= 0 && place < 1e4) clean[key] = place;
      await set("kv", "maplabels", { assign: clean });
    },
    async nameSpecies(id, name3) {
      await init();
      if (!/^\d{1,4}$/.test(String(id)) || +id <= 493 || typeof name3 !== "string") return;
      const clean = name3.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 40);
      if (clean) custom[String(id)] = clean;
      else delete custom[String(id)];
      await set("kv", "names", custom);
    },
    // for finding out why a file will not read: await stats.probe('world-card.ini') in the browser console
    async probe(name3) {
      await init();
      if (!backend) return "not connected";
      try {
        const f = await backend.file(String(name3).split("/"));
        if (!f) return "not found";
        const ab = await f.arrayBuffer();
        return { size: f.size, modified: new Date(f.lastModified).toISOString(), bytesRead: ab.byteLength, start: new TextDecoder().decode(ab.slice(0, 300)) };
      } catch (e) {
        return "error: " + (e && e.name) + ": " + (e && e.message);
      }
    },
    // for testing only: connect a folder handle directly (for example one that refuses some names, like Chrome does)
    _connectHandle(h) {
      useHandle(h);
    },
    // for testing only: connect a folder given as { path, file } entries without the picker
    _connectFiles(list, name3) {
      useFiles(list, name3 || "Game");
    }
  };
  var stats_api_default = api;

  // node_modules/@vercel/analytics/dist/index.mjs
  init_buffer_shim();
  var initQueue = () => {
    if (window.va) return;
    window.va = function a(...params) {
      if (!window.vaq) window.vaq = [];
      window.vaq.push(params);
    };
  };
  var name = "@vercel/analytics";
  var version = "2.0.1";
  function isBrowser() {
    return typeof window !== "undefined";
  }
  function detectEnvironment() {
    try {
      const env = "production";
      if (env === "development" || env === "test") {
        return "development";
      }
    } catch {
    }
    return "production";
  }
  function setMode(mode = "auto") {
    if (mode === "auto") {
      window.vam = detectEnvironment();
      return;
    }
    window.vam = mode;
  }
  function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
  }
  function isDevelopment() {
    return getMode() === "development";
  }
  function getScriptSrc(props) {
    if (props.scriptSrc) {
      return makeAbsolute(props.scriptSrc);
    }
    if (isDevelopment()) {
      return "https://va.vercel-scripts.com/v1/script.debug.js";
    }
    if (props.basePath) {
      return makeAbsolute(`${props.basePath}/insights/script.js`);
    }
    return "/_vercel/insights/script.js";
  }
  function loadProps(explicitProps, confString) {
    var _a;
    let props = explicitProps;
    if (confString) {
      try {
        props = {
          ...(_a = JSON.parse(confString)) == null ? void 0 : _a.analytics,
          ...explicitProps
        };
      } catch {
      }
    }
    setMode(props.mode);
    const dataset = {
      sdkn: name + (props.framework ? `/${props.framework}` : ""),
      sdkv: version
    };
    if (props.disableAutoTrack) {
      dataset.disableAutoTrack = "1";
    }
    if (props.viewEndpoint) {
      dataset.viewEndpoint = makeAbsolute(props.viewEndpoint);
    }
    if (props.eventEndpoint) {
      dataset.eventEndpoint = makeAbsolute(props.eventEndpoint);
    }
    if (props.sessionEndpoint) {
      dataset.sessionEndpoint = makeAbsolute(props.sessionEndpoint);
    }
    if (isDevelopment() && props.debug === false) {
      dataset.debug = "false";
    }
    if (props.dsn) {
      dataset.dsn = props.dsn;
    }
    if (props.endpoint) {
      dataset.endpoint = props.endpoint;
    } else if (props.basePath) {
      dataset.endpoint = makeAbsolute(`${props.basePath}/insights`);
    }
    return {
      beforeSend: props.beforeSend,
      src: getScriptSrc(props),
      dataset
    };
  }
  function makeAbsolute(url) {
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") ? url : `/${url}`;
  }
  function inject(props = {
    debug: true
  }, confString) {
    var _a;
    if (!isBrowser()) return;
    const { beforeSend, src, dataset } = loadProps(props, confString);
    initQueue();
    if (beforeSend) {
      (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", beforeSend);
    }
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    for (const [key, value] of Object.entries(dataset)) {
      script.dataset[key] = value;
    }
    script.defer = true;
    script.onerror = () => {
      const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
      console.log(
        `[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`
      );
    };
    document.head.appendChild(script);
  }

  // node_modules/@vercel/speed-insights/dist/index.mjs
  init_buffer_shim();
  var initQueue2 = () => {
    if (window.si) return;
    window.si = function a(...params) {
      window.siq = window.siq || [];
      window.siq.push(params);
    };
  };
  var name2 = "@vercel/speed-insights";
  var version2 = "2.1.0";
  function isBrowser2() {
    return typeof window !== "undefined";
  }
  function detectEnvironment2() {
    try {
      const env = "production";
      if (env === "development" || env === "test") {
        return "development";
      }
    } catch {
    }
    return "production";
  }
  function isDevelopment2() {
    return detectEnvironment2() === "development";
  }
  function getScriptSrc2(props) {
    if (props.scriptSrc) {
      return makeAbsolute2(props.scriptSrc);
    }
    if (isDevelopment2()) {
      return "https://va.vercel-scripts.com/v1/speed-insights/script.debug.js";
    }
    if (props.dsn) {
      return "https://va.vercel-scripts.com/v1/speed-insights/script.js";
    }
    if (props.basePath) {
      return makeAbsolute2(`${props.basePath}/speed-insights/script.js`);
    }
    return "/_vercel/speed-insights/script.js";
  }
  function loadProps2(explicitProps, confString) {
    var _a;
    let props = explicitProps;
    if (confString) {
      try {
        props = {
          ...(_a = JSON.parse(confString)) == null ? void 0 : _a.speedInsights,
          ...explicitProps
        };
      } catch {
      }
    }
    const dataset = {
      sdkn: name2 + (props.framework ? `/${props.framework}` : ""),
      sdkv: version2
    };
    if (props.sampleRate) {
      dataset.sampleRate = props.sampleRate.toString();
    }
    if (props.route) {
      dataset.route = props.route;
    }
    if (typeof props.softNavs === "boolean") {
      dataset.softNavs = String(props.softNavs);
    }
    if (isDevelopment2() && props.debug === false) {
      dataset.debug = "false";
    }
    if (props.dsn) {
      dataset.dsn = props.dsn;
    }
    if (props.endpoint) {
      dataset.endpoint = makeAbsolute2(props.endpoint);
    } else if (props.basePath) {
      dataset.endpoint = makeAbsolute2(`${props.basePath}/speed-insights/vitals`);
    }
    return {
      src: getScriptSrc2(props),
      beforeSend: props.beforeSend,
      dataset
    };
  }
  function makeAbsolute2(url) {
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") ? url : `/${url}`;
  }
  function injectSpeedInsights(props = {}, confString) {
    var _a;
    if (!isBrowser2() || props.route === null) return null;
    initQueue2();
    const { beforeSend, src, dataset } = loadProps2(props, confString);
    if (document.head.querySelector(`script[src*="${src}"]`)) return null;
    if (beforeSend) {
      (_a = window.si) == null ? void 0 : _a.call(window, "beforeSend", beforeSend);
    }
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    for (const [key, value] of Object.entries(dataset)) {
      script.dataset[key] = value;
    }
    script.onerror = () => {
      console.log(
        `[Vercel Speed Insights] Failed to load script from ${src}. Please check if any content blockers are enabled and try again.`
      );
    };
    document.head.appendChild(script);
    return {
      setRoute: (route) => {
        script.dataset.route = route ?? void 0;
      }
    };
  }

  // src/entry.js
  window.stats = stats_api_default;
  if (!/^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(location.hostname)) {
    try {
      inject();
    } catch {
    }
    try {
      injectSpeedInsights();
    } catch {
    }
  }
})();

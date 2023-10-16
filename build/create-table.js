var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// node_modules/.pnpm/bytes@3.1.2/node_modules/bytes/index.js
var require_bytes = __commonJS({
  "node_modules/.pnpm/bytes@3.1.2/node_modules/bytes/index.js"(exports, module2) {
    "use strict";
    module2.exports = bytes2;
    module2.exports.format = format;
    module2.exports.parse = parse;
    var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;
    var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;
    var map = {
      b: 1,
      kb: 1 << 10,
      mb: 1 << 20,
      gb: 1 << 30,
      tb: Math.pow(1024, 4),
      pb: Math.pow(1024, 5)
    };
    var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;
    function bytes2(value, options) {
      if (typeof value === "string") {
        return parse(value);
      }
      if (typeof value === "number") {
        return format(value, options);
      }
      return null;
    }
    function format(value, options) {
      if (!Number.isFinite(value)) {
        return null;
      }
      var mag = Math.abs(value);
      var thousandsSeparator = options && options.thousandsSeparator || "";
      var unitSeparator = options && options.unitSeparator || "";
      var decimalPlaces = options && options.decimalPlaces !== void 0 ? options.decimalPlaces : 2;
      var fixedDecimals = Boolean(options && options.fixedDecimals);
      var unit = options && options.unit || "";
      if (!unit || !map[unit.toLowerCase()]) {
        if (mag >= map.pb) {
          unit = "PB";
        } else if (mag >= map.tb) {
          unit = "TB";
        } else if (mag >= map.gb) {
          unit = "GB";
        } else if (mag >= map.mb) {
          unit = "MB";
        } else if (mag >= map.kb) {
          unit = "KB";
        } else {
          unit = "B";
        }
      }
      var val = value / map[unit.toLowerCase()];
      var str = val.toFixed(decimalPlaces);
      if (!fixedDecimals) {
        str = str.replace(formatDecimalsRegExp, "$1");
      }
      if (thousandsSeparator) {
        str = str.split(".").map(function(s, i) {
          return i === 0 ? s.replace(formatThousandsRegExp, thousandsSeparator) : s;
        }).join(".");
      }
      return str + unitSeparator + unit;
    }
    function parse(val) {
      if (typeof val === "number" && !isNaN(val)) {
        return val;
      }
      if (typeof val !== "string") {
        return null;
      }
      var results = parseRegExp.exec(val);
      var floatValue;
      var unit = "b";
      if (!results) {
        floatValue = parseInt(val, 10);
        unit = "b";
      } else {
        floatValue = parseFloat(results[1]);
        unit = results[4].toLowerCase();
      }
      if (isNaN(floatValue)) {
        return null;
      }
      return Math.floor(map[unit] * floatValue);
    }
  }
});

// node_modules/.pnpm/app-root-dir@1.0.2/node_modules/app-root-dir/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/app-root-dir@1.0.2/node_modules/app-root-dir/lib/index.js"(exports) {
    var GLOBAL_KEY = "app-root-dir";
    var _rootDir;
    exports.get = function() {
      var dir = global[GLOBAL_KEY];
      if (dir) {
        return dir;
      }
      if (_rootDir === void 0) {
        var fs2 = require("fs");
        var path2 = require("path");
        var NODE_MODULES = path2.sep + "node_modules" + path2.sep;
        var cwd = process.cwd();
        var pos = cwd.indexOf(NODE_MODULES);
        if (pos !== -1) {
          _rootDir = cwd.substring(0, pos);
        } else if (fs2.existsSync(path2.join(cwd, "package.json"))) {
          _rootDir = cwd;
        } else {
          pos = __dirname.indexOf(NODE_MODULES);
          if (pos === -1) {
            _rootDir = path2.normalize(path2.join(__dirname, ".."));
          } else {
            _rootDir = __dirname.substring(0, pos);
          }
        }
      }
      return _rootDir;
    };
    exports.set = function(dir) {
      global[GLOBAL_KEY] = _rootDir = dir;
    };
  }
});

// src/create-table.js
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));

// src/bundle-size.js
var import_bytes = __toESM(require_bytes());
var DELIMITER_WORD = "----DELIMITER----";
var removeHashFromChunk = (word) => {
  const extensionRemoved = word.replace(/\.esm\.js/gi, "").replace(/\.js/gi, "");
  const clientPrefixRemoved = extensionRemoved.replace(/\.\/build\//gi, "");
  const chunkPrefixRemoved = clientPrefixRemoved.replace("chunk.", "");
  const periodsRemoved = chunkPrefixRemoved.replace(/\./gi, "");
  console.log({ periodsRemoved });
  return periodsRemoved;
};
var prettifyBundleSizeOutput = (original) => {
  const rows = original.split(DELIMITER_WORD);
  let output = `<tr><th>Status</th><th>Filename</th><th>Ext</th><th>Size</th><th>Budgetted Size</th></tr>`;
  const getStatusSymbol = (status) => {
    const isFailed = status !== "PASS";
    const statusSymbol = isFailed ? "\u{1F534}" : "\u{1F7E2}";
    return `${isFailed ? "<b>" : ""}${statusSymbol}${isFailed ? "</b>" : ""}`;
  };
  const getValue = (value, status) => {
    const isFailed = status !== "PASS";
    return `${isFailed ? "<b>" : ""}${value}${isFailed ? "</b>" : ""}`;
  };
  const processed = {};
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const trimmed = row.trim().split(" ");
    if (row.includes("ERROR")) {
      output += `<tr><td>\u{1F534}</td><td colspan="4"><b>${row}</b></td></tr>`;
      continue;
    }
    if (trimmed.length < 7)
      continue;
    const status = trimmed[0];
    const chunkNameWithHash = trimmed[2].substring(0, trimmed[2].length - 1);
    const chunkName = removeHashFromChunk(chunkNameWithHash);
    const ext = chunkNameWithHash.endsWith(".esm.js") ? "esm" : "js";
    const size = trimmed[3];
    const sizeBudget = trimmed[6];
    if (ext === "esm")
      continue;
    if (!status)
      continue;
    if (processed[`${chunkName}${ext}`]) {
      continue;
    }
    output += `<tr><td>${getStatusSymbol(
      status
    )}</td><td><code>${chunkName}</code></td><td>${ext}</td><td>${getValue(
      size,
      status
    )}</td><td>${getValue(sizeBudget, status)}</td></tr>`;
    processed[`${chunkName}${ext}`] = true;
  }
  return `<table>${output}</table>`;
};
var getSizeMap = (original) => {
  const rows = original.split(DELIMITER_WORD);
  const output = {};
  rows.forEach((row) => {
    const trimmed = row.trim().split(" ");
    if (trimmed.length < 7)
      return;
    const status = trimmed[0];
    const chunkNameWithHash = trimmed[2].substring(0, trimmed[2].length - 1);
    const chunkName = removeHashFromChunk(chunkNameWithHash);
    const ext = chunkNameWithHash.endsWith(".esm.js") ? "esm" : "js";
    if (ext === "esm")
      return;
    const size = trimmed[3];
    const sizeBudget = trimmed[6];
    console.log({
      status,
      chunkName,
      chunkNameWithHash,
      size,
      sizeBudget
    });
    if (!status)
      return;
    if (!chunkName)
      return;
    output[chunkName] = {
      status,
      chunkNameWithHash,
      size,
      sizeBudget,
      ext
    };
  });
  return output;
};
var getDiffReport = (newReportSizeMap, oldReportSizeMap) => {
  const newChunks = { ...newReportSizeMap };
  const removedChunks = [];
  const diffReports = [];
  Object.keys(oldReportSizeMap).forEach((key) => {
    if (newReportSizeMap[key]) {
      const sizeDiff = (0, import_bytes.default)(newReportSizeMap[key].size) - (0, import_bytes.default)(oldReportSizeMap[key].size);
      if (sizeDiff !== 0) {
        diffReports.push({
          chunkName: key,
          newSize: newReportSizeMap[key].size,
          oldSize: oldReportSizeMap[key].size,
          diff: (0, import_bytes.default)(sizeDiff)
        });
      }
      delete newChunks[key];
    } else {
      removedChunks.push({
        // chunkName: key,
        ...oldReportSizeMap[key]
      });
    }
  });
  diffReports.sort((a, b) => {
    return (0, import_bytes.default)(b.diff) - (0, import_bytes.default)(a.diff);
  });
  const newlyAddedChunks = [];
  Object.keys(newChunks).forEach((key) => {
    newlyAddedChunks.push({
      chunkName: key,
      status: newChunks[key].status,
      chunkNameWithHash: newChunks[key].chunkNameWithHash,
      size: newChunks[key].size,
      sizeBudget: newChunks[key].sizeBudget
    });
  });
  return { diffReports, newlyAddedChunks, removedChunks };
};
var prettifyDiffReport = ({ diffReports, newlyAddedChunks, removedChunks }, serviceName) => {
  let output = "";
  output += `<h3>Please take time to look at the following reports to get an idea of how this PR will impact the bundle size of ${serviceName}!</h3>`;
  output += `<h4>All sizes shown in this report are brotli-compressed sizes.</h4>`;
  output += `In general, if you are seeing a lot of increases (more than 10 KB; yes 10 KB is a big increase :smile:) when your PR doesn't actually add a lot of new features, or new packages, you <b>should</b> investigate the reason for the increases.<br /><br />`;
  let diffTable = "";
  let diffExists = false;
  diffTable += `<details><summary>Following is the bundlesize diff between this PR and the <b>${serviceName}/production</b> branch:</summary>`;
  diffTable += `<h3><b>Note</b>: A lower diff is better, because that would mean your PR decreases the chunk size!</h3>`;
  diffTable += `<table><tr><th>Chunk name</th><th>Size (this PR)</th><th>Size (Prod)</th><th>Diff</th></tr>`;
  diffReports.forEach((report) => {
    if ((0, import_bytes.default)(report.diff) !== 0) {
      diffExists = true;
      diffTable += `<tr><td>${report.chunkName}</td><td>${report.newSize}</td><td>${report.oldSize}</td><td>${report.diff}</td></tr>`;
    }
  });
  if (diffExists) {
    output += `${diffTable}</table></details>`;
  }
  let newlyAddedChunksTable = "";
  let newChunkAdded = false;
  newlyAddedChunksTable += `<details><summary>Following is the list of newly added chunks from this PR</summary>`;
  newlyAddedChunksTable += `<h3><b>Note</b>: If you are seeing numbers as the chunk name, that means you did not define a webpackChunkName when creating the dynamic import. Please give the chunk a clear name to improve maintainability in the future.</h3>`;
  newlyAddedChunksTable += `<table><tr><th>Chunk name</th><th>Full filename</th><th>Size</th></tr>`;
  newlyAddedChunks.forEach((chunk) => {
    newChunkAdded = true;
    newlyAddedChunksTable += `<tr><td>${chunk.chunkName || removeHashFromChunk(chunk.chunkNameWithHash)}</td><td>${chunk.chunkNameWithHash}</td><td>${chunk.size}</td></tr>`;
  });
  if (newChunkAdded) {
    output += `${newlyAddedChunksTable}</table></details>`;
  }
  let removedChunksTable = "";
  let oldChunkRemoved = false;
  removedChunksTable += `<details><summary>Following is the list of removed chunks from this PR</summary>`;
  removedChunksTable += `<h3><b>Note</b>: <b>Removed</b> means that the chunk <b>existed</b> in the production branch, but <b>no longer exists in your PR branch</b></h3>`;
  removedChunksTable += `<table><tr><th>Chunk name</th><th>Full filename</th><th>Size</th></tr>`;
  removedChunks.forEach((chunk) => {
    oldChunkRemoved = true;
    removedChunksTable += `<tr><td>${chunk.chunkName || removeHashFromChunk(chunk.chunkNameWithHash)}</td><td>${chunk.chunkNameWithHash}</td><td>${chunk.size}</td></tr>`;
  });
  if (oldChunkRemoved) {
    output += `${removedChunksTable}</table></details>`;
  }
  if (diffExists || newChunkAdded || oldChunkRemoved) {
    return output;
  }
  return "";
};
function readReportsText(report) {
  const lines = report.split("\n");
  let possibleErrorMessage2 = "";
  let bundleSizeOutput2 = "";
  let bundleSizeFailed2 = false;
  lines.forEach((line) => {
    const isContainError = line && line.includes("There is no matching") || line.includes("Config not found") || line.includes("You can read about the configuration options here") || line.includes("https://github.com/siddharthkp/bundlesize#configuration");
    if (isContainError) {
      bundleSizeFailed2 = true;
      bundleSizeOutput2 += `${line}${DELIMITER_WORD}`;
    } else {
      bundleSizeOutput2 += `${line}${DELIMITER_WORD}`;
    }
  });
  return { possibleErrorMessage: possibleErrorMessage2, bundleSizeOutput: bundleSizeOutput2, bundleSizeFailed: bundleSizeFailed2 };
}
function constructCommentMessage(bundleSizeOutput2, sizeMap2) {
  let message = "";
  message += "Nice looking PR you have here.\n\n";
  const diffs = getDiffReport(sizeMap2, {});
  message += prettifyDiffReport(diffs, "skiper-app-template");
  message += `<details><summary>Here is the complete <b><i>bundlesize</i></b> report for it:</summary>`;
  message += `${prettifyBundleSizeOutput(bundleSizeOutput2)}</details>`;
  return message;
}

// src/create-table.js
var import_app_root_dir = __toESM(require_lib());
var filename = "bundle-size-report.txt";
var result = import_fs.default.readFileSync(import_path.default.join(import_app_root_dir.default.get(), filename), "utf-8");
var { bundleSizeOutput, bundleSizeFailed, possibleErrorMessage } = readReportsText(result);
var sizeMap = getSizeMap(bundleSizeOutput);
var commentMsg = constructCommentMessage(bundleSizeOutput, sizeMap);
import_fs.default.writeFileSync(import_path.default.join(import_app_root_dir.default.get(), "bundle-report.html"), commentMsg);
/*! Bundled license information:

bytes/index.js:
  (*!
   * bytes
   * Copyright(c) 2012-2014 TJ Holowaychuk
   * Copyright(c) 2015 Jed Watson
   * MIT Licensed
   *)
*/

const bytes = require("bytes");

const DELIMITER_WORD = "----DELIMITER----";
const START_FLAG_WORD = "<<< START OF BUNDLESIZE OUTPUT >>>";
const END_FLAG_WORD = "<<< END OF BUNDLESIZE OUTPUT >>>";
const ERROR_IDENTIFIER = [
  "There is no matching",
  "ERROR  Config not found.",
  "ERROR",
  "You can read about the configuration options here",
  "https://github.com/siddharthkp/bundlesize#configuration",
];

const removeHashFromChunk = (word) => {
  const extensionRemoved = word
    .replace(/\.esm\.js/gi, "")
    .replace(/\.js/gi, ""); // remove extension like .js or .esm.js

  // const clientPrefixRemoved = hashRemoved
  //   .replace(/\.\/build\/client\//gi, "")
  //   .replace(/\.\/client\//gi, "")
  //   .replace(/client\//gi, ""); // remove the prefix ./client/
  const clientPrefixRemoved = extensionRemoved.replace(/\.\/build\//gi, "");
  const chunkPrefixRemoved = clientPrefixRemoved.replace("chunk.", "");
  const periodsRemoved = chunkPrefixRemoved.replace(/\./gi, ""); // remove period character because mongo doesn't allow field names with period
  return periodsRemoved;
};

/**
 * @param {String} original The string output from running the `bundlesize` command
 *
 * @returns {String} The markdown-compatible string to be used when adding a comment to GitHub pull request
 */
const prettifyBundleSizeOutput = (original) => {
  const rows = original.split(DELIMITER_WORD);
  let output = `<tr><th>Status</th><th>Filename</th><th>Ext</th><th>Size</th><th>Budgetted Size</th></tr>`;

  const getStatusSymbol = (status) => {
    const isFailed = status !== "PASS";
    const statusSymbol = isFailed ? "🔴" : "🟢";
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
      // some glob patterns do not have any match
      // we will print out the message so we can know which glob is it
      // so we can update the package.json accordingly
      output += `<tr><td>🔴</td><td colspan="4"><b>${row}</b></td></tr>`;

      continue;
    }

    if (trimmed.length < 7) continue;

    const status = trimmed[0];
    const chunkNameWithHash = trimmed[2].substring(0, trimmed[2].length - 1); // remove extra trailing `:` character
    const chunkName = removeHashFromChunk(chunkNameWithHash);
    const ext = chunkNameWithHash.endsWith(".esm.js") ? "esm" : "js";
    const size = trimmed[3];
    const sizeBudget = trimmed[6];

    if (ext === "esm") continue;
    if (!status) continue;

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

/**
 * @param {String} original The string output from running the `bundlesize` command
 *
 * @returns {Object.<string, ChunkInfo>} A map of each chunks with each of their informations
 * i. e.: {
 *   'vendor': {
 *     status: 'FAIL',
 *     chunkNameWithHash: './client/vendor.1239898s12hd1.js',
 *     size: '90KB',
 *     sizeBudget: '80KB',
 *   },
 *   'mobile': {
 *     status: 'PASS',
 *     chunkNameWithHash: './client/mobile.1239898s12hd1.js',
 *     size: '60KB',
 *     sizeBudget: '80KB',
 *   }
 * }
 */
const getSizeMap = (original) => {
  const rows = original.split(DELIMITER_WORD);
  const output = {};

  rows.forEach((row) => {
    const trimmed = row.trim().split(" ");

    if (trimmed.length < 7) return;

    const status = trimmed[0];
    const chunkNameWithHash = trimmed[2].substring(0, trimmed[2].length - 1); // remove extra trailing `:` character
    const chunkName = removeHashFromChunk(chunkNameWithHash);
    const ext = chunkNameWithHash.endsWith(".esm.js") ? "esm" : "js";
    if (ext === "esm") return;

    const size = trimmed[3];
    const sizeBudget = trimmed[6];
    if (!status) return;

    if (!chunkName) return;

    output[chunkName] = {
      status,
      chunkNameWithHash,
      size,
      sizeBudget,
      ext,
    };
  });

  return output;
};

/**
 * @param {Object.<string, ChunkInfo>} sizeMap The object constructed from `getSizeMap`
 *
 * @returns {Array.<ChunkInfo>} An array filled with bundle that not passing the gate
 */
const getFailedBundles = (sizeMap) => {
  const result = [];

  if (sizeMap) {
    Object.keys(sizeMap).forEach((key) => {
      if (sizeMap[key].status === "FAIL") {
        result.push(sizeMap[key]);
      }
    });
  }

  return result;
};

/**
 * @param {String} original The string output from running the `bundlesize` command
 * @param {Object.<string, ChunkInfo>} newReportSizeMap
 * @param {Object.<string, ChunkInfo>} oldReportSizeMap
 *
 * @returns {DiffReport} The diff report of the two provided sizeMap
 */
const getDiffReport = (newReportSizeMap, oldReportSizeMap) => {
  const newChunks = { ...newReportSizeMap };
  const removedChunks = [];
  const diffReports = [];

  Object.keys(oldReportSizeMap).forEach((key) => {
    if (newReportSizeMap[key]) {
      const sizeDiff =
        bytes(newReportSizeMap[key].size) - bytes(oldReportSizeMap[key].size);

      if (sizeDiff !== 0) {
        diffReports.push({
          chunkName: key,
          newSize: newReportSizeMap[key].size,
          oldSize: oldReportSizeMap[key].size,
          diff: bytes(sizeDiff),
        });
      }

      delete newChunks[key];
    } else {
      removedChunks.push({
        // chunkName: key,
        ...oldReportSizeMap[key],
      });
    }
  });

  /* sort by diff ascendingly */
  diffReports.sort((a, b) => {
    return bytes(b.diff) - bytes(a.diff);
  });

  const newlyAddedChunks = [];

  Object.keys(newChunks).forEach((key) => {
    newlyAddedChunks.push({
      chunkName: key,
      status: newChunks[key].status,
      chunkNameWithHash: newChunks[key].chunkNameWithHash,
      size: newChunks[key].size,
      sizeBudget: newChunks[key].sizeBudget,
    });
  });

  return { diffReports, newlyAddedChunks, removedChunks };
};

/**
 * @param {DiffReport} $0 - The diff report to prettify
 * @param {String} serviceName - The name of the service this report refers to
 *
 * @returns {String} The markdown-compatible string to be used when adding a comment to GitHub pull request
 */
const prettifyDiffReport = (
  { diffReports, newlyAddedChunks, removedChunks },
  serviceName
) => {
  let output = "";

  output += `<h3>Please take time to look at the following reports to get an idea of how this PR will impact the bundle size of ${serviceName}!</h3>`;
  output += `<h4>All sizes shown in this report are brotli-compressed sizes.</h4>`;
  output += `In general, if you are seeing a lot of increases (more than 10 KB; yes 10 KB is a big increase :smile:) when your PR doesn't actually add a lot of new features, or new packages, you <b>should</b> investigate the reason for the increases.<br /><br />`;

  /**
   * The diff table
   */
  let diffTable = "";
  let diffExists = false;

  diffTable += `<details><summary>Following is the bundlesize diff between this PR and the <b>${serviceName}/production</b> branch:</summary>`;
  diffTable += `<h3><b>Note</b>: A lower diff is better, because that would mean your PR decreases the chunk size!</h3>`;
  diffTable += `<table><tr><th>Chunk name</th><th>Size (this PR)</th><th>Size (Prod)</th><th>Diff</th></tr>`;

  diffReports.forEach((report) => {
    if (bytes(report.diff) !== 0) {
      diffExists = true;
      diffTable += `<tr><td>${report.chunkName}</td><td>${report.newSize}</td><td>${report.oldSize}</td><td>${report.diff}</td></tr>`;
    }
  });

  if (diffExists) {
    output += `${diffTable}</table></details>`;
  }

  /**
   * The list of newly added chunks
   */
  let newlyAddedChunksTable = "";
  let newChunkAdded = false;

  newlyAddedChunksTable += `<details><summary>Following is the list of newly added chunks from this PR</summary>`;
  newlyAddedChunksTable += `<h3><b>Note</b>: If you are seeing numbers as the chunk name, that means you did not define a webpackChunkName when creating the dynamic import. Please give the chunk a clear name to improve maintainability in the future.</h3>`;
  newlyAddedChunksTable += `<table><tr><th>Chunk name</th><th>Full filename</th><th>Size</th></tr>`;

  newlyAddedChunks.forEach((chunk) => {
    newChunkAdded = true;
    newlyAddedChunksTable += `<tr><td>${
      chunk.chunkName || removeHashFromChunk(chunk.chunkNameWithHash)
    }</td><td>${chunk.chunkNameWithHash}</td><td>${chunk.size}</td></tr>`;
  });

  if (newChunkAdded) {
    output += `${newlyAddedChunksTable}</table></details>`;
  }

  /**
   * The list of removed chunks
   */
  let removedChunksTable = "";
  let oldChunkRemoved = false;

  removedChunksTable += `<details><summary>Following is the list of removed chunks from this PR</summary>`;
  removedChunksTable += `<h3><b>Note</b>: <b>Removed</b> means that the chunk <b>existed</b> in the production branch, but <b>no longer exists in your PR branch</b></h3>`;
  removedChunksTable += `<table><tr><th>Chunk name</th><th>Full filename</th><th>Size</th></tr>`;

  removedChunks.forEach((chunk) => {
    oldChunkRemoved = true;
    removedChunksTable += `<tr><td>${
      chunk.chunkName || removeHashFromChunk(chunk.chunkNameWithHash)
    }</td><td>${chunk.chunkNameWithHash}</td><td>${chunk.size}</td></tr>`;
  });

  if (oldChunkRemoved) {
    output += `${removedChunksTable}</table></details>`;
  }

  if (diffExists || newChunkAdded || oldChunkRemoved) {
    return output;
  }

  return "";
};

function constructCommentMessage(
  bundleSizeOutput,
  sizeMap,
  latestMasterSizemap
) {
  let message = `👋 Hi, I am Kratos!\n`;

  message += "Nice looking PR you have here.\n\n";

  const diffs = getDiffReport(sizeMap, latestMasterSizemap);
  console.log("diffs", JSON.stringify(diffs));
  message += prettifyDiffReport(diffs, "skiper-app-template");

  message += `<details><summary>Here is the complete <b><i>bundlesize</i></b> report for it:</summary>`;
  message += `${prettifyBundleSizeOutput(bundleSizeOutput)}</details>`;
  return message;
}

module.exports = {
  getSizeMap,
  constructCommentMessage,
};

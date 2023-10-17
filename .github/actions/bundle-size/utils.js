const DELIMITER_WORD = "----DELIMITER----";

function readReportsText(report) {
  const lines = report.split("\n");
  let possibleErrorMessage = "";
  let bundleSizeOutput = "";
  let bundleSizeFailed = false;

  lines.forEach((line) => {
    const isContainError =
      (line && line.includes("There is no matching")) ||
      line.includes("Config not found") ||
      line.includes("You can read about the configuration options here") ||
      line.includes("https://github.com/siddharthkp/bundlesize#configuration");

    if (isContainError) {
      bundleSizeFailed = true;
      bundleSizeOutput += `${line}${DELIMITER_WORD}`;
    } else {
      bundleSizeOutput += `${line}${DELIMITER_WORD}`;
    }
  });
  return { possibleErrorMessage, bundleSizeOutput, bundleSizeFailed };
}

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

module.exports = {
  readReportsText,
  getSizeMap,
};

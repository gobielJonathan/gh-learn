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

module.exports = {
  readReportsText,
};

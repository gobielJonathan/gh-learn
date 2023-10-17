const bundler = require("./utils");
const core = require("@actions/core");

const bundleSizeMap = core.getInput("bundleSizeMap");
const bundleSizeStr = core.getInput("bundleSizeStr");

const masterBundleSizeMap = core.getInput("masterBundleSizeMap");

console.log("masterBundleSizeMap ", JSON.stringify(masterBundleSizeMap));

const commentMsg = bundler.constructCommentMessage(
  bundleSizeStr,
  bundleSizeMap,
  masterBundleSizeMap
);

core.setOutput("report", commentMsg);

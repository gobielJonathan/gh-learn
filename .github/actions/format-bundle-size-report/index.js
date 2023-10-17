const bundler = require("./utils");
const core = require("@actions/core");

const bundleSizeMap = core.getInput("bundleSizeMap");
const parsedBundleSizeMap = JSON.parse(bundleSizeMap);

const bundleSizeStr = core.getInput("bundleSizeStr");

const masterBundleSizeMap = core.getInput("masterBundleSizeMap");
const parsedMasterBundleSizeMap = JSON.parse(masterBundleSizeMap);

const commentMsg = bundler.constructCommentMessage(
  bundleSizeStr,
  parsedBundleSizeMap,
  parsedMasterBundleSizeMap
);

core.setOutput("report", commentMsg);

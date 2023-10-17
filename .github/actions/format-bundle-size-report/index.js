const bundler = require("./utils");
const core = require("@actions/core");

const bundleSizeOutput = core.getInput("bundleSizeOutput");

const sizeMap = bundler.getSizeMap(bundleSizeOutput);
const masterBundleSize = core.getInput("masterBundleSize");

const commentMsg = bundler.constructCommentMessage(
  bundleSizeOutput,
  sizeMap,
  masterBundleSize
);

core.setOutput("report", commentMsg);

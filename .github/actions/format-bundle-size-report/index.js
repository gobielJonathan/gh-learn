const bundler = require("./utils");
const core = require("@actions/core");

const bundleSizeOutput = core.getInput("bundleSizeOutput");
const masterBundleSize = core.getInput("masterBundleSize");

const sizeMap = bundler.getSizeMap(bundleSizeOutput);

if (!sizeMap) {
  core.setFailed(
    "💥 Failed to generate `sizeMap` from `npx @wpe-tkpd/bundlesize` output"
  );
  return null;
}

const commentMsg = bundler.constructCommentMessage(
  bundleSizeOutput,
  sizeMap,
  masterBundleSize
);

core.setOutput("report", commentMsg);

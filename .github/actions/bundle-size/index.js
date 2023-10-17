const fs = require("fs");
const path = require("path");
const bundler = require("./utils");
const approotdir = require("app-root-dir");
const core = require("@actions/core");

const { bundleSizeOutput } = bundler.readReportsText(result);

core.debug("1231");

const filename = "bundle-size-report.txt";

const result = fs.readFileSync(path.join(approotdir.get(), filename), "utf-8");

const sizeMap = bundler.getSizeMap(bundleSizeOutput);

if (!sizeMap) {
  core.setFailed(
    "💥 Failed to generate `sizeMap` from `npx @wpe-tkpd/bundlesize` output"
  );
  return;
}

core.setOutput("bundleSizeMap", sizeMap);
core.setOutput("bundleSizeStr", bundleSizeOutput);

// fs.writeFileSync(path.join(approotdir.get(), "bundle-report.html"), commentMsg);

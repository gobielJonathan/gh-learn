const fs = require("fs");
const path = require("path");
const bundler = require("./utils");
const approotdir = require("app-root-dir");
const core = require("@actions/core");

const filename = "bundle-size-report.txt";

const result = fs.readFileSync(path.join(approotdir.get(), filename), "utf-8");

const { bundleSizeOutput } = bundler.readReportsText(result);

const sizeMap = bundler.getSizeMap(bundleSizeOutput);

console.log({sizeMap})

if (!sizeMap) {
  core.setFailed(
    "💥 Failed to generate `sizeMap` from `npx @wpe-tkpd/bundlesize` output"
  );
}

core.setOutput("bundleSizeMap", sizeMap);
core.setOutput("bundleSizeStr", bundleSizeOutput);

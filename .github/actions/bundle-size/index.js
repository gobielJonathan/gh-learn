const fs = require("fs");
const path = require("path");
const bundler = require("./utils");
const approotdir = require("app-root-dir");
const core = require("@actions/core");

const filename = "bundle-size-report.txt";

const result = fs.readFileSync(path.join(approotdir.get(), filename), "utf-8");

const { bundleSizeOutput, bundleSizeFailed, possibleErrorMessage } =
  bundler.readReportsText(result);

core.setOutput("config", {
  bundleSizeOutput,
  bundleSizeFailed,
  possibleErrorMessage,
});

// fs.writeFileSync(path.join(approotdir.get(), "bundle-report.html"), commentMsg);

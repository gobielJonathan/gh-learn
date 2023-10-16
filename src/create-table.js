import fs from "fs";
import path from "path";
import * as bundler from "./bundle-size";
import approotdir from "app-root-dir";

const filename = "bundle-size-report.txt";

const result = fs.readFileSync(path.join(approotdir.get(), filename), "utf-8");

const { bundleSizeOutput, bundleSizeFailed, possibleErrorMessage } =
  bundler.readReportsText(result);

const sizeMap = bundler.getSizeMap(bundleSizeOutput);

const commentMsg = bundler.constructCommentMessage(bundleSizeOutput, sizeMap);
console.log(commentMsg);
// fs.writeFileSync(path.join(approotdir.get(), "bundle-report.html"), commentMsg);

const bundler = require("./utils");
const core = require("@actions/core");

const bundleSizeOutput = core.getInput("bundle-size-output");

const sizeMap = bundler.getSizeMap(bundleSizeOutput);

const commentMsg = bundler.constructCommentMessage(bundleSizeOutput, sizeMap);
core.setOutput("report", commentMsg);

// fs.writeFileSync(path.join(approotdir.get(), "bundle-report.html"), commentMsg);

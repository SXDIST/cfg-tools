#!/usr/bin/env node

import { execFileSync } from "node:child_process";

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options,
  }).trim();
}

function runStreaming(command, args) {
  execFileSync(command, args, {
    stdio: "inherit",
    encoding: "utf8",
  });
}

function fail(message) {
  console.error(`release: ${message}`);
  process.exit(1);
}

function printHelp() {
  console.log(`Usage:
  npm run release -- <patch|minor|major|X.Y.Z> [--no-push]

Examples:
  npm run release -- patch
  npm run release -- minor
  npm run release -- major
  npm run release -- 2.1.0
  npm run release -- 2.1.0 --no-push

What the script does:
  1. Verifies the git working tree is clean
  2. Bumps package.json version via npm version
  3. Creates a commit and git tag vX.Y.Z
  4. Pushes the current branch and tags to origin

Notes:
  - Run this from the branch you want to release, typically main
  - Use --no-push if you want to inspect the commit and tag first
`);
}

const rawArgs = process.argv.slice(2);

if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
  printHelp();
  process.exit(0);
}

const positionalArgs = rawArgs.filter((arg) => !arg.startsWith("--"));
const noPush = rawArgs.includes("--no-push");
const releaseType = positionalArgs[0];

if (!releaseType) {
  printHelp();
  process.exit(1);
}

const allowedBumps = new Set(["patch", "minor", "major"]);
const exactVersionPattern = /^\d+\.\d+\.\d+$/;

if (!allowedBumps.has(releaseType) && !exactVersionPattern.test(releaseType)) {
  fail(
    `invalid release target "${releaseType}". Use patch, minor, major, or an exact version like 2.1.0.`,
  );
}

const status = run("git", ["status", "--porcelain"]);
if (status) {
  fail("working tree is not clean. Commit or stash changes before releasing.");
}

const currentBranch = run("git", ["branch", "--show-current"]);
if (!currentBranch) {
  fail("could not determine current git branch.");
}

const currentVersion = run("node", ["-p", "require('./package.json').version"]);

console.log(`release: current branch ${currentBranch}`);
console.log(`release: current version ${currentVersion}`);
console.log(`release: requested ${releaseType}`);

try {
  run("git", ["rev-parse", "--verify", `refs/tags/v${releaseType}`]);
  if (exactVersionPattern.test(releaseType)) {
    fail(`tag v${releaseType} already exists.`);
  }
} catch {
  // Tag does not exist, which is what we want.
}

runStreaming("npm", ["version", releaseType, "-m", "release: v%s"]);

const nextVersion = run("node", ["-p", "require('./package.json').version"]);
console.log(`release: bumped to ${nextVersion}`);

if (noPush) {
  console.log("release: skipping push because --no-push was provided");
  process.exit(0);
}

runStreaming("git", ["push", "origin", currentBranch, "--follow-tags"]);
console.log(`release: pushed ${currentBranch} and tag v${nextVersion} to origin`);

import { test } from "node:test";
import assert from "node:assert/strict";
import { SHELL_IDENTITY_FILES, renameShellIdentity } from "./shell-identity.mjs";

const rename = (path, text) => renameShellIdentity(path, text, "indiecrafts", "acme");

test("covers every file that carries the shell identity", () => {
  assert.deepEqual(SHELL_IDENTITY_FILES, [
    "shell.json",
    "android/app/build.gradle",
    "android/app/src/main/res/values/strings.xml",
    "android/app/src/main/AndroidManifest.xml",
    "ios/App/App.xcodeproj/project.pbxproj",
    "ios/App/App/Info.plist",
  ]);
});

test("shell.json: app id, name and scheme", () => {
  assert.equal(
    rename(
      "shell.json",
      `{ "appId": "dev.indiecrafts.app", "appName": "indiecrafts", "scheme": "indiecrafts" }`,
    ),
    `{ "appId": "dev.acme.app", "appName": "acme", "scheme": "acme" }`,
  );
});

test("android: applicationId changes, the Java namespace does not", () => {
  const gradle = `    namespace = "dev.indiecrafts.app"\n        applicationId "dev.indiecrafts.app"`;
  assert.equal(
    rename("android/app/build.gradle", gradle),
    `    namespace = "dev.indiecrafts.app"\n        applicationId "dev.acme.app"`,
  );
});

test("android strings.xml: label, title, package and scheme", () => {
  const xml = [
    `<string name="app_name">indiecrafts</string>`,
    `<string name="title_activity_main">indiecrafts</string>`,
    `<string name="package_name">dev.indiecrafts.app</string>`,
    `<string name="custom_url_scheme">dev.indiecrafts.app</string>`,
  ].join("\n");
  assert.doesNotMatch(
    rename("android/app/src/main/res/values/strings.xml", xml),
    /indiecrafts/,
  );
});

test("android manifest deep-link scheme", () => {
  assert.equal(
    rename(
      "android/app/src/main/AndroidManifest.xml",
      `<data android:scheme="indiecrafts" />`,
    ),
    `<data android:scheme="acme" />`,
  );
});

test("ios: bundle id in the Xcode project, display name + scheme in Info.plist", () => {
  assert.equal(
    rename(
      "ios/App/App.xcodeproj/project.pbxproj",
      "PRODUCT_BUNDLE_IDENTIFIER = dev.indiecrafts.app;",
    ),
    "PRODUCT_BUNDLE_IDENTIFIER = dev.acme.app;",
  );
  assert.equal(
    rename("ios/App/App/Info.plist", "<string>indiecrafts</string>"),
    "<string>acme</string>",
  );
});

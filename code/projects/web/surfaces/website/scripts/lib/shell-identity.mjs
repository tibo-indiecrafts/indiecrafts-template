/**
 * Rewrite the Capacitor shell's app identity (id, name, URL scheme) for a client rename.
 *
 * @see docs/reference/projects/web/website/scripts/lib/shell-identity.md
 */

/**
 * Every shell file (relative to `code/projects/mobile/surfaces/main`) that carries the
 * identity. `cap sync` does NOT copy `appId` into the native projects, so each one is
 * rewritten here. The Android Java `namespace` stays: `applicationId` is independent of it.
 */
export const SHELL_IDENTITY_FILES = [
  "shell.json",
  "android/app/build.gradle",
  "android/app/src/main/res/values/strings.xml",
  "android/app/src/main/AndroidManifest.xml",
  "ios/App/App.xcodeproj/project.pbxproj",
  "ios/App/App/Info.plist",
];

/** The substitutions per file, for a `prefix` → `slug` rename (both alphanumeric). */
function subsFor(path, prefix, slug) {
  const P = prefix;
  switch (path) {
    case "shell.json":
      return [
        [new RegExp(`"dev\\.${P}\\.`, "g"), `"dev.${slug}.`],
        [new RegExp(`("(?:appName|scheme)":\\s*)"${P}"`, "g"), `$1"${slug}"`],
      ];
    case "android/app/build.gradle":
      return [[new RegExp(`(applicationId\\s+)"dev\\.${P}\\.`, "g"), `$1"dev.${slug}.`]];
    case "android/app/src/main/res/values/strings.xml":
      return [
        [new RegExp(`>dev\\.${P}\\.`, "g"), `>dev.${slug}.`],
        [new RegExp(`>${P}<`, "g"), `>${slug}<`],
      ];
    case "android/app/src/main/AndroidManifest.xml":
      return [[new RegExp(`android:scheme="${P}"`, "g"), `android:scheme="${slug}"`]];
    case "ios/App/App.xcodeproj/project.pbxproj":
      return [
        [
          new RegExp(`(PRODUCT_BUNDLE_IDENTIFIER = )dev\\.${P}\\.`, "g"),
          `$1dev.${slug}.`,
        ],
      ];
    case "ios/App/App/Info.plist":
      return [[new RegExp(`<string>${P}</string>`, "g"), `<string>${slug}</string>`]];
    default:
      throw new Error(`renameShellIdentity: unknown shell file "${path}"`);
  }
}

/** Apply the `prefix` → `slug` identity rename to one shell file's text. Pure. */
export function renameShellIdentity(path, text, prefix, slug) {
  let out = text;
  for (const [re, rep] of subsFor(path, prefix, slug)) out = out.replace(re, rep);
  return out;
}

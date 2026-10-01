import { describe, expect, it } from "vitest";
import { splitScripts } from "./split-scripts";

describe("splitScripts", () => {
  it("leaves script-free HTML untouched", () => {
    expect(splitScripts('<div id="w"></div>')).toEqual({
      html: '<div id="w"></div>',
      scripts: [],
    });
  });

  it("lifts an external script out with its attributes", () => {
    const { html, scripts } = splitScripts(
      '<div id="w"></div><script async src="https://cdn.example/w.js" data-uid="42" crossorigin="anonymous"></script>',
    );
    expect(html).toBe('<div id="w"></div>');
    expect(scripts).toEqual([
      {
        attrs: {
          async: true,
          src: "https://cdn.example/w.js",
          "data-uid": "42",
          crossorigin: "anonymous",
        },
        code: "",
      },
    ]);
  });

  it("lifts an inline script with its code, in order, any case and quoting", () => {
    const { html, scripts } = splitScripts(
      "<p>a</p><SCRIPT type='text/javascript'>window.a = 1;</SCRIPT><p>b</p><script>\nwindow.b = '<b>';\n</script>",
    );
    expect(html).toBe("<p>a</p><p>b</p>");
    expect(scripts).toEqual([
      { attrs: { type: "text/javascript" }, code: "window.a = 1;" },
      { attrs: {}, code: "\nwindow.b = '<b>';\n" },
    ]);
  });

  it("drops an empty script tag", () => {
    expect(splitScripts("<script></script><p>x</p>")).toEqual({
      html: "<p>x</p>",
      scripts: [],
    });
  });
});

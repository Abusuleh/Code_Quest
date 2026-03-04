import { describe, expect, it } from "vitest";
import { checkWebSuccess } from "@/lib/lesson-success";

describe("checkWebSuccess", () => {
  it("returns true when required HTML snippet is present", () => {
    expect(checkWebSuccess("<h1>Hello</h1>", "", "", "hasHTML:<h1>")).toBe(true);
  });

  it("returns false when required HTML snippet is missing", () => {
    expect(checkWebSuccess("<p>Hello</p>", "", "", "hasHTML:<h1>")).toBe(false);
  });

  it("returns true when required CSS snippet is present", () => {
    expect(checkWebSuccess("", "body { color: red; }", "", "hasCSS:color")).toBe(true);
  });

  it("returns true when required JS snippet is present", () => {
    expect(checkWebSuccess("", "", "document.querySelector('h1')", "hasJS:querySelector")).toBe(
      true,
    );
  });

  it("returns true only when ALL conditions are satisfied", () => {
    const html = "<div class=\"card\"></div>";
    const css = ".card { padding: 12px; }";
    const js = "document.querySelector('.card')";
    expect(
      checkWebSuccess(html, css, js, "hasHTML:card|hasCSS:padding|hasJS:querySelector"),
    ).toBe(true);
    expect(
      checkWebSuccess(html, css, js, "hasHTML:card|hasCSS:gap|hasJS:querySelector"),
    ).toBe(false);
  });

  it("returns true for empty condition string", () => {
    expect(checkWebSuccess("", "", "", "")).toBe(true);
  });
});

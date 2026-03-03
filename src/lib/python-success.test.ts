import { describe, expect, it } from "vitest";
import { checkPythonSuccess } from "@/lib/lesson-success";

describe("checkPythonSuccess", () => {
  it("returns true when code contains required keyword", () => {
    expect(checkPythonSuccess("print('hi')", "hasPython:print")).toBe(true);
  });

  it("returns false when code missing required keyword", () => {
    expect(checkPythonSuccess("x = 5", "hasPython:print")).toBe(false);
  });

  it("handles pipe-separated multiple conditions", () => {
    expect(
      checkPythonSuccess("print(input())", "hasPython:print|hasPython:input"),
    ).toBe(true);
  });

  it("returns false if one of multiple conditions is missing", () => {
    expect(checkPythonSuccess("print('hi')", "hasPython:print|hasPython:input")).toBe(
      false,
    );
  });

  it("is case-sensitive", () => {
    expect(checkPythonSuccess("Print('hi')", "hasPython:print")).toBe(false);
  });

  it("returns true for empty successCondition", () => {
    expect(checkPythonSuccess("", "")).toBe(true);
  });
});

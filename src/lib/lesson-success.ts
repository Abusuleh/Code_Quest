/**
 * Checks whether a Blockly workspace XML string satisfies a lesson's success condition.
 *
 * successCondition format: pipe-separated checks, e.g.
 * "hasBlock:motion_movesteps|hasBlock:control_repeat"
 *
 * Supported check types:
 *   hasBlock:<blockType>  - workspace XML must contain type="<blockType>"
 *
 * An empty condition string means no requirement - returns true.
 * An empty XML string fails any hasBlock requirement.
 */
export function checkSuccessCondition(workspaceXml: string, condition: string): boolean {
  if (!condition || condition.trim() === "") return true;

  const checks = condition.split("|");

  return checks.every((check) => {
    const [type, value] = check.split(":");
    if (type === "hasBlock") {
      return workspaceXml.includes(`type="${value}"`);
    }
    return false;
  });
}

/**
 * Checks whether a Python code string satisfies a lesson's success condition.
 *
 * successCondition format: pipe-separated checks, e.g.
 * "hasPython:print|hasPython:input"
 *
 * Supported check types:
 *   hasPython:<keyword>  - code must include the keyword substring
 *
 * An empty condition string means no requirement - returns true.
 */
export function checkPythonSuccess(code: string, condition: string): boolean {
  if (!condition || condition.trim() === "") return true;

  const checks = condition.split("|");

  return checks.every((check) => {
    const [type, value] = check.split(":");
    if (type === "hasPython") {
      return code.includes(value);
    }
    return false;
  });
}

/**
 * Checks whether HTML/CSS/JS code satisfies a lesson's success condition.
 *
 * successCondition format: pipe-separated checks, e.g.
 * "hasHTML:<div|hasCSS:color|hasJS:querySelector"
 *
 * Supported check types:
 *   hasHTML:<snippet> - HTML must include the snippet
 *   hasCSS:<snippet>  - CSS must include the snippet
 *   hasJS:<snippet>   - JS must include the snippet
 *
 * An empty condition string means no requirement - returns true.
 */
export function checkWebSuccess(html: string, css: string, js: string, condition: string): boolean {
  if (!condition || condition.trim() === "") return true;

  const checks = condition.split("|");

  return checks.every((check) => {
    const [type, value] = check.split(":");
    if (type === "hasHTML") {
      return html.includes(value);
    }
    if (type === "hasCSS") {
      return css.includes(value);
    }
    if (type === "hasJS") {
      return js.includes(value);
    }
    return false;
  });
}

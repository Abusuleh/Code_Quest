/**
 * Checks whether a Blockly workspace XML string satisfies a lesson's success condition.
 *
 * successCondition format: pipe-separated checks, e.g.
 * "hasBlock:motion_movesteps|hasBlock:control_repeat"
 *
 * Supported check types:
 *   hasBlock:<blockType>  — workspace XML must contain type="<blockType>"
 *
 * An empty condition string means no requirement — returns true.
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

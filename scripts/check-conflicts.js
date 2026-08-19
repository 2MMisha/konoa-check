const fs = require("fs");
const path = require("path");

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function parsePayload(body) {
  const m = body.match(/```json\s*([\s\S]*?)```/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return null; }
}

module.exports = async ({ github, context, core }) => {
  const issue = context.payload.issue;
  const payload = parsePayload(issue.body || "");
  if (!payload) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: "⚠️ לא הצלחתי לקרוא את פרטי הבקשה (בעיה טכנית בפורמט). המנהל יבדוק ידנית."
    });
    return;
  }

  const inventory = JSON.parse(fs.readFileSync(path.join(process.env.GITHUB_WORKSPACE, "data/inventory.json"), "utf8"));
  const bookings = JSON.parse(fs.readFileSync(path.join(process.env.GITHUB_WORKSPACE, "data/bookings.json"), "utf8"));

  const start = new Date(payload.pickup).getTime();
  const end = new Date(payload.return).getTime();

  const lines = payload.items.map(item => {
    const total = inventory[item.id] ?? 0;
    let reserved = 0;
    for (const b of bookings) {
      const bStart = new Date(b.pickup).getTime();
      const bEnd = new Date(b.return).getTime();
      if (!rangesOverlap(start, end, bStart, bEnd)) continue;
      const line = (b.items || []).find(i => i.id === item.id);
      if (line) reserved += line.qty || 1;
    }
    const available = total - reserved;
    const ok = available >= (item.qty || 1);
    return `${ok ? "✅" : "⚠️"} ${item.name}${item.qty > 1 ? " ×" + item.qty : ""} — זמין: ${Math.max(0, available)} מתוך ${total}`;
  });

  const anyProblem = lines.some(l => l.startsWith("⚠️"));

  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issue.number,
    body: [
      "🤖 בדיקת זמינות אוטומטית (למידע בלבד — האישור הסופי אצל המנהל):",
      "",
      lines.join("\n"),
      "",
      anyProblem
        ? "⚠️ ייתכן חוסר זמינות בחלק מהפריטים בתאריכים המבוקשים."
        : "✅ אין התנגשות ידועה בתאריכים המבוקשים."
    ].join("\n")
  });
};

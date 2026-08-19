const fs = require("fs");
const path = require("path");

const BOOKINGS_PATH = path.join(process.env.GITHUB_WORKSPACE, "data/bookings.json");
const HISTORY_PATH = path.join(process.env.GITHUB_WORKSPACE, "data/history.json");

function parsePayload(body) {
  const m = (body || "").match(/```json\s*([\s\S]*?)```/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return null; }
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

module.exports = async ({ github, context, core }) => {
  const label = context.payload.label.name;
  const issue = context.payload.issue;
  const sender = context.payload.sender.login;

  if (!["approved", "rejected", "returned"].includes(label)) {
    core.setOutput("changed", "false");
    return;
  }

  const adminLoginsRaw = process.env.ADMIN_GITHUB_LOGINS || "";
  const adminLogins = adminLoginsRaw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

  if (adminLogins.length === 0 || !adminLogins.includes(sender.toLowerCase())) {
    // פעולה לא מורשית — נראה שמישהו שאינו מנהל הצליח להוסיף תווית סטטוס.
    // מאפסים בחזרה ל-pending ומתריעים.
    await github.rest.issues.setLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      labels: ["pending"]
    });
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: `⚠️ זוהתה פעולה לא מורשית (סימון "${label}" על ידי @${sender}, שאינו ברשימת המנהלים) — היא בוטלה אוטומטית.`
    });
    core.setOutput("changed", "false");
    return;
  }

  const payload = parsePayload(issue.body);

  if (label === "rejected") {
    await github.rest.issues.createComment({
      owner: context.repo.owner, repo: context.repo.repo, issue_number: issue.number,
      body: "❌ הבקשה נדחתה על ידי הצוות."
    });
    await github.rest.issues.update({
      owner: context.repo.owner, repo: context.repo.repo, issue_number: issue.number,
      state: "closed", state_reason: "not_planned"
    });
    core.setOutput("changed", "false");
    return;
  }

  if (label === "approved") {
    if (!payload) {
      await github.rest.issues.createComment({
        owner: context.repo.owner, repo: context.repo.repo, issue_number: issue.number,
        body: "⚠️ לא ניתן היה לקרוא את פרטי הבקשה כדי לרשום אותה במלאי. יש לבדוק ידנית."
      });
      core.setOutput("changed", "false");
      return;
    }
    const bookings = readJson(BOOKINGS_PATH);
    bookings.push({
      issueNumber: issue.number,
      studentKey: payload.studentKey,
      name: payload.name,
      class: payload.class,
      phone: payload.phone,
      pickup: payload.pickup,
      return: payload.return,
      items: payload.items,
      status: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: sender
    });
    writeJson(BOOKINGS_PATH, bookings);

    await github.rest.issues.createComment({
      owner: context.repo.owner, repo: context.repo.repo, issue_number: issue.number,
      body: "✅ הבקשה אושרה! ניתן לאסוף את הציוד במועד שנקבע. בסיום — יש להחזיר ולעדכן את הצוות."
    });
    core.setOutput("changed", "true");
    return;
  }

  if (label === "returned") {
    const bookings = readJson(BOOKINGS_PATH);
    const idx = bookings.findIndex(b => b.issueNumber === issue.number);
    let entry = idx >= 0 ? bookings[idx] : null;
    if (idx >= 0) bookings.splice(idx, 1);
    writeJson(BOOKINGS_PATH, bookings);

    const history = readJson(HISTORY_PATH);
    history.push({
      ...(entry || { issueNumber: issue.number }),
      status: "returned",
      returnedAt: new Date().toISOString(),
      returnedBy: sender
    });
    writeJson(HISTORY_PATH, history);

    await github.rest.issues.createComment({
      owner: context.repo.owner, repo: context.repo.repo, issue_number: issue.number,
      body: "📦 נרשם שהציוד הוחזר. תודה!"
    });
    await github.rest.issues.update({
      owner: context.repo.owner, repo: context.repo.repo, issue_number: issue.number,
      state: "closed", state_reason: "completed"
    });
    core.setOutput("changed", "true");
    return;
  }
};

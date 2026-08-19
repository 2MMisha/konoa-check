// עטיפה דקה סביב GitHub REST API — נקראת ישירות מהדפדפן (הריפו של GitHub
// תומך ב-CORS לבקשות כאלה). כל פעולה שדורשת הרשאת כתיבה מקבלת טוקן משלה.

const GH_API = "https://api.github.com";

function ghHeaders(token) {
  return {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { "Authorization": "Bearer " + token } : {})
  };
}

async function ghRequest(path, { method = "GET", token, body } = {}) {
  const res = await fetch(GH_API + path, {
    method,
    headers: {
      ...ghHeaders(token),
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).message || ""; } catch (e) {}
    throw new Error(`GitHub API ${method} ${path} נכשל (${res.status}) ${detail}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function repoPath(p) {
  return `/repos/${GITHUB_OWNER}/${GITHUB_REPO}${p}`;
}

async function createRequestIssue(token, { title, body }) {
  return ghRequest(repoPath("/issues"), {
    method: "POST",
    token,
    body: { title, body, labels: ["pending"] }
  });
}

async function listIssuesByLabel(token, label, state = "open") {
  return ghRequest(repoPath(`/issues?labels=${encodeURIComponent(label)}&state=${state}&per_page=100`), { token });
}

async function getIssue(token, number) {
  return ghRequest(repoPath(`/issues/${number}`), { token });
}

async function setIssueLabels(token, number, labels) {
  return ghRequest(repoPath(`/issues/${number}/labels`), {
    method: "PUT",
    token,
    body: { labels }
  });
}

// מוסיף תוויות בלי למחוק תוויות קיימות (בשונה מ-setIssueLabels).
async function addIssueLabels(token, number, labels) {
  return ghRequest(repoPath(`/issues/${number}/labels`), {
    method: "POST",
    token,
    body: { labels }
  });
}

async function createIssueComment(token, number, body) {
  return ghRequest(repoPath(`/issues/${number}/comments`), {
    method: "POST",
    token,
    body: { body }
  });
}

async function searchMyIssues(token, studentKey) {
  const q = encodeURIComponent(`repo:${GITHUB_OWNER}/${GITHUB_REPO} in:body "studentKey:${studentKey}"`);
  return ghRequest(`/search/issues?q=${q}&per_page=100`, { token });
}

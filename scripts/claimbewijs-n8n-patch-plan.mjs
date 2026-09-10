import fs from "node:fs";
import path from "node:path";

const backupDir = path.join("n8n", "live-backups", "claimbewijs");
const targetBaseUrl = process.env.EA_SAAS_BASE_URL ?? "https://claimbewijs.elhoucineautomation.nl";
const oldBaseUrl = "https://ea-claimbewijs-ai.wiskundehv.chatgpt.site";

const v1Names = [
  "EA ClaimBewijs AI - Claimrisico intake",
  "EA ClaimBewijs AI - Bewijs upload",
  "EA ClaimBewijs AI - Bewijs validatie",
  "EA ClaimBewijs AI - Claimextractie",
  "EA ClaimBewijs AI - PDF claimrapport en adviesmail",
  "EA ClaimBewijs AI - Portaal dossier sync",
  "EA ClaimBewijs AI - Betaalde toegang activeren",
];

const manifest = JSON.parse(fs.readFileSync(path.join(backupDir, "manifest.json"), "utf8"));
const plan = [];

for (const workflow of manifest.workflows.filter((item) => v1Names.includes(item.name))) {
  const fullPath = path.join(backupDir, workflow.file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const changes = [];

  for (const node of data.nodes ?? []) {
    if (node.type !== "n8n-nodes-base.httpRequest") continue;
    const currentUrl = node.parameters?.url;
    if (typeof currentUrl === "string" && currentUrl.startsWith(oldBaseUrl)) {
      const nextUrl = currentUrl.replace(`${oldBaseUrl}/api/n8n`, `${targetBaseUrl}/api/n8n/claimbewijs`);
      changes.push({
        node: node.name,
        from: currentUrl,
        to: nextUrl,
        addHeader: "x-ea-signature",
      });
    }
  }

  plan.push({
    id: workflow.id,
    name: workflow.name,
    active: workflow.active,
    changes,
  });
}

fs.writeFileSync(
  path.join("docs", "claimbewijs-n8n-patch-plan.json"),
  JSON.stringify({ targetBaseUrl, generatedAt: new Date().toISOString(), workflows: plan }, null, 2)
);

console.log(`Patchplan geschreven voor ${plan.length} workflows.`);

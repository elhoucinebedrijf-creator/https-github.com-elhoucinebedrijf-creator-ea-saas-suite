import fs from "node:fs";

const shouldApply = process.argv.includes("--apply");
const targetBaseUrl = process.env.EA_SAAS_BASE_URL ?? "https://claimbewijs.elhoucineautomation.nl";
const oldBaseUrl = "https://ea-claimbewijs-ai.wiskundehv.chatgpt.site";
const backupDir = "n8n/live-backups/claimbewijs";
const manifestPath = `${backupDir}/manifest.json`;

const v1Names = new Set([
  "EA ClaimBewijs AI - Claimrisico intake",
  "EA ClaimBewijs AI - Bewijs upload",
  "EA ClaimBewijs AI - Bewijs validatie",
  "EA ClaimBewijs AI - Claimextractie",
  "EA ClaimBewijs AI - PDF claimrapport en adviesmail",
  "EA ClaimBewijs AI - Portaal dossier sync",
  "EA ClaimBewijs AI - Betaalde toegang activeren",
]);

function readEnv() {
  const txt = fs.readFileSync(".env.local", "utf8");
  return Object.fromEntries(
    txt
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1).trim().replace(/^[ '"]+|[ '"]+$/g, "")];
      })
  );
}

function addSignatureHeader(node) {
  node.parameters.sendHeaders = true;
  node.parameters.headerParameters ??= { parameters: [] };
  node.parameters.headerParameters.parameters ??= [];

  const headers = node.parameters.headerParameters.parameters;
  const existing = headers.find((header) => String(header.name).toLowerCase() === "x-ea-signature");
  if (existing) {
    existing.value = "={{$env.N8N_SHARED_SECRET}}";
    return;
  }

  headers.push({ name: "x-ea-signature", value: "={{$env.N8N_SHARED_SECRET}}" });
}

function updateWorkflow(workflow) {
  let changed = false;
  for (const node of workflow.nodes ?? []) {
    if (node.type !== "n8n-nodes-base.httpRequest") continue;
    const url = node.parameters?.url;
    if (typeof url !== "string" || !url.startsWith(oldBaseUrl)) continue;
    node.parameters.url = url.replace(`${oldBaseUrl}/api/n8n`, `${targetBaseUrl}/api/n8n/claimbewijs`);
    addSignatureHeader(node);
    changed = true;
  }
  return changed;
}

function toUpdatePayload(workflow) {
  return {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings ?? {},
    staticData: workflow.staticData ?? null,
  };
}

async function main() {
  const env = readEnv();
  const base = env.N8N_BASE_URL?.replace(/\/$/, "");
  if (!base || !env.N8N_API_KEY) {
    throw new Error("N8N_BASE_URL en N8N_API_KEY zijn verplicht.");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const targets = manifest.workflows.filter((workflow) => v1Names.has(workflow.name));
  const changedWorkflows = [];

  for (const item of targets) {
    const workflow = JSON.parse(fs.readFileSync(`${backupDir}/${item.file}`, "utf8"));
    const changed = updateWorkflow(workflow);
    if (!changed) continue;
    changedWorkflows.push(workflow.name);

    if (shouldApply) {
      const response = await fetch(`${base}/api/v1/workflows/${workflow.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-N8N-API-KEY": env.N8N_API_KEY,
        },
        body: JSON.stringify(toUpdatePayload(workflow)),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${workflow.name} update failed: ${response.status} ${text.slice(0, 200)}`);
      }
    }
  }

  console.log(`${shouldApply ? "Applied" : "Dry-run"} ClaimBewijs patch for ${changedWorkflows.length} workflows.`);
  for (const name of changedWorkflows) console.log(`- ${name}`);
  if (!shouldApply) console.log("Run opnieuw met --apply na expliciet akkoord voor live wijzigingen.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

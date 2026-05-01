#!/usr/bin/env node
/**
 * GitHub Auto-Sync Script
 * Syncs changed files to GitHub after each git commit.
 * Called automatically by .git/hooks/post-commit
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const OWNER = 'iqbalhimel005';
const REPO = 'aloromela';
const API = 'https://api.github.com';
const STATE_FILE = path.join(process.cwd(), '.local', '.github-sync-sha');
const CONCURRENCY = 6;

if (!TOKEN) {
  console.error('[github-sync] GITHUB_PERSONAL_ACCESS_TOKEN not set. Skipping sync.');
  process.exit(0);
}

async function ghFetch(endpoint, method = 'GET', body = null, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const opts = {
      method,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
    };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(`${API}${endpoint}`, opts);
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = { raw: text }; }
      if ((res.status === 502 || res.status === 503) && attempt < retries) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      if (!res.ok) throw new Error(`GitHub API ${res.status} on ${endpoint}: ${JSON.stringify(json).substring(0, 300)}`);
      return json;
    } catch (e) {
      if (attempt < retries) { await new Promise(r => setTimeout(r, 1500)); continue; }
      throw e;
    }
  }
}

async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  const errors = [];
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      try {
        results[i] = await tasks[i]();
      } catch (e) {
        errors.push({ i, error: e.message });
        results[i] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return { results: results.filter(Boolean), errors };
}

function readStateFile() {
  try {
    return fs.readFileSync(STATE_FILE, 'utf-8').trim();
  } catch {
    return null;
  }
}

function writeStateFile(sha) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_FILE, sha, 'utf-8');
}

async function main() {
  console.log('[github-sync] Starting sync...');

  const currentSha = execSync('git rev-parse HEAD').toString().trim();
  const lastSyncedSha = readStateFile();

  if (lastSyncedSha === currentSha) {
    console.log('[github-sync] Already up to date. Nothing to sync.');
    return;
  }

  // Get list of changed files
  let changedFiles = [];
  let deletedFiles = [];

  if (lastSyncedSha) {
    try {
      // Files changed between last sync and HEAD
      const diffOutput = execSync(`git diff --name-status ${lastSyncedSha} ${currentSha}`)
        .toString().trim();
      
      if (diffOutput) {
        for (const line of diffOutput.split('\n')) {
          const [status, ...fileParts] = line.split('\t');
          const filePath = fileParts[fileParts.length - 1];
          if (status.startsWith('D')) {
            deletedFiles.push(filePath);
          } else {
            // A, M, R, C — add/modify/rename/copy
            changedFiles.push(filePath);
          }
        }
      }
    } catch {
      // If diff fails, sync all tracked files
      console.log('[github-sync] Could not diff, syncing all files...');
      changedFiles = execSync('git ls-files').toString().trim().split('\n').filter(Boolean);
    }
  } else {
    // First sync — upload all tracked files
    console.log('[github-sync] First sync — uploading all tracked files...');
    changedFiles = execSync('git ls-files').toString().trim().split('\n').filter(Boolean);
  }

  // Filter out non-existent files from changedFiles
  changedFiles = changedFiles.filter(f => {
    try { fs.accessSync(f); return true; } catch { return false; }
  });

  console.log(`[github-sync] Changed: ${changedFiles.length} file(s), Deleted: ${deletedFiles.length} file(s)`);

  if (changedFiles.length === 0 && deletedFiles.length === 0) {
    console.log('[github-sync] No file changes to sync.');
    writeStateFile(currentSha);
    return;
  }

  // Get current GitHub repo state
  const refData = await ghFetch(`/repos/${OWNER}/${REPO}/git/refs/heads/main`);
  const githubCommitSha = refData.object.sha;
  const githubCommit = await ghFetch(`/repos/${OWNER}/${REPO}/git/commits/${githubCommitSha}`);
  const baseTreeSha = githubCommit.tree.sha;

  // Create blobs for changed files
  const treeItems = [];

  if (changedFiles.length > 0) {
    const tasks = changedFiles.map(filePath => async () => {
      const content = fs.readFileSync(filePath);
      const isText = !content.slice(0, 8000).includes(0);
      const blobData = isText
        ? { content: content.toString('utf-8'), encoding: 'utf-8' }
        : { content: content.toString('base64'), encoding: 'base64' };
      const blob = await ghFetch(`/repos/${OWNER}/${REPO}/git/blobs`, 'POST', blobData);
      return { path: filePath, mode: '100644', type: 'blob', sha: blob.sha };
    });

    const { results, errors } = await runWithConcurrency(tasks, CONCURRENCY);
    treeItems.push(...results);
    if (errors.length > 0) {
      console.warn(`[github-sync] ${errors.length} blob error(s):`);
      errors.slice(0, 3).forEach(e => console.warn(`  ${e.error}`));
    }
  }

  // Mark deleted files as null (removes from tree)
  for (const filePath of deletedFiles) {
    treeItems.push({ path: filePath, mode: '100644', type: 'blob', sha: null });
  }

  // Create new tree
  const tree = await ghFetch(`/repos/${OWNER}/${REPO}/git/trees`, 'POST', {
    base_tree: baseTreeSha,
    tree: treeItems,
  });

  // Get commit message from local git
  const localMessage = execSync(`git log -1 --pretty=%B ${currentSha}`).toString().trim();

  // Create commit on GitHub
  const commit = await ghFetch(`/repos/${OWNER}/${REPO}/git/commits`, 'POST', {
    message: localMessage || `sync: ${currentSha.substring(0, 8)}`,
    tree: tree.sha,
    parents: [githubCommitSha],
  });

  // Update main branch ref
  await ghFetch(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, 'PATCH', {
    sha: commit.sha,
    force: true,
  });

  writeStateFile(currentSha);
  console.log(`[github-sync] ✅ Synced ${changedFiles.length} changed + ${deletedFiles.length} deleted → https://github.com/${OWNER}/${REPO} (${commit.sha.substring(0, 8)})`);
}

main().catch(e => {
  console.error('[github-sync] Error:', e.message);
  process.exit(0); // Don't block git commit on sync failure
});

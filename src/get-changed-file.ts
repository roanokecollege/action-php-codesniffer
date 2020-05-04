import { spawn } from 'child_process';
import { createInterface } from 'readline';
import { existsSync } from 'fs';

import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';
import { isMatch } from 'micromatch';

interface ChangedFiles {
  added: string[];
  modified: string[];
}

async function getChangedFilesFromGitHub(
  token: string,
  filesGlobs: string[]
): Promise<ChangedFiles> {
  return { added: [], modified: [] };
}

export async function getChangedFiles(): Promise<ChangedFiles> {
  const pattern = core.getInput('files', {
    required: false,
  });
  const globs = pattern.length ? pattern.split(',') : ['*.php'];

  // check if we have a token
  const token = core.getInput('repo-token', {
    required: false,
  });
  if (token) return getChangedFilesFromGitHub(token, globs);

  const payload = github.context.payload as Webhooks.WebhookPayloadPullRequest;

  /*
    getting them from Git
    git diff-tree --no-commit-id --name-status --diff-filter=d -r ${{ github.event.pull_request.base.sha }}..${{ github.event.after }}
  */
  try {
    const git = spawn(
      'git',
      [
        '--no-pager',
        'diff-tree',
        '--no-commit-id',
        '--name-status',
        '--diff-filter=d', // we don't need deleted files
        '-r',
        `${payload.pull_request.base.sha}..`,
      ],
      {
        windowsHide: true,
        timeout: 5000,
      }
    );
    const readline = createInterface({
      input: git.stdout,
    });
    const result: ChangedFiles = {
      added: [],
      modified: [],
    };
    for await (const line of readline) {
      const parsed = /^(?<status>[ACMR])[\s\t]+(?<file>\S+)$/.exec(line);
      if (parsed?.groups) {
        const { status, file } = parsed.groups;
        // ensure file exists
        if (isMatch(file, globs) && existsSync(file)) {
          switch (status) {
            case 'A':
            case 'C':
            case 'R':
              result.added.push(file);
              break;

            case 'M':
              result.modified.push(file);
          }
        }
      }
    }
    return result;
  } catch (err) {
    console.error(err);
    return {
      added: [],
      modified: [],
    };
  }
}

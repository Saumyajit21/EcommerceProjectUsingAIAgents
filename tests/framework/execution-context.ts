import fs from 'node:fs';
import path from 'node:path';

const executionId = process.env.PLAYWRIGHT_EXECUTION_ID ?? createExecutionId();
process.env.PLAYWRIGHT_EXECUTION_ID = executionId;

export const reportsRoot = path.resolve('reports', executionId);
export const logsDirectory = path.join(reportsRoot, 'logs');
export const screenshotsDirectory = path.join(reportsRoot, 'screenshots');
export const htmlDirectory = path.join(reportsRoot, 'html');
export const eventsFile = path.join(reportsRoot, 'data', 'events.jsonl');
export const executionLogFile = path.join(logsDirectory, 'execution.log');

export function ensureExecutionDirectories(): void {
  for (const directory of [logsDirectory, screenshotsDirectory, htmlDirectory, path.dirname(eventsFile)]) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export function createExecutionId(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return `${timestamp}-${process.pid}`;
}

export function sanitizeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'unnamed';
}

import fs from 'node:fs';
import path from 'node:path';

const reportsDirectory = path.resolve('reports');
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function deleteHtmlReportsOlderThan(days = 2, now = Date.now()): number {
  if (!Number.isFinite(days) || days < 0) {
    throw new Error(`Report age must be a non-negative number of days. Received: ${days}`);
  }

  if (!fs.existsSync(reportsDirectory)) return 0;

  const cutoff = now - days * millisecondsPerDay;
  let deletedCount = 0;

  for (const entry of fs.readdirSync(reportsDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const htmlDirectory = path.join(reportsDirectory, entry.name, 'html');
    if (!fs.existsSync(htmlDirectory)) continue;

    const modifiedAt = fs.statSync(htmlDirectory).mtimeMs;
    if (modifiedAt < cutoff) {
      fs.rmSync(htmlDirectory, { recursive: true, force: true });
      deletedCount += 1;
    }
  }

  return deletedCount;
}

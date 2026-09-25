import fs from 'node:fs';
import path from 'node:path';
import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import {
  ensureExecutionDirectories,
  eventsFile,
  executionLogFile,
  htmlDirectory,
  reportsRoot,
} from './execution-context';
import { deleteHtmlReportsOlderThan } from './report-cleanup';

type StepEvent = {
  testId: string;
  suiteName: string;
  testName: string;
  stepNumber: number;
  stepName: string;
  status: 'passed' | 'failed';
  startedAt: string;
  endedAt: string;
  durationMs: number;
  screenshotPath?: string;
  error?: string;
  url?: string;
};

type TestSummary = {
  testId: string;
  suiteName: string;
  testName: string;
  status: string;
  startedAt?: string;
  endedAt?: string;
  durationMs: number;
  error?: string;
  steps: StepEvent[];
};

export default class ExecutionReportReporter implements Reporter {
  private tests = new Map<string, TestSummary>();

  onBegin(config: FullConfig, suite: Suite): void {
    const deletedReportCount = deleteHtmlReportsOlderThan(2);
    ensureExecutionDirectories();
    this.writeLog('INFO', `TEST RUN START: ${suite.allTests().length} test(s)`);
    this.writeLog('DEBUG', `WORKERS: ${config.workers}`);
    this.writeLog('DEBUG', `OLD HTML REPORTS DELETED: ${deletedReportCount}`);
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    const testId = test.id;
    this.tests.set(testId, {
      testId,
      suiteName: test.titlePath().slice(0, -1).join(' > ') || 'Playwright suite',
      testName: test.title,
      status: 'running',
      startedAt: result.startTime.toISOString(),
      durationMs: 0,
      steps: [],
    });
    this.writeLog('INFO', `TEST START: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const summary = this.tests.get(test.id) ?? {
      testId: test.id,
      suiteName: test.titlePath().slice(0, -1).join(' > ') || 'Playwright suite',
      testName: test.title,
      status: result.status,
      durationMs: result.duration,
      steps: [],
    };
    summary.status = result.status;
    summary.endedAt = new Date().toISOString();
    summary.durationMs = result.duration;
    summary.error = result.errors.map((error) => error.message ?? String(error)).join('\n') || undefined;
    this.tests.set(test.id, summary);
    this.writeLog(result.status === 'passed' ? 'INFO' : 'ERROR', `TEST END: ${test.title} - ${result.status.toUpperCase()}`);
  }

  async onEnd(result: FullResult): Promise<void> {
    const events = this.readEvents();
    for (const event of events) {
      const summary = this.tests.get(event.testId);
      if (summary) summary.steps.push(event);
    }

    this.writeLog(result.status === 'passed' ? 'INFO' : 'ERROR', `TEST RUN END: ${result.status.toUpperCase()}`);
    this.writeHtmlReport(result.status);
  }

  private readEvents(): StepEvent[] {
    if (!fs.existsSync(eventsFile)) return [];
    return fs.readFileSync(eventsFile, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StepEvent);
  }

  private writeHtmlReport(overallStatus: string): void {
    const summaries = Array.from(this.tests.values());
    const testsHtml = summaries.map((test) => {
      const stepsHtml = test.steps.sort((left, right) => left.stepNumber - right.stepNumber).map((step) => `
        <li class="step ${step.status}">
          <div class="step-heading"><strong>Step ${step.stepNumber}: ${escapeHtml(step.stepName)}</strong><span>${step.status.toUpperCase()}</span></div>
          <div class="meta">${step.durationMs} ms${step.url ? ` | ${escapeHtml(step.url)}` : ''}</div>
          ${step.error ? `<pre class="error">${escapeHtml(step.error)}</pre>` : ''}
          ${step.screenshotPath ? `<a href="${escapeAttribute(step.screenshotPath)}" target="_blank"><img src="${escapeAttribute(step.screenshotPath)}" alt="Screenshot for ${escapeAttribute(step.stepName)}"></a>` : '<div class="missing">Screenshot unavailable</div>'}
        </li>`).join('');

      return `
        <section class="test ${test.status === 'passed' ? 'passed' : 'failed'}">
          <h2>${escapeHtml(test.testName)}</h2>
          <div class="meta">Suite: ${escapeHtml(test.suiteName)} | Status: ${escapeHtml(test.status.toUpperCase())} | Duration: ${test.durationMs} ms</div>
          ${test.error ? `<pre class="error">${escapeHtml(test.error)}</pre>` : ''}
          <ol>${stepsHtml || '<li class="missing">No step events recorded</li>'}</ol>
        </section>`;
    }).join('');

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Playwright Execution Report</title>
<style>
:root { color-scheme: light; font-family: Segoe UI, sans-serif; background: #f4f6f8; color: #1f2933; }
body { margin: 0; padding: 32px; } main { max-width: 1100px; margin: auto; }
header, .test { background: white; border: 1px solid #d9e2ec; border-radius: 8px; padding: 22px; margin-bottom: 20px; }
h1 { margin-top: 0; } h2 { margin: 0 0 8px; }
.status { display: inline-block; padding: 5px 10px; border-radius: 999px; font-weight: 700; }
.status.passed, .step.passed { color: #116329; } .status.failed, .step.failed { color: #a61b1b; }
.step { list-style: none; border-left: 4px solid currentColor; padding: 14px; margin: 12px 0; background: #f8fafc; }
.step-heading { display: flex; justify-content: space-between; gap: 12px; } .meta { color: #52606d; font-size: 0.9rem; margin: 6px 0 12px; }
img { max-width: 520px; max-height: 340px; border: 1px solid #bcccdc; border-radius: 4px; } .error { white-space: pre-wrap; color: #a61b1b; background: #fff5f5; padding: 10px; overflow: auto; }
.missing { color: #7b8794; font-style: italic; }
</style>
</head>
<body><main>
<header><h1>Playwright Execution Report</h1><p><strong>Overall status:</strong> <span class="status ${overallStatus === 'passed' ? 'passed' : 'failed'}">${escapeHtml(overallStatus.toUpperCase())}</span></p><p><strong>Execution ID:</strong> ${escapeHtml(path.basename(reportsRoot))}</p><p><strong>Environment:</strong> Chromium | Node ${escapeHtml(process.version)} | ${escapeHtml(new Date().toISOString())}</p><p><strong>Log:</strong> <a href="../logs/execution.log">execution.log</a></p></header>
${testsHtml}
</main></body></html>`;
    fs.writeFileSync(path.join(htmlDirectory, 'execution-report.html'), html, 'utf8');
  }

  private writeLog(level: 'INFO' | 'ERROR' | 'DEBUG', message: string): void {
    fs.mkdirSync(path.dirname(executionLogFile), { recursive: true });
    fs.appendFileSync(executionLogFile, `${new Date().toISOString()} [${level}] [reporter] ${message}\n`, 'utf8');
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] ?? character));
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

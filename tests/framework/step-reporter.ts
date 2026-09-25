import fs from 'node:fs';
import path from 'node:path';
import type { Page, TestInfo } from '@playwright/test';
import {
  ensureExecutionDirectories,
  eventsFile,
  executionLogFile,
  screenshotsDirectory,
  sanitizeFileName,
} from './execution-context';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
type StepStatus = 'passed' | 'failed';

type StepEvent = {
  executionId: string;
  testId: string;
  suiteName: string;
  testName: string;
  stepNumber: number;
  stepName: string;
  status: StepStatus;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  screenshotPath?: string;
  error?: string;
  url?: string;
};

export class StepReporter {
  private stepNumber = 0;
  private readonly testId: string;
  private readonly testName: string;
  private readonly suiteName: string;

  constructor(private readonly page: Page, private readonly testInfo: TestInfo) {
    ensureExecutionDirectories();
    this.testId = sanitizeFileName(testInfo.testId);
    this.testName = testInfo.title;
    this.suiteName = testInfo.project.name || 'Playwright suite';
  }

  async step<T>(stepName: string, action: () => Promise<T>): Promise<T> {
    const stepNumber = ++this.stepNumber;
    const startedAt = new Date();
    const startedAtIso = startedAt.toISOString();
    this.writeLog('INFO', `STEP ${stepNumber} START: ${stepName}`);

    let status: StepStatus = 'passed';
    let errorMessage: string | undefined;
    let result: T;

    try {
      result = await action();
      this.writeLog('DEBUG', `ACTION completed: ${stepName}`);
      return result;
    } catch (error) {
      status = 'failed';
      errorMessage = error instanceof Error ? error.stack ?? error.message : String(error);
      this.writeLog('ERROR', `STEP ${stepNumber} FAILED: ${stepName} - ${errorMessage}`);
      throw error;
    } finally {
      const screenshotPath = await this.captureScreenshot(stepNumber, stepName, status);
      const endedAt = new Date();
      const event: StepEvent = {
        executionId: process.env.PLAYWRIGHT_EXECUTION_ID ?? 'unknown',
        testId: this.testId,
        suiteName: this.suiteName,
        testName: this.testName,
        stepNumber,
        stepName,
        status,
        startedAt: startedAtIso,
        endedAt: endedAt.toISOString(),
        durationMs: endedAt.getTime() - startedAt.getTime(),
        screenshotPath,
        error: errorMessage,
        url: this.page.url(),
      };
      this.appendEvent(event);
      this.writeLog('INFO', `STEP ${stepNumber} END: ${stepName} - ${status.toUpperCase()}`);
    }
  }

  private async captureScreenshot(stepNumber: number, stepName: string, status: StepStatus): Promise<string | undefined> {
    const testDirectory = path.join(screenshotsDirectory, this.testId);
    fs.mkdirSync(testDirectory, { recursive: true });
    const fileName = `${String(stepNumber).padStart(2, '0')}-${sanitizeFileName(stepName)}-${status}-${Date.now()}.png`;
    const absolutePath = path.join(testDirectory, fileName);

    try {
      await this.page.screenshot({ path: absolutePath, fullPage: true });
      this.writeLog('DEBUG', `SCREENSHOT captured: ${fileName}`);
      return path.join('..', 'screenshots', this.testId, fileName).replace(/\\/g, '/');
    } catch (error) {
      this.writeLog('WARN', `SCREENSHOT unavailable for step ${stepNumber}: ${String(error)}`);
      return undefined;
    }
  }

  private appendEvent(event: StepEvent): void {
    fs.appendFileSync(eventsFile, `${JSON.stringify(event)}\n`, 'utf8');
  }

  private writeLog(level: LogLevel, message: string): void {
    ensureExecutionDirectories();
    fs.appendFileSync(executionLogFile, `${new Date().toISOString()} [${level}] [${this.testId}] ${message}\n`, 'utf8');
  }
}

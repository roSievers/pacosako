import { Injectable } from '@angular/core';

export enum LoggingLevel {
  Info,
  Warning,
  Error,
}

export class LoggingEntry {
  content: string;
  source?: string;
  level: LoggingLevel;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  messages: LoggingEntry[] = [];

  add(message: string) {
    this.info(message);
  }

  info(content: string, source?: string) {
    this.messages.push({
      content,
      source,
      level: LoggingLevel.Info,
    });
  }

  warn(content: string, source?: string) {
    this.messages.push({
      content,
      source,
      level: LoggingLevel.Warning,
    });
  }

  error(content: string, source?: string) {
    this.messages.push({
      content,
      source,
      level: LoggingLevel.Error,
    });
  }

  clear() {
    this.messages = [];
  }
}

import { Component, OnInit } from '@angular/core';
import { LoggerService, LoggingEntry, LoggingLevel } from '../logger.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
})
export class LogComponent implements OnInit {
  visible: boolean = false;

  constructor(public loggingService: LoggerService) {}

  ngOnInit() {}

  toggleVisibility(): void {
    this.visible = !this.visible;
  }

  get toggleVisibilityText(): string {
    if (this.visible) {
      return 'Hide Messages';
    } else {
      return 'Show Messages';
    }
  }

  get messageCounterText(): string {
    if (this.loggingService.messages.length == 1) {
      return '1 message';
    } else {
      return `${this.loggingService.messages.length} messages`;
    }
  }

  messageLevelClass(message: LoggingEntry): string {
    if (message.level === LoggingLevel.Info) {
      return 'info';
    } else if (message.level === LoggingLevel.Warning) {
      return 'warning';
    } else {
      return 'error';
    }
  }

  messageSourceText(message: LoggingEntry): string {
    if (message.source === undefined) {
      return '[ no Source ]';
    } else {
      return `[ ${message.source} ]`;
    }
  }
}

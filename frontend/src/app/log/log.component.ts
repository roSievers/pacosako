import { Component, OnInit } from "@angular/core";
import { LoggerService } from "../logger.service";

@Component({
  selector: "app-log",
  templateUrl: "./log.component.html",
  styleUrls: ["./log.component.css"]
})
export class LogComponent implements OnInit {
  constructor(public loggingService: LoggerService) {}

  ngOnInit() {}
}

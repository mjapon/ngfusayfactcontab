import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-appfooter',
  templateUrl: './appfooter.component.html',
  styleUrls: ['./appfooter.component.css']
})
export class AppfooterComponent implements OnInit {
  versionApp: string;
  constructor() { }
  ngOnInit() {
    this.versionApp = '1.12 - ' + new Date().toISOString();
  }
}

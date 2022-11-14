import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';

@Component({
    selector: 'app-appfooter',
    styles: [
            `.footer {
            background-color: #F3F4F7 !important;
            border-top: solid 1px #e2e3e6;
            font-size: 12px;
        }
        `],
    template: `
        <div class="footer h-auto py-5">
            <div class="text-center">
                <p class="text-muted">Copyright © 2022 Mavil <span>v{{versionApp}}</span> <a
                        href="http://agenciachel.com" target="_blank">
                    agenciachel.com</a></p>
            </div>
        </div>
    `
})
export class AppfooterComponent implements OnInit {
    versionApp = '';

    constructor(private fautService: FautService) {

    }

    ngOnInit() {
        this.fautService.source.subscribe(msg => {
            if (msg === 'loadvapp') {
                this.versionApp = this.fautService.getVersionApp() || '';
            }
        });
    }
}

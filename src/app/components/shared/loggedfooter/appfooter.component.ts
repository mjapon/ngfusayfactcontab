import {Component, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';

@Component({
    selector: 'app-appfooter',
    template: `
        <div class="footer">
            <div class="text-center">
                <p class="text-muted">Copyright © 2025 Mavil <span>v{{versionApp}}</span> <a
                        class="ms-2" href="http://agenciachel.com" target="_blank">agenciachel.com</a></p>
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

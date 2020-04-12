import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LocalStorageService} from '../../../services/local-storage.service';
import {AuthService} from '../../../services/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: []
})
export class MenuComponent implements OnInit {
    items: MenuItem[];

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit() {
        this.authService.currentMessage.subscribe(message => {
            if ('true' === message) {
                const menuSaved = this.localStorageService.getItem('globalMenu');
                this.items = JSON.parse(menuSaved);
            }
        });

        const menuLS = this.localStorageService.getItem('globalMenu');
        if (menuLS) {
            this.items = JSON.parse(menuLS);
        }
    }
}

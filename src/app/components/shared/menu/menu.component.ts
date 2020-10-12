import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LocalStorageService} from '../../../services/local-storage.service';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: []
})
export class MenuComponent implements OnInit, OnDestroy {
    items: MenuItem[];
    subscription: Subscription;
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit() {
        this.subscription = this.authService.currentMessage.subscribe(message => {
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

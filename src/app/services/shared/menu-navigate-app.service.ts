import {Injectable} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MenuNavigateAppService {

    currentNavigateItem: MenuItem[] = [{
        icon: 'fa-solid fa-house',
        route: '/',
        id: '0'
    }];

    addItem(item: MenuItem) {
        const exist = this.currentNavigateItem.some(it => it.id === item.id);
        if (!exist) {
            this.currentNavigateItem.push(item);
        }
    }

    addItems(items: MenuItem[]) {
        this.currentNavigateItem = items;
    }

    updateNavigates(menuItems: MenuItem[]) {
        console.log(this.currentNavigateItem);
        menuItems.push(this.currentNavigateItem);
        return menuItems;
    }
}

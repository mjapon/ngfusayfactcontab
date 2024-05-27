import {Injectable} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MenuNavigateAppService {
    currentNavigateItem: MenuItem[] = [{
        icon: 'fa-solid fa-house',
        route: '/'
    },
        {label: 'Listado', icon: 'fa-solid fa-rectangle-list', route: '/tickets'}];

    addItem(item: MenuItem) {
        this.currentNavigateItem.push(item);
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

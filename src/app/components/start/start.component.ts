import {Component} from '@angular/core';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html'
})
export class StartComponent {
    isShowCalcu = false;

    constructor() {
    }

    toggleShowCalcu() {
        this.isShowCalcu = !this.isShowCalcu;
    }

}

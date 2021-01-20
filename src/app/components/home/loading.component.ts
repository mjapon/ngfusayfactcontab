import {Component} from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
        <div class="text-center">
            <p class="p-5 m-5">
                <img src="assets/anim.gif"
                     alt="procesando">
                <br>
                <span class="text-info"> Espere un momento... </span>
            </p>
        </div>
    `
})
export class LoadingComponent {
    constructor() {

    }
}

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-librodiariolist',
    templateUrl: './librodiariolist.component.html'
})
export class LibrodiariolistComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    gotoFormAsiento() {
        this.router.navigate(['newasiento']);
    }

}

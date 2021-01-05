import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-fusaynavbar',
    templateUrl: './fusaynavbar.component.html',
    styleUrls: ['./fusaynavbar.component.css']
})
export class FusaynavbarComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    goToLogin() {
        this.router.navigate(['login']);
    }
}

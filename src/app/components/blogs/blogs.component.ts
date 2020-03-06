import {Component, OnInit} from '@angular/core';

declare var FB: any;

@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

    constructor() {
    }

    rutaBlog: string;
    contentid: string;

    ngOnInit() {
        this.rutaBlog = "/blogs/main";
        this.contentid = "2020";
        FB.XFBML.parse();
    }

}

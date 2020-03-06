import {Component, OnInit} from '@angular/core';
import {BlogService} from "../../../services/blog.service";

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

    blogs: Array<any>;

    constructor(private blogService: BlogService) {
    }

    ngOnInit() {
      this.loadBlogs();
    }

    loadBlogs() {
        this.blogService.listar().subscribe(res => {
            if (res.status === 200) {
                this.blogs = res.items;
            }
        });
    }

    showBlog(item:any){

    }

}

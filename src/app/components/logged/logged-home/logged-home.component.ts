import { Component, OnInit } from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logged-home',
  templateUrl: './logged-home.component.html',
  styleUrls: ['./logged-home.component.css']
})
export class LoggedHomeComponent implements OnInit {

  menu:any;

  constructor(private fautService: FautService,
              private router: Router) { }

  ngOnInit() {
    const menuFrom =  this.fautService.getMenuApp();
    console.log("valor de menu es:");
    console.log(menuFrom);


  }

}

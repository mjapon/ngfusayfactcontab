import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ValidationService} from '../../../services/formvalidation.service';


@Component({
  selector: 'app-validation-messages',
  template: `
    <div class="text-danger" *ngIf="errorMessage">{{errorMessage}}</div>`
})
export class ValidationMessagesComponent {
  @Input() control: FormControl;

  constructor() {
  }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && (this.control.dirty || this.control.touched)) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}

/*
@Component({
  selector: 'app-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.css']
})
export class ValidationMessagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/

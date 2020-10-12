import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChangeodontoService {

    public message = new Subject<string>();

    constructor() {
    }

    publishMessage(message: string) {
        this.message.next(message);
    }

}

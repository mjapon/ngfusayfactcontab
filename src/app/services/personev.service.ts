import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PersonEvService {
    defaultvalue: any = {}
    private bssource = new BehaviorSubject(this.defaultvalue);
    public source = this.bssource.asObservable();

    constructor() {

    }

    publishMessage(message: any) {
        this.bssource.next(message);
    }

    publishUpdateDeudaMsg() {
        this.publishMessage({tipo: 1});
    }
}

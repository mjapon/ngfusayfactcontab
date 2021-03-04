import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FacturasmsgService {
    public message = new Subject<any>();

    constructor() {
    }

    publishMessage(message: any) {
        this.message.next(message);
    }

}

import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConsMedicaMsgService {

    public message = new Subject<any>();

    constructor() {
    }

    publishMessage(message: any) {
        this.message.next(message);
    }

    publishReloadHistorias() {
        this.publishMessage({tipo: 3});
    }
}

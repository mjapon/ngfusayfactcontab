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

    publishLoadDatosCita(rowCitaSel) {
        this.publishMessage({tipo: 2, msg: rowCitaSel});
    }
}

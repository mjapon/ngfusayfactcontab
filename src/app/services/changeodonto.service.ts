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

    publishLoad(pacid: number) {
        const msgload = '{"tipo": "load_db","pacid":' + pacid + '}';
        this.message.next(msgload);
    }

    publishClear() {
        this.message.next('{"tipo": "clear"}');
    }

    publishGetPacid() {
        this.message.next('{"tipo": "getpacid"}');
    }

}

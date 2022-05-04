import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CtesFinanService {

    private RutaHome = 'finan/home';
    private RutaCreaCred = 'finan/newcred';
    private RutaDetCred = 'finan/detcred/:cred';
    private RutaDetCredSm = 'finan/detcred/';
    private RutaAperturaCta = 'finan/aperturacta';

    get rutaHome() {
        return this.RutaHome;
    }

    get rutaCreaCred() {
        return this.RutaCreaCred;
    }

    get rutaDetCred() {
        return this.RutaDetCred;
    }

    get rutaDetCredSm() {
        return this.RutaDetCredSm;
    }

    get rutaAperturaCta() {
        return this.RutaAperturaCta;
    }

}
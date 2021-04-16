import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {DatosloggedService} from '../../services/datoslogged.service';
import {SwalService} from '../../services/swal.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private swalService: SwalService,
        private datLoggServ: DatosloggedService) {

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve => {
            if (route.data) {
                const auxperm = [];
                route.data.perml.forEach(it => {
                    auxperm.push(`'${it}'`);
                });
                const perms = auxperm.join(',');
                return this.datLoggServ.checkPermiso(perms).subscribe(res => {
                    if (res.chkperm) {
                        resolve(true);
                    } else {
                        this.swalService.fireToastError('Acceso no autorizado');
                        this.router.navigate(['lghome']);
                        resolve(false);
                    }
                });
            } else {
                this.swalService.fireToastError('Acceso no autorizado, no se definió permiso por defecto');
                this.router.navigate(['lghome']);
                resolve(false);
            }
        }));
    }

}

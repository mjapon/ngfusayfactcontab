import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {DatosloggedService} from '../services/datoslogged.service';
import {SwalService} from '../services/swal.service';
import {map} from 'rxjs/operators';

/**
 * Guardia funcional para verificar permisos de usuario mediante el servicio DatosloggedService.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const datLoggServ = inject(DatosloggedService);
    const swalService = inject(SwalService);

    const perml = route.data?.['perml'] as Array<string>;

    if (!perml || perml.length === 0) {
        // Si no se definieron permisos, permitimos el paso o redirigimos según política.
        // En este caso, asumimos que si no hay perml, la ruta no está bien configurada para esta guardia.
        return true;
    }

    // El servicio DatosloggedService.checkPermiso espera un string con las claves entre comillas simples separadas por comas.
    const permsStr = perml.map(p => `${p}`).join(',');

    return datLoggServ.checkPermiso(permsStr).pipe(
        map(res => {
            if (res && res.chkperm) {
                return true;
            } else {
                swalService.fireToastError('Acceso no autorizado');
                // Redirigir al home logueado si no tiene permiso.
                return router.createUrlTree(['/lghome']);
            }
        })
    );
};

import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EstadosService {

    getActivoInactivoTodos() {
        return [
            {label: 'Todos', value: -1},
            {label: 'Activos', value: 0},
            {label: 'Inactivos', value: 1},
        ];
    }

}

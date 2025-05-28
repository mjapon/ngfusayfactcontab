import {SelectItem} from 'primeng/api';


export interface RangeHours {
    cstart: number;
    cend: number;
    hours: SelectItem<number>[];
}

export interface Direccion {
    calle: string;
    ciudad: string;
    pais: string;
}

export interface HeadWeekView {
    fecha: Date;
    diastr: string;
    diames: string;
    css: string;
}

export interface MavilCita {
    ct_id: number;
    ct_fecha: string;
    ct_hora: number;
    ct_hora_fin: number;
    pac_id: number;
    ct_obs: string;
    med_id: number;
    ct_titulo: string;
    per_nombres: string;
    per_apellidos: string;
    per_ciruc: string;
    ct_color: string;
    ct_fechacrea: string;
    user_crea: string;
    ct_td: boolean;
}

export interface NewMavilEvent {
    date: Date;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
}

export interface WeekEvent {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    day: number;
    element: HTMLElement | null;
    date: Date;
}

import {Component, OnInit} from '@angular/core';
import {FautService} from "../../../services/faut.service";
import {PacienteService} from "../../../services/paciente.service";
import {FechasService} from "../../../services/fechas.service";
import {DateFormatPipe} from "../../../pipes/date-format.pipe";
import {SwalService} from "../../../services/swal.service";

@Component({
    selector: 'app-miscitas',
    templateUrl: './miscitas.component.html',
    styleUrls: ['./miscitas.component.css']
})
export class MiscitasComponent implements OnInit {

    datosUserLogged: any
    dia: Date;
    citas: Array<any>;
    citaSelected: any;
    es: any;
    minimumDate: Date;
    observacion: string;
    currentCitaIndex: number;

    constructor(private fautService: FautService,
                private pacienteService: PacienteService,
                private fechasService: FechasService,
                private dateFormatPipe: DateFormatPipe,
                private swalService: SwalService) {
    }

    ngOnInit(): void {
        this.citas = new Array<any>();
        this.es = this.fechasService.getLocaleEsForPrimeCalendar();
        this.datosUserLogged = this.fautService.getUserInfoSaved();
        this.minimumDate = new Date();
        this.dia = new Date();
        this.citaSelected = null;
        this.auxLoadCitas('');
        this.currentCitaIndex = 0;
    }

    selectCita(cita: any) {
        this.citaSelected = cita;
        this.observacion = cita.cita_obs;
        this.currentCitaIndex = this.citas.indexOf(this.citaSelected);
    }

    auxLoadCitas(dia: string) {
        this.pacienteService.listarCitas(this.datosUserLogged.per_id, dia).subscribe(res => {
            if (res.status === 200) {
                this.citas = res.citas;
            }
        });
    }

    loadCitas() {
        const diaStr = this.dateFormatPipe.transform(this.dia);
        this.auxLoadCitas(diaStr);
    }

    showAllCitas() {
        this.citaSelected = null;
        this.auxLoadCitas('');
    }

    cambiarEstado(nuevoEstado: number) {
        let estadoMsg = '¿Esta segur@?';
        if (nuevoEstado === 1) {
            estadoMsg = '¿Confirma que desea marcar como atendida esta cita?';
        } else if (nuevoEstado === 2) {
            estadoMsg = '¿Confirma que desea anular esta cita?';
        }
        this.swalService.fireDialog(estadoMsg).then(confirm => {
            if (confirm.value) {
                let form = {
                    cita_id: this.citaSelected.cita_id,
                    obs: this.observacion,
                    estado: nuevoEstado
                };
                this.pacienteService.actualizarCita(form).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                        this.loadCitas();
                        this.citaSelected = null;
                    }
                });
            }
        });
    }

    retornaCitas() {
        this.citaSelected = null;
    }

    citaSiguiente() {
        if (this.currentCitaIndex < this.citas.length - 1) {
            this.currentCitaIndex = this.currentCitaIndex + 1;
            this.citaSelected = this.citas[this.currentCitaIndex];
        } else {
            this.swalService.fireToastWarn('Ya no hay mas citas');
        }
    }

    citaAnterior() {
        if (this.currentCitaIndex > 0) {
            this.currentCitaIndex = this.currentCitaIndex - 1;
            this.citaSelected = this.citas[this.currentCitaIndex];
        } else {
            this.swalService.fireToastWarn('Ya no hay mas citas');
        }
    }
}

import {Component, OnInit} from '@angular/core';
import {CitasMedicasService} from "../../../services/citas-medicas.service";
import {FechasService} from "../../../services/fechas.service";
import {CatalogosService} from "../../../services/catalogos.service";
import {PersonaService} from "../../../services/persona.service";
import {SwalService} from "../../../services/swal.service";
import {DateFormatPipe} from "../../../pipes/date-format.pipe";
import {LugarService} from "../../../services/lugar.service";

@Component({
    selector: 'app-citasmedicas',
    templateUrl: './citasmedicas.component.html',
    styleUrls: ['./citasmedicas.component.css']
})
export class CitasmedicasComponent implements OnInit {

    form: any;
    ciedataArray: Array<any>;
    es: any;
    maxDate = new Date();

    estadoCivilList: Array<any>;
    generosList: Array<any>;
    selectedEstCivil: any;
    lugares: Array<any>;

    constructor(private citasMedicasServ: CitasMedicasService,
                private catalogosServ: CatalogosService,
                private personaService: PersonaService,
                private dateFormatPipe: DateFormatPipe,
                private swalService: SwalService,
                private fechasService: FechasService,
                private lugarService: LugarService) {
    }

    ngOnInit(): void {
        this.estadoCivilList = [];
        this.generosList = [];
        this.initform();

        this.citasMedicasServ.getForm().subscribe(res => {
            if (res.status === 200) {
                this.form = res.form;
            }
        });

        this.citasMedicasServ.getCie10Data().subscribe(rescie => {
            if (rescie.status === 200) {
                this.ciedataArray = rescie.cie10data;
            }
        });

        this.es = this.fechasService.getLocaleEsForPrimeCalendar();

        this.catalogosServ.getCatalogos(1).subscribe(resa => {
            if (resa.status === 200) {
                this.generosList = resa.items;
            }
        });

        this.catalogosServ.getCatalogos(2).subscribe(resb => {
            if (resb.status === 200) {
                this.estadoCivilList = resb.items;
            }
        });

        this.lugarService.listarTodos().subscribe(resLugares => {
            if (resLugares.status === 200) {
                this.lugares = resLugares.items;
            }
        });
    }


    initform() {
        this.form = {
            paciente: {
                'per_id': 0,
                'per_ciruc': '',
                'per_nombres': '',
                'per_apellidos': '',
                'per_direccion': '',
                'per_telf': '',
                'per_movil': '',
                'per_email': '',
                'per_fecreg': '',
                'per_tipo': 1,
                'per_lugnac': 0,
                'per_nota': '',
                'per_fechanac': '',
                'per_genero': 0,
                'per_estadocivil': 1,
                'per_lugresidencia': 0
            },
            datosconsulta: {
                'cosm_id': 0,
                'pac_id': 0,
                'med_id': 0,
                'cosm_fechacita': '',
                'cosm_fechacrea': '',
                'cosm_motivo': '',
                'cosm_enfermactual': '',
                'cosm_hallazgoexamfis': '',
                'cosm_exmscompl': '',
                'cosm_tratamiento': '',
                'cosm_receta': '',
                'cosm_recomendaciones': '',
                'user_crea': ''
            },
            antecedentes: [],
            examsfisicos: [],
            revxsistemas: [],
            diagnostico: []
        };
    }

    buscarPaciente() {
        let per_ciruc = this.form.paciente.per_ciruc;
        this.personaService.buscarPorCi(per_ciruc).subscribe(res => {
                if (res.status === 200) {
                    this.loadDataPerson(res.persona);
                }
            }
        );
    }

    verificaPacienteRegistrado() {
        if (this.form.paciente.per_id === 0) {
            this.buscarPaciente();
        }
    }

    registrarCita() {
        const msg = '¿Seguro?';
        this.swalService.fireDialog(msg).then(confirm => {
            if (confirm.value) {
                const fechaCita = this.dateFormatPipe.transform(this.form.datosconsulta.cosm_fechacita);
                const fechaNac = this.dateFormatPipe.transform(this.form.paciente.per_fechanac);
                const formToPost: any = {};
                for (const prop of Object.keys(this.form)) {
                    formToPost[prop] = this.form[prop];
                }
                formToPost.paciente.per_fechanac = fechaNac;
                formToPost.datosconsulta.cosm_fechacita = fechaCita;

                this.citasMedicasServ.crearCita(formToPost).subscribe(res => {
                    if (res.status === 200) {
                        this.swalService.fireToastSuccess(res.msg);
                    }
                });
            }
        });
    }

    private loadDataPerson(persona: any) {
        this.form.paciente.per_id = persona.per_id;
        this.form.paciente.per_nombres = persona.per_nombres;
        this.form.paciente.per_apellidos = persona.per_apellidos;
        this.form.paciente.per_direccion = persona.per_direccion;
        this.form.paciente.per_telf = persona.per_telf;
        this.form.paciente.per_movil = persona.per_movil;
        this.form.paciente.per_email = persona.per_email;
        this.form.paciente.per_tipo = persona.per_tipo;
        this.form.paciente.per_lugnac = persona.per_lugnac;
        this.form.paciente.per_nota = persona.per_nota;
        /*this.form.paciente.per_fechanac
        this.form.paciente.per_genero
        this.form.paciente.per_estadocivil
        this.form.paciente.per_lugresidencia
        */
    }
}

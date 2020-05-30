import {Component, OnInit} from '@angular/core';
import {CitasMedicasService} from "../../../services/citas-medicas.service";
import {FechasService} from "../../../services/fechas.service";
import {CatalogosService} from "../../../services/catalogos.service";

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

    constructor(private citasMedicasServ: CitasMedicasService,
                private catalogosServ: CatalogosService,
                private fechasService: FechasService) {

    }

    ngOnInit(): void {
        this.estadoCivilList = [];
        this.generosList = [];

        //load form
        this.citasMedicasServ.getForm().subscribe(res => {
            console.log('valor de res es:');
            console.log(res);
        });

        this.citasMedicasServ.getCie10Data().subscribe(rescie => {
            console.log('Res de rescie:');
            console.log(rescie);
        });

        this.es = this.fechasService.getLocaleEsForPrimeCalendar();

        this.catalogosServ.getCatalogos(1).subscribe(resa => {
            if (resa.status === 200) {
                this.generosList = resa.items;
                console.log(this.generosList);
            }
        });

        this.catalogosServ.getCatalogos(2).subscribe(resb => {
            if (resb.status === 200) {
                this.estadoCivilList = resb.items;
            }
        });

        this.form = {
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
            'per_lugresidencia': 0,

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
            'user_crea': '',

            'antecedentes': [],
            'examsfisicos': [],
            'revxsistemas': [],
            'diagnostico': []
        };


    }

}

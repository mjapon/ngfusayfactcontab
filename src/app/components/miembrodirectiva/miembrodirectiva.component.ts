import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MbmDirFusayService} from 'src/app/services/mbm-dir-fusay.service';
import {MbroDir} from 'src/app/model/mbrodir';
import {DocumentReference} from '@angular/fire/firestore';

@Component({
    selector: 'app-miembrodirectiva',
    templateUrl: './miembrodirectiva.component.html',
    styleUrls: ['./miembrodirectiva.component.css']
})
export class MiembrodirectivaComponent implements OnInit {
    tipo: string;
    datosMiembro: any;
    detalleMiembro: string;
    fotoMiembro: string;
    cargoMiembro: string;
    nombreMiembro: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private directivaService: MbmDirFusayService
    ) {
        this.detalleMiembro = '<i>Defina detalle</i>';
        this.fotoMiembro = 'hombre_empty.jpeg';
        this.cargoMiembro = 'cargo';
        this.nombreMiembro = 'nombre';
    }

    ngOnInit() {
        this.tipo = '';
        this.route.paramMap.subscribe(params => {
            this.tipo = params.get('tipo');
            this.loadDatosMiembro();
        });
    }

    loadDatosMiembro() {
        this.datosMiembro = {};
        this.directivaService.findByTipo(this.tipo).subscribe(res => {
            if (res.status === 200) {
                this.datosMiembro = res.item;
                if (this.datosMiembro) {
                    this.detalleMiembro = this.datosMiembro.longdet;
                    this.cargoMiembro = this.datosMiembro.tipo;
                    this.fotoMiembro = this.datosMiembro.img;
                    this.nombreMiembro = this.datosMiembro.nombre;
                }
            }
        });
    }

    registrar() {
        const pres: MbroDir = {
            tipo: 'Presidente',
            nombre: 'Msc. Angel Rodrigo Japón Gualán',
            img: 'presid.jpg',
            longDet: `<p class="card-text textofusay text-justify">
    Indígena del pueblo saraguro. Nacionalidad Quichua. Temazcalero y Taita de la medicina andina.

    Candidato a Doctor en Ciencias de la Educación por la Universidad Nacional de la Plata, Argentina.
    Magíster en Educación y Desarrollo del Pensamiento, en la Universidad de Cuenca.
    Licenciado en Ciencias de la Educación mención Filosofía,
    Sociología y Economía en la Universidad de Cuenca, Ecuador.
  </p>
  <p class="textofusay text-justify">
    Ha sido ponente dentro y fuera del país en temas relacionados en medicina,
    filosofía andina, educación, inclusión, políticas públicas, educación superior intercultural.
  </p>

  <p class="textofusay text-justify">
    Co-autor del libro: <i><b>"Los Saraguros. Cosmovisión, Salud e Identidad Andina. Una Mirada desde sí
        mismos"</b></i> (2010).
    Ha publicado en revistas de impacto a nivel nacional e internacional.
    Experto en interculturalidad, pues trabaja en este campo desde el 2005.
    Ha dirigido tesis de grado y postgrado relacionados con la interculturalidad.
    Actualmente es Presidente de la Fundación Salud y Vida Nueva.
    <br>
    <br>
    Profesor-investigador titular de la Universidad de Cuenca, Ecuador.
  </p>
  <p class="textofusay">
    Redes sociales:
    <br>
    <i class="fa fa-facebook"></i>
    <a href="https://www.facebook.com/arjg1" target="_blank">
      Angel Japón Gualán
    </a>
    <br>
    <i class="fa fa-twitter"></i>
    <a href="https://twitter.com/angeljapon1" target="_blank">
      @angeljapon1
    </a>
    <br>
    <i class="fa fa-instagram"></i>
    <a href="https://www.instagram.com/japongualan/" target="_blank">
      @japongualan
    </a>
    <br>
    <i class="fa fa-whatsapp"></i> (+593) 998975316
    <br>
    <i class="fa fa-youtube"></i>
    <a href="https://www.youtube.com/user/9953147" target="_blank">
      Angel Rodrigo Japón Gualán
    </a>
    <br>
  </p>`,
            shortDet: ''
        };

        const tesorera: MbroDir = {
            nombre: 'Prof. María Delfina Gualán Lozano',
            img: 'mamadelfina.jpg',
            tipo: 'Tesorera',
            longDet: 'Detalle tesorera',
            shortDet: ''
        };

        const secretario: MbroDir = {
            nombre: 'Ing. Manuel Efraín Japón Gualán',
            img: 'manuel.jpeg',
            tipo: 'Secretario',
            longDet: 'Detalle secretario',
            shortDet: ''
        };

        const fiscalizador: MbroDir = {
            nombre: 'Msc. Angel Polibio Japón Gualán',
            img: 'polibio.jpeg',
            tipo: 'Fiscalizador',
            longDet: 'Detalle Fiscalizador',
            shortDet: ''
        };

        const primerVocal: MbroDir = {
            nombre: 'Sr. Lauro Quishpe',
            img: 'lauro.jpeg',
            tipo: 'Primer Vocal',
            longDet: 'Detalle Primer Vocal',
            shortDet: ''
        };

        alert('Registrado');
    }

    regresar() {
        this.router.navigate(['home']);
    }

    handleSuccessfulSaveTodo(response: DocumentReference, todo: MbroDir) {

    }
}

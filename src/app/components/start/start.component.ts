import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  images: any[];
  cars: any[];
  responsiveOptions;
  tituloDetProd = '';
  detalleDetProd = '';
  modalOptions: NgbModalOptions;
  servicios: any[];
  directiva: any[];
  banners: any[];
  serviciosel: any;

  constructor(
    private router: Router,
    private autService: AuthService,
    private modalService: NgbModal
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.cars = [
      {brand: 'Medicina Ancestral', year: '2019', color: 'blanco'},
      {brand: 'Medicina Tradicional', year: '2019', color: 'blanco'},
      {brand: 'Tres', year: '2019', color: 'blanco'},
      {brand: 'Cuatro', year: '2019', color: 'blanco'}
    ];

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    };
    this.loadInfoServicios();
    this.loadInfoDirectiva();
    this.loadBanners();
    this.serviciosel = {};
  }

  getIndexOfItem(item: any) {
    return this.banners.indexOf(item);
  }

  goToEvento(){
    this.router.navigate(['congreso2020']);
  }

  loadInfoServicios() {
    this.servicios = Array<any>();
    this.servicios.push({
      nombre: 'Medicina Ancestral',
      img: 'medancestral_prod.jpg',
      shortDet: 'Rituales de sanación con medicina ancestral',
      longDet: `<p>
      El principal objetivo de nuestra Fundación, entro entros; es recuperar los conocimientos ancestrales
      de nuestros antepasados en el tema de sanación de nuestro cuerpo, revalorizando los conocimientos
      de nuestros mayores, yachacs, parteras, sanadores que se están perdiendo.
      En este sentido la medicina ancestral que la Fundación da como servicio consiste en ceremonias,
      rituales de curación con medicinas de poder (ahuacolla, ayahauasca, tabaco) y sanación tales como limpias
      con huevo, cuy entre otros; aportando asi al bienestar del ser humano y por ende de la sociedad en conjunto.
      </p>`
    });
    this.servicios.push({
      nombre: 'Medicina Tradicional',
      img: 'medtrad_prod.jpeg',
      shortDet: 'Atención en medicina convencional',
      longDet: `<p>
      La Medicina Tradicional u occidental tambien está presente en nuestra Fundación
      mediante la aplicacion de farmacos que son recetados por el médico de la Fundación
      luego de una evaluacion del mismo al paciente, en los casos para los que se requiere,
      de esta manera se complementan estas dos técnicas de curación con el objetivo de sanar
      al ser humano. En este sentido la Fundación
      ofrece el servicio de Consulta Externa, aplicación de sueros entre otros.
      </p>`
    });
    this.servicios.push({
      nombre: 'Kambo',
      img: 'kambo_prod.jpeg',
      shortDet: 'Terapias de curación usando la medicina del Kambó',
      longDet: `<p>
      El Kambó, es la secreción cutanea que se obtiene de la rana Phyllomedusa bicolor,
      un anfibio anuro arbóreo que habita en la cuencas del Amazonas y el Orinoco en América del Sur.
      </p>
      <p>
      Es una terapia natural y muy eficaz, que se ha utilizado desde hace miles de años por las tribu de la selva tropical del amazonas del norte occidental,
      incluyendo Perú, Brasil y Colombia. Los nativos se frotaban el lomo de la rana por el cuerpo para fortalecerse y así poder salir a cazar evitando ser afectados
      por bichos y serpientes. Por otra parte, lo utilizaban para promover la salud, la fuerza, el bienestar y también para eliminar 'panema' o mala suerte.
      </p>
      <p>
      La Fundación ha tenido la oportunidad de visitar los pueblos amazónicos y de vivenciar y aprender
      de la práctica, aplicación y uso que se le da a esta medicina, en este sentido nuestra Fundación
      pone a dispocisión de toda la ciudadania de esta medicina.
      </p>
      <b>PROPIEDADES Y BENEFICIOS</b>
      <p>
      Las propiedades de los péptidos del Kambó cubren una amplia gama de posibles usos médicos
      en el tratamiento de enfermedades cerebrales como el alzheimer, el parkinson, parálisis, depresión, migrañas,
      problemas de circulación sanguínea, insuficiencia vascular, enfermedades de órganos, problemas de la piel y los ojos,
      problemas de fertilidad en mujeres y hombres, sida, hepatitis y cáncer.
      </p>
      <p>
      Otras características médicas interesantes de esta secreción son sus efectos anti-inflamatorios,
      su capacidad para destruir los microbios y los virus, y para sanar infecciones.
      Debido a la presencia de estos péptidos, el Kambo es uno de los antibióticos y anestésicos naturales más fuertes encontrados en el mundo y
      uno de los medios naturales más fuertes, además de despertar y potenciar fuertemente nuestro sistema inmunológico
      </p>`
    });
    this.servicios.push({
      nombre: 'Terapias Alternativas',
      img: 'terapiasal_prod.jpeg',
      shortDet: 'Acupuntura, Sintergetica, Masaje Tuina, Terapia Ortomolecular',
      longDet: `<p>
      Las Terapias Alternativas, también llamadas Terapias Naturales, son el conjunto de técnicas y metodologías orientadas a ayudar a la persona
      a que aprenda a recuperar su estado natural de salud.
      En este sentido, se presentan, principalmente, antes como un acompañamiento a la persona para ayudarla a comprender su proceso de sanación,
      que como un remedio para tratar la enfermedad. La persona siempre es la principal protagonista de su proceso de sanación.
      </p>
      <p>Las Terapias Alternativas tratan y se dirigen a las personas, nunca a las enfermedades.</p>
      <p>Las Terapias Alternativas proponen una visión global del individuo en la que todos los elementos -físico, intelectual, emocional, espiritual, social, afectivo…- de su vida están relacionados. Un movimiento en cualesquiera de estas áreas tiene repercusión en los demás aspectos, tanto para mejorar la salud como para empeorarla.</p>
      <p>La persona es la responsable última de su estado de salud así como de su proceso de sanación. El terapeuta no cura al paciente sino que, bien al contrario, ayuda a la persona para que ella misma tome las riendas de su vida.</p>
      </ul>`
    });
    this.servicios.push({
      nombre: 'Temascal',
      img: 'temascal_prod.jpg',
      shortDet:
        'Adéntrate al vientre de la madre tierra en nuestros temascales',
      longDet: `<p>
      El temazcal es un baño de vapor utilizado ampliamente en Mesoamérica desde los tiempos prehispánicos; se utiliza con fines terapéuticos, higiénicos y rituales, siempre conservando la cosmovisión indígena.
      </p>
      <p>
      El temazcal puede tener muchas formas diferentes y los diversos grupos indígenas tienen sus propias costumbres específicas;
      aquí se describe un ejemplo básico, reconociendo que no necesariamente son así todos los temazcales.
      </p>
      <p>
      El temazcal representa la tierra, la diosa que nos da vida y nos sustenta. Cuando uno entra al temazcal,
      se dice que está entrando al vientre de la Madre Tierra y por eso el temazcal tiene la forma de domo;
      en algunos casos se construye literalmente adentro de la tierra en forma de cueva. El interior del temazcal es oscuro.
      </p>
      <p>
      Afuera del temazcal, en algunas tradiciones en el lado oriental, se ubica el fuego sagrado; esto representa el dios del sol,
      cuya energía fecundante y creadora calienta las piedras volcánicas que luego darán calor al temazcal.
      </p>
      <p>
      A menudo también se pone un círculo de piedras con objetos representantes de los ancestros para reconocer la presencia espiritual de los abuelos.
      </p>
      <p>
      En el centro del temazcal hay una depresión donde se depositan las piedras calientes; sobre estas piedras se colocan plantas curativas y aromáticas,
      o se vierte una infusión de éstas sobre las piedras. Las plantas también son simbólicas por sus propiedades individuales, por ejemplo:
      - El copal limpia el espíritu y recupera la memoria de nuestro origen.
      - El palo dulce atrae la belleza y la dulzura y revela la ternura dentro del corazón.
      - El cedro para agradecer y bendecir todo lo que tenemos.
      - La salvia para escoger solo aquello que necesitamos.
      </p>`
    });
    this.servicios.push({
      nombre: 'Rumihawa',
      img: 'rumi1_prod.jpg',
      shortDet: 'Disfruta de platos típicos de la localidad en el Rumihawa',
      longDet: `<p>
      Rumihawa, es el restaurante que la Fundación pone a dispocision de toda la ciudadanía
      en ella se ofrecen platos típicos de la localidad como es:
      </p>
      <ul>
      <li>Caldo de gallina criolla</li>
      <li>Cuy asado con papas</li>
      <li>Tamales y humitas</li>
      <li>Tortillas de maiz</li>
      <li>Queso y quesillo</li>
      <li>Mote</li>
      </ul>`
    });
  }

  loadBanners() {
    this.banners = new Array<any>();
    this.banners.push({
      img: '3_m.png'
    });
    this.banners.push({
      img: '4_m.png'
    });
    this.banners.push({
      img: '5_m.png'
    });
    this.banners.push({
      img: '1_m.png'
    });
  }

  loadInfoDirectiva() {
    this.directiva = Array<any>();
    this.directiva.push({
      nombre: 'Msc. Angel Rodrigo Japón Gualán',
      img: 'presid.jpg',
      shortDet: 'Presidente',
      longDet: 'Detalle presidente'
    });

    this.directiva.push({
      nombre: 'Prof. María Delfina Gualán Lozano',
      img: 'mamadelfina.jpg',
      shortDet: 'Tesorera',
      longDet: 'Detalle tesorera'
    });

    this.directiva.push({
      nombre: 'Ing. Manuel Efraín Japón Gualán',
      img: 'manuel.jpeg',
      shortDet: 'Secretario',
      longDet: 'Detalle secretario'
    });

    this.directiva.push({
      nombre: 'Msc. Angel Polibio Japón Gualán',
      img: 'polibio.jpeg',
      shortDet: 'Fiscalizador',
      longDet: 'Detalle Fiscalizador'
    });

    this.directiva.push({
      nombre: 'Sr. Lauro Quishpe',
      img: 'lauro.jpeg',
      shortDet: 'Primer Vocal',
      longDet: 'Detalle Primer Vocal'
    });
  }

  ngOnInit() {
    console.log('Start componente-->');
    console.log('usuario logueado:');
    console.log(this.autService.isAuthenticated());

    this.images = [];
    this.images.push({
      source: 'assets/banners/1_m.png',
      alt: 'Description for Image 1',
      title: 'Title 1'
    });
    this.images.push({
      source: 'assets/banners/5_m.png',
      alt: 'Description for Image 1',
      title: 'Title 1'
    });
    this.images.push({
      source: 'assets/banners/3_m.png',
      alt: 'Description for Image 1',
      title: 'Title 1'
    });
    this.images.push({
      source: 'assets/banners/4_m.png',
      alt: 'Description for Image 1',
      title: 'Title 1'
    });

    /*
    if (this.autService.isAuthenticated()) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['login']);
    }
    */

    //this.goToEvento();
  }

  showDetallesProd(item: any) {
    this.serviciosel = item;
    this.tituloDetProd = item.nombre;
    this.detalleDetProd = item.longDet;
    $('#modalDetalleProd').modal();
  }

  showDetallesDirectiva(item: any) {
    //alert('show detalles para:' + item.nombre);
    this.router.navigate(['directiva', item.shortDet]);
  }
}

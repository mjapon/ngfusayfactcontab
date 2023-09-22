import { Component, OnInit } from '@angular/core';
import { FacteComprobService } from 'src/app/services/facte/comprob.service';
import { FacteContribService } from 'src/app/services/facte/contrib.service';
import { BaseComponent } from '../../shared/base.component';

@Component({
  selector: 'app-homefacte',
  templateUrl: './homefacte.component.html',
  styleUrls: ['./homefacte.component.scss']
})
export class HomefacteComponent extends BaseComponent implements OnInit {

  grid: { data: [], cols: [] }

  constructor(private contribService: FacteContribService,
    private facteService: FacteComprobService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadFacturas();
  }

  loadFacturas() {
    this.facteService.listar().subscribe(res => {
      if (this.isResultOk(res)) {
        this.grid = res.comprobantes;
      }
    })
  }

  imprime(tipo, clave) {
    if (tipo === 1) {
      this.facteService.genRIDEPDF(clave);
    }
    else {
      this.facteService.genRIDEXML(clave);
    }
  }

}

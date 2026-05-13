import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { CreditoService } from 'src/app/services/credito.service';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-supplir-accounts-payable-list',
  templateUrl: './supplir-accounts-payable-list.component.html',
  styleUrl: './supplir-accounts-payable-list.component.scss'
})
export class SupplirAccountsPayableListComponent implements OnInit {

  @ViewChild('gridTable', { static: false }) private dataTable: Table | undefined;
  proveedores: any[] = [];
  selectedProveedor: any = null;
  tipospagos = [];
  tipopago = 1; // 0-todos, 1-con saldo pendiente, 2-pagados en su totalidad
  totalRecords = 0;
  rows = 12;
  page = 0;
  isDownloading = false;
  grid: any = {};
  isShowDetallesFactura = false;
  isShowDetallesCred = false;
  isLoading = false;
  totales = {saldopend:0.0};
  credsel: any;
  isShowDetallesDeuda = false;
  protected readonly Math = Math;

  gridDetalles: any = {};

  constructor(private creditoService: CreditoService,
    private personaService: PersonaService,
  ) {
    this.tipospagos = this.creditoService.getTiposPagos();
    this.loadProveedores()
  }

  ngOnInit(): void {

    this.isLoading = true;
    this.grid = {};
    this.isShowDetallesFactura = false;
    this.selectedProveedor = null;
    this.tipopago = 1;
    this.loadData();

  }

  clearFilter(){
    this.selectedProveedor = null;
    this.tipopago = 1;
    this.loadData();
  }

  loadProveedores() {
    this.personaService.listarProveedores().subscribe(res => {
      if (res.status === 200) {
        this.proveedores = res.items;
        //A la fila en this.proveedores tal que per_id sea -2 le cambiamos per_nombres por 'TODOS
        const todosIndex = this.proveedores.findIndex((prov: any) => prov.per_id === -2);
        if (todosIndex !== -1) {
          this.proveedores[todosIndex].per_nombres = 'TODOS';
        }
      }
    });
  }

  loadData() {
    this.updateTable();
  }

  updateTable() {
    this.isLoading = true;
    const provId = this.selectedProveedor ? this.selectedProveedor.per_id : 0;

    this.creditoService.findCreditosProvs(this.tipopago, provId, this.rows, this.page).subscribe(res => {
      if (res.status === 200) {
        this.grid = res.grid;
        if (res.grid.total) {
          this.totalRecords = res.grid.total;
        }
        if (res.grid.totales) {
          this.totales = res.grid.totales;
        }
      }
      this.isLoading = false;
      console.log('isLoading:', this.isLoading);      
    });
  }

  loadDetalles(credprov: number) {
    this.creditoService.findDetailCreditoProv(credprov).subscribe(res => {
      if (res.status === 200) {
        this.gridDetalles = res.details;
        this.isShowDetallesDeuda = true;
      }
    });
  }

  doLazyLoad($event: TableLazyLoadEvent) {
    if ($event.first !== undefined) {
      this.page = $event.first;
      this.updateTable();
    }
  }

  onTipoBusquedaChange() {
    this.loadData();
  }

  verRow(rowData:any) {
        this.credsel = rowData;
        this.isShowDetallesCred = true;
    }

    closeDetFact() {
        this.isShowDetallesFactura = false;
    }
    hideDetCredito() {
        this.isShowDetallesCred = false;
    } 
    onShowDetalles($event:any){        
            this.loadDetalles(this.credsel.crpr_codigo);
    }

}

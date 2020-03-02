import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {ReferenteService} from '../../../services/referente.service';

@Component({
  selector: 'app-referentes-list',
  templateUrl: './referentes-list.component.html',
  styleUrls: ['./referentes-list.component.css']
})
export class ReferentesListComponent implements OnInit {

  tiposRef: SelectItem[];
  selectedType: number;
  filtro: string;
  items: Array<any>;

  constructor(private refService: ReferenteService) {
    this.tiposRef = [
      {label: 'Cliente', value: 1, icon: 'fa fa-fw fa-cc-paypal'},
      {label: 'Proveedor', value: 2, icon: 'fa fa-fw fa-cc-visa'},
      {label: 'Personal', value: 3, icon: 'fa fa-fw fa-cc-mastercard'}
    ];
    this.selectedType = 1;
    this.items = [];
  }

  ngOnInit() {
    this.listar();
  }

  doFilter(ev: any) {

  }

  goToForm() {

  }

  selectItem(item: any) {
    console.log('select item..>');
    console.log(item);
  }

  listar() {
    console.log('Se ejecuta listar-->');
    console.log(this.selectedType);
    this.refService.listar(this.selectedType).subscribe(res => {
      if (res.status === 200) {
        this.items = res.items;
      }
    });
  }

}

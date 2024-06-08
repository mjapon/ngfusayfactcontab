import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-aguadash',
    template: `    
    <div>
        <div class="card border-primary"> 
            <div class="card-header">
                <div class="d-flex justify-content-between mb-2">              
                        <div class="d-flex w-75 justify-content-between">
                            <h5>{{datosmedidor.nomapel}} </h5>
                            <h5>Num CI: {{datosmedidor.per_ciruc}} </h5>
                            <h5>Medidor: {{datosmedidor.mdg_num}} </h5>
                        </div>
                        <div>                    
                            <button class="btn btn-outline-primary" (click)="cerrar()"> 
                                <span class="fa-solid fa-xmark"></span>
                                Cerrar 
                            </button>
                        </div>
                    </div>
                </div>        
            <div>       
        </div>
        <div class="my-2">
            <ul class="nav nav-tabs">
                <li class="nav-item hand" (click)="currentTab=1">
                    <a class="nav-link " [ngClass]="currentTab===1?'active':''"  aria-current="page" >Lecturas</a>
                </li>
                <li class="nav-item hand" (click)="currentTab=2">
                    <a class="nav-link" [ngClass]="currentTab===2?'active':''"> Datos del contrato </a>
                </li>
                <li class="nav-item hand" (click)="currentTab=3">
                    <a class="nav-link" [ngClass]="currentTab===3?'active':''"> Adelantos </a>
                </li>
            </ul>
            <div *ngIf="currentTab===1">
                <div class="mt-4">
                    <app-lecturasmed [numed]="datosmedidor.mdg_id"></app-lecturasmed>                
                </div>
            </div>
            <div *ngIf="currentTab===2">
                <div class="m-3">
                <app-datosmedserver [numed]="datosmedidor.mdg_id"></app-datosmedserver>
                </div>                
            </div>
            <div *ngIf="currentTab===3">
                <div class="m-3">
                    <app-adelantos [perid]="datosmedidor.per_id"></app-adelantos>
                </div>
            </div>

        </div>
    </div>    
    `
})
export class AguadashComponent {
    @Input() datosmedidor: any = {};
    @Output() evClosed = new EventEmitter<any>();
    currentTab: number = 1;

    cerrar() {
        this.evClosed.emit('');
    }

    loadLecturas() {

    }

}
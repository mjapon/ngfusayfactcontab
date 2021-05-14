import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-butoldent',
    template: `
        <div class="viewtooldiente rounded border border-danger text-rojo hand"
             title="Sellante necesario" *ngIf="idtool===1">
            *
        </div>
        <div class="viewtooldiente rounded border border-primary text-azul hand"
             title="Sellante realizado" *ngIf="idtool===2">*
        </div>
        <div class="viewtooldiente rounded border border-danger text-rojo hand"
             title="Extracción Indicada" *ngIf="idtool===3">
            <span class="fa fa-times text-danger"></span>
        </div>
        <div class="viewtooldiente rounded border border-primary text-azul hand"
             title="Pérdida por caries" *ngIf="idtool===4">
            <span class="fa fa-times"></span>
        </div>
        <div class="viewtooldiente rounded border border-danger hand"
             title="Endodoncia Necesaria" *ngIf="idtool===6">
            <p class="endonecesaria"></p>
        </div>
        <div class="viewtooldiente rounded border border-primary hand"
             title="Endodoncia Realizada" *ngIf="idtool===7">
            <p class="endorealizada"></p>
        </div>
        <div class="viewtooldiente rounded border border-danger text-rojo hand"
             title="Corona Necesaria" *ngIf="idtool===11">
            O
        </div>
        <div class="viewtooldiente  rounded border border-primary text-azul hand"
             title="Corona Realizada" *ngIf="idtool===12">
            O
        </div>
        <div class="viewtooldiente rounded border border-success hand" title="Implante" *ngIf="idtool===15">
            I
        </div>
        <div class="viewtooldiente rounded border border-success hand" title="Implante" *ngIf="idtool===18">
            DS
        </div>
    `
})
export class ButooldentComponent implements OnInit {

    @Input() idtool: number;

    constructor() {

    }

    ngOnInit(): void {

    }
}

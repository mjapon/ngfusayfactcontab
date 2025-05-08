import {Component, Input} from '@angular/core';
import {EstadisticaMedicaVo} from '../../sharedmed/types/estadistica-medica-vo';
import {KnobModule} from 'primeng/knob';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-estmedcard',
    standalone: true,
    imports: [
        KnobModule,
        NgForOf,
        FormsModule
    ],
    templateUrl: './estmedcard.component.html',
    styleUrl: './estmedcard.component.scss'
})
export class EstmedcardComponent {

    @Input() estadisticaInfo: EstadisticaMedicaVo;

}

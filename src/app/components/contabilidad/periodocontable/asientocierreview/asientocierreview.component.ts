import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-asientocierreview',
    templateUrl: './asientocierreview.component.html',
    styles: [
        `.haberl {
            margin-left: 70px;
        }
        `]
})
export class AsientoCierreViewComponent{
    @Input() detalles = [];
    @Input() totales:any = {};
}
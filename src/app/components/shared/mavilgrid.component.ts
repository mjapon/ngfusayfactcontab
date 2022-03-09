import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-mavilgrid',
    template: `
        <div>
            <p-table [value]="grid.data" [paginator]="true" [rows]="50"
                     selectionMode="single"
                     [responsive]="true"
                     [resizableColumns]="true">
                <ng-template pTemplate="header">
                    <tr>
                        <th *ngFor="let item of grid.cols" [pSortableColumn]="item.field"
                            [ngSwitch]="item.field"
                            [width]="item.width">
                            <span class="fontsizesm">{{item.label}}</span>
                            <p-sortIcon [field]="item.field"></p-sortIcon>
                        </th>
                        <th *ngIf="isViewCol">

                        </th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowData>
                    <tr [pSelectableRow]="rowData" [pContextMenuRow]="rowData" (dblclick)="onrowdblclick(rowData)">
                        <td *ngFor="let item of grid.cols" [width]="item.width">
                            <span class="p-column-title">{{item.label}}</span>
                            <span class="fontsizesm">{{rowData[item.field]}}</span>
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage" let-columns>
                    <tr>
                        <td [attr.colspan]="grid.cols?.length+1">
                            <span class="text-muted">No hay registros</span>
                        </td>
                        <td *ngIf="isViewCol">
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>`
})
export class MavilgridComponent {
    @Input() grid: any = {};
    @Input() isViewCol = false;
    @Output() evRowDoubleClick = new EventEmitter<any>();

    constructor() {
    }

    onrowdblclick($ev: any) {
        this.evRowDoubleClick.emit('');
    }
}

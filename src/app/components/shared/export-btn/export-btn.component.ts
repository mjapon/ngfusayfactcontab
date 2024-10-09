import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-export-btn',
    templateUrl: './export-btn.component.html'
})
export class ExportBtnComponent implements OnInit {

    @Input()
    totalRecord = 0;

    @Input()
    type = 1; // 1:pdf, 2:excel

    labelBase = 'Exportar el listado de resultados a ';
    title = '';
    label = 'PDF';

    @Input()
    isDownloading = false;

    @Output() onClic = new EventEmitter();

    ngOnInit(): void {
        if (this.type === 1) {
            this.label = 'PDF';
        } else if (this.type === 2) {
            this.label = 'Excel';
        }
        this.title = `${this.labelBase} ${this.label}`;
    }

    doExportAction() {
        this.onClic.emit();
    }
}

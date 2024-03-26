import {Injectable} from '@angular/core';

import {FileUtilService} from './fileutil.service';

@Injectable({
    providedIn: 'root'
})
export class ExcelUtilService extends FileUtilService {

    arrayBuffer: any;

    allowedMimeTypesXls = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    getDateAsString() {
        const fecha = new Date();
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear().toString();
        return `${dia}/${mes}/${anio}`;
    }

    downloadExcelFile(res: Blob, filename: string, addDate = true) {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        const stringDate = this.getDateAsString();
        a.href = url;
        a.download = `${filename}${addDate ? '_' + stringDate : ''}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    validateExcelMimeType(file) {
        return this.allowedMimeTypesXls.includes(file.type);
    }
}

import {Injectable} from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})
export class ReportscontaService {


    exportPdf(datosbalance: Array<any>, formfechas: any, nombrearchivo: string, titulo: string) {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(titulo, 11, 8);
        doc.setFontSize(14);
        doc.text(`${formfechas.desdestr} - ${formfechas.hastastr}`, 11, 14);
        doc.setFontSize(11);
        doc.setTextColor(100);
        (doc as any).autoTable({
            columns: [
                {header: 'CÓDIGO', dataKey: 'codigo'},
                {header: 'NOMBRE', dataKey: 'nombre'},
                {header: 'SALDO', dataKey: 'total'},
            ],
            body: datosbalance,
            theme: 'plain',
            didDrawCell: data => {
            }
        });
        doc.save(`${nombrearchivo}.pdf`);
    }

    exportExcel(datosbalance: Array<any>, nombrearchivo: string) {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(datosbalance);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, nombrearchivo);
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        import('file-saver').then(FileSaver => {
            const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const EXCEL_EXTENSION = '.xlsx';
            const data: Blob = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    }

}

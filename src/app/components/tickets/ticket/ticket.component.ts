import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../../services/ticket.service";
import {parse} from "date-fns";
import {DateFormatPipe} from "../../../pipes/date-format.pipe";
import {SwalService} from "../../../services/swal.service";
/*import {PdfMakeWrapper} from "pdfmake-wrapper";
import * as jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
*/

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

    items: Array<any>;
    cols: Array<any>;
    selectedItem: any;
    dia: Date;

    es: any;
    enableBtns: boolean;


    constructor(private router: Router,
                private route: ActivatedRoute,
                private swalService: SwalService,
                private ticketService: TicketService,
                private dateFormatPipe: DateFormatPipe) {
    }

    ngOnInit() {
        this.items = new Array<any>();
        this.cols = new Array<any>();

        this.es = {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Borrar'
        };

        this.ticketService.getFormListado().subscribe(res => {
            this.dia = parse(res.dia, 'd/M/yyyy', new Date());
            this.loadGrid();
        });
    }

    onRowSelect(event) {
        this.enableBtns = true;
    }

    onUnRowSelect(event) {
        this.enableBtns = false;
    }

    loadGrid() {
        const diaStr = this.dateFormatPipe.transform(this.dia);
        this.ticketService.listar(diaStr).subscribe(res => {
            this.cols = res.res.cols;
            this.items = res.res.data;
        });
    }

    selectItem(item: any) {
        this.selectedItem = item;
    }


    nuevo() {
        this.router.navigate(['ticket', 'form']);
    }

    imprimir() {
        if (this.selectedItem) {
            console.log(this.selectedItem);
            this.ticketService.imprimir(this.selectedItem.tk_id);
        }
    }

    anular() {
        if (this.selectedItem) {
            console.log(this.selectedItem.tk_id);
            this.swalService.fireDialog('¿Confirma que desea anular este ticket?', '').then(confirm => {
                    if (confirm.value) {
                        this.ticketService.anular(this.selectedItem.tk_id).subscribe(res => {
                            if (res.status === 200) {
                                this.swalService.fireToastSuccess(res.msg);
                                this.loadGrid();
                            }
                        });
                    }
                }
            );
        }
    }

    /*
    generatePdf() {
        const pdf: PdfMakeWrapper = new PdfMakeWrapper();
        pdf.add("Hola mundo");
        pdf.create().print();
    }

    genjspdf() {
        let doc = new jsPDF({format: [310.96, 303.02]});
        doc.setFont("helvetica");
        doc.setFontSize(10);
        //let doc = new jsPDF({format: 'a4'});
        doc.rect(5, 10, 40, 20);
        doc.text(15, 15, 'Ticket Nro');

        doc.text(69, 15, 'Fundación');
        doc.text(60, 20, '"Salud y Vida Nueva"');
        doc.text(61, 25, 'Centro de Curación');

        doc.text(15, 40, 'Nombre:');
        doc.text(15, 47, 'Fecha:');
        doc.text(15, 54, 'Servicios que requiere el paciente:');

        doc.rect(10, 60, 5, 5);
        doc.rect(10, 67, 5, 5);
        doc.rect(10, 74, 5, 5);
        doc.rect(10, 81, 5, 5);

        doc.text(20, 60, 'CONSULTA YACHACK');
        doc.text(20, 67, 'LIMPIA');
        doc.text(20, 74, 'CEREMONIA');
        doc.text(20, 81, 'TEMAZCAL');
        doc.text(20, 88, 'CONSULTA MEDICA');

        doc.text(10, 91, 'Codigo P.');
        doc.rect(10, 93, 23, 11);

        doc.text(55, 91, 'Valor:');
        doc.rect(70, 92, 23, 13);

        window.open(doc.output('bloburl'), '_blank', "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=500,height=700");
    }
    */

}

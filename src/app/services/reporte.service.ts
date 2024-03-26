import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArrayutilService } from './arrayutil.service';
import { BaseService } from './base-service';
import { CtesService } from './ctes.service';
import { DomService } from './dom.service';
import { FautService } from './faut.service';
import { FechasService } from './fechas.service';
import { LocalStorageService } from './local-storage.service';
import { ExcelUtilService } from './utils/excelutil.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})
export class ReporteService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService,
        private ctes: CtesService,
        private domService: DomService,
        private arrayService: ArrayutilService,
        private fechasService: FechasService,
        private excelUtil: ExcelUtilService
    ) {
        super('/treporte', localStrgServ, http);
    }

    listar() {
        return this._doGetAction(this.ctes.listar);
    }

    getForm() {
        return this._doGetAction(this.ctes.form);
    }

    clearParams(repsel: any, form: any) {
        if (!repsel.params.secid) {
            form.secid = 0;
        }
        if (!repsel.params.usid) {
            form.usid = 0;
        }
        if (!repsel.params.refid) {
            form.refid = 0;
        }
    }

    getParsedParams(form: any, codrep: number, secciones: Array<any>, usuarios: Array<any>) {
        const pdesde = this.fechasService.formatDateDb(form.desde);
        const phasta = this.fechasService.formatDateDb(form.hasta);
        const secid = form.secid;
        const refid = form.refid;
        const usid = form.usid;
        const fmt = form.formato;
        const sqm = this.fautService.getEsquema();

        const labelparamsArray = [];
        labelparamsArray.push(`Fechas:${pdesde} - ${phasta}`);
        if (secid > 0) {
            const sec = this.arrayService.findSeccion(secciones, secid);
            if (sec) {
                labelparamsArray.push(`Sección:${sec.sec_nombre}`);
            }
        }
        if (usid > 0) {
            const user = this.arrayService.findUsuario(usuarios, usid);
            if (user) {
                labelparamsArray.push(`Usuario:${user.nomapel}`);
            }
        }
        if (refid > 0) {
            labelparamsArray.push(`Referente:${form.referente.nomapel}`);
        }
        const labelparams = labelparamsArray.join(',');
        const codemp = this.fautService.getEmpCodigo();
        return { codemp, codrep, pdesde, phasta, secid, refid, usid, fmt, labelparams };
    }

    _viewBlob(data, contentType) {
        var file = new Blob([data], {
            type: contentType
        });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    showPdfGenReporte(data) {
        this._viewBlob(data, 'application/pdf');
    }

    downloadExcelGenReporte(data) {
        this.excelUtil.downloadExcelFile(data, 'ReporteGen');
    }

    runGenReporte(params) {
        const urlTomcat = this.ctes.urlTomcat;
        const empCodigo = this.fautService.getEmpCodigo();
        const uri = `${urlTomcat}/report-gen/${empCodigo}`;
        return this.http.post(uri, params, {
            responseType: 'blob'
        });
    }


    imprimirReporte(params: any) {
        /*const urlTomcat = this.ctes.urlTomcat;
        const empCodigo = this.fautService.getEmpCodigo();
        const uri = `${urlTomcat}/report-gen/${empCodigo}`;
        const req = this.http.post(uri, params, {
            responseType: 'blob'
        });*/
        this.runGenReporte(params).subscribe((res: Blob) => {
            if (params.fmt.toString() === '1') {
                this._viewBlob(res, 'application/pdf');
            }
            else if (params.fmt.toString() === '2') {
                this.excelUtil.downloadExcelFile(res, 'ReporteGen');
            }
        });
    }

}

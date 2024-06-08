import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';
import {FautService} from './faut.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class CitasMedicasService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        protected fautService: FautService,
        private ctes: CtesService
    ) {
        super('/tconsultam', localStrgServ, http);
    }

    getForm(): Observable<any> {
        return this._doGetAction(this.ctes.form);
    }

    getCie10Data(): Observable<any> {
        return this._doGetAction('cie10data');
    }

    crearCita(form: any): Observable<any> {
        return this._doPostAction(this.ctes.registra, form);
    }

    editarCita(form: any): Observable<any> {
        return this._doPostAction(this.ctes.editar, form);
    }

    getListaAtenciones(ciruc: string): Observable<any> {
        return this._doGetAction('listaatenciones', {ciruc});
    }

    getAntecedentes(pac: number): Observable<any> {
        return this._doGetAction('findhistantecedentes', {pac});
    }

    saveAntecedentes(pac, antecedentes) {
        return this._doPostAction('saveantp', {pac, antecedentes});
    }

    getDatosHistoriaByCod(codhistoria: any): Observable<any> {
        return this._doGetAction('findhistbycod', {codhistoria});
    }

    imprimir(ccm: any) {
        const empCodigo = this.fautService.getEmpCodigo();
        const baseurl = this.ctes.urlTomcat;
        const url = `${baseurl}/receta/${empCodigo}/${ccm}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirRecBlank() {
        const empCodigo = this.fautService.getEmpCodigo();
        const baseurl = this.ctes.urlTomcat;
        const url = `${baseurl}/receta-empty/${empCodigo}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    imprimirHistoria(ch: any) {
        const sqm = this.fautService.getEsquema();
        const baseurl = this.ctes.urlTomcat;
        const empCodigo = this.fautService.getEmpCodigo();
        const url = `${baseurl}/historia-clinica/${empCodigo}/${ch}`;
        window.open(url, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }

    getDescValExamFisico(categ: number, valor: any) {
        return this._doGetAction('galertexfis', {valor, categ});
    }

    anular(cosmId: number, obs): Observable<any> {
        return this._doPostAction(this.ctes.anular, {cosm_id: cosmId, cosm_obsanula: obs});
    }

    listarPrevias(tipo: number, filtro: string, desde: string, hasta: string, pag: number) {
        return this._doGetAction('cpreviasfiltropag', {tipo, filtro, desde, hasta, pag});
    }

    listarProximas(tipofecha: number, tipocita: number) {
        return this._doGetAction('proxcitas', {tipofecha, tipocita});
    }

    calcularIMC(it: any, examsfisicos: any, resultIMC, fnthen) {
        let datosAlertaImc: any = {};
        let datosAlertaPresion: any = {};
        let valorPeso: any = '0';
        let valorTalla: any = '0';
        let filaIMC: any;
        examsfisicos.forEach(e => {
            const nombredato = e.cmtv_nombre;
            if (nombredato === 'EXFIS_PESO') {
                valorPeso = e.valorreg;
            } else if (nombredato === 'EXFIS_TALLA') {
                valorTalla = e.valorreg;
            } else if (nombredato === 'EXFIS_IMC') {
                filaIMC = e;
            }
        });
        const valorPesoNumber = Number(valorPeso);
        const valorTallaNumber = Number(valorTalla);
        let imc = Number('0');
        if (valorTallaNumber !== 0) {
            imc = valorPesoNumber / (valorTallaNumber * valorTallaNumber);
        }
        const imcRounded = imc.toFixed(2);
        if (filaIMC) {
            filaIMC.valorreg = imcRounded;
            this.getDescValExamFisico(3, imcRounded).subscribe(resimc => {
                if (resimc.status === 200) {
                    const result = resimc.result;
                    const color = resimc.color;
                    datosAlertaImc = {msg: result, color};
                    resultIMC.imc = datosAlertaImc;
                    fnthen();
                }
            });
        }

        if (it.cmtv_nombre === 'EXFIS_IMC') {
            this.getDescValExamFisico(3, imcRounded).subscribe(resa => {
                if (resa.status === 200) {
                    const result = resa.result;
                    const color = resa.color;
                    datosAlertaImc = {msg: result, color};
                    resultIMC.imc = datosAlertaImc;
                    fnthen();
                }
            });
        } else if (it.cmtv_nombre === 'EXFIS_TA') {
            this.getDescValExamFisico(1, it.valorreg).subscribe(resb => {
                if (resb.status === 200) {
                    const result = resb.result;
                    const color = resb.color;
                    datosAlertaPresion = {msg: result, color};
                    resultIMC.presion = datosAlertaPresion;
                    fnthen();
                }
            });
        }
    }

}

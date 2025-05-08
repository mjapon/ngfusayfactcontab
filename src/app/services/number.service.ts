import {Injectable} from '@angular/core';
import {LoggedHomeComponent} from '../components/logged/logged-home/logged-home.component';

@Injectable({
    providedIn: 'root'
})
export class NumberService {

    // private iva: number;
    // private ivaplus: number;
    private readonly defndigits: number;

    constructor() {
        // this.iva = null;
        // this.ivaplus = null;
        this.defndigits = 6;
    }

    getIvaPlus(valorIva: number) {
        return 1.0 + valorIva;
    }

    round(valor: number, digits: number): number {
        const rounded = Number(valor).toFixed(digits);
        return Number(rounded);
    }

    round4(valor: number): number {
        return this.round(valor, 4);
    }

    round2(valor: number): number {
        return this.round(valor, 2);
    }

    round6(valor: number): number {
        return this.round(valor, this.defndigits);
    }

    quitarIva(valor: number, valorIva: number): number {
        const siniva = Number(valor) / this.getIvaPlus(valorIva);
        return this.round(siniva, this.defndigits);
    }

    ponerIva(valor: number, valorIva: number): number {
        const coniva = Number(valor) * this.getIvaPlus(valorIva);
        return this.round(coniva, this.defndigits);
    }

    /**
     * Retorna el valor del porcentaje aplicado al monto especificado
     * @param valor: El monto del que se desea onbtener el valor del iva
     */
    getValorIva(valor: number, valorIva: number): number {
        const valoriva = Number(valor) * valorIva;
        return this.round6(valoriva);
    }

    recalcTotalFila(fila) {
        let subtotal = 0.0;
        let ivaval = 0.0;
        let ivavaldescg = 0.0;
        let total = 0.0;
        let subtforiva = 0.0;
        let subtforivadescg = 0.0;
        const dtDecto = fila.dt_decto;
        const dtDectoCant = dtDecto * fila.dt_cant;
        const dtDectoGen = fila.dt_dectogen;
        try {
            subtotal = fila.dt_cant * fila.dt_precio;
            subtforiva = subtotal - dtDectoCant - dtDectoGen;
            subtforivadescg = subtotal - dtDectoCant;
            if (fila.icdp_grabaiva) {
                ivaval = this.getValorIva(subtforiva, fila.dai_impg);
                ivavaldescg = this.getValorIva(subtforivadescg, fila.dai_impg);
            }
            total = this.round6(subtotal - dtDectoCant - dtDectoGen + ivaval);
            fila.subtotal = this.round6(subtotal);
            fila.subtforiva = this.round6(subtforiva);
            fila.ivaval = this.round6(ivaval);
            fila.ivavaldescg = this.round6(ivavaldescg);
            fila.total = this.round4(total);
        } catch (e) {
            console.error('Error  al calcular totales de fila', e);
        }
        fila.dt_valor = fila.subtforiva;
        return fila;
    }

    setDectoGenInDetails(descglobal, totales, detalles) {
        const total = (totales.subtotal || 0) - (totales.descuentos || 0) + (totales.ivasindescg || 0);
        if (descglobal > total) {
            descglobal = 0;
        }
        let porcDescGlobal = 0.0;
        if (total > 0) {
            porcDescGlobal = descglobal / total;
        }

        detalles.forEach(fila => {
            fila.dt_dectogen = this.round6(porcDescGlobal * ((fila.dt_cant * fila.dt_precio) - fila.dt_decto));
            this.recalcTotalFila(fila);
        });
    }

    totalizar(detalles: Array<any>) {
        let subtotal12 = 0.0000;
        let subtotal0 = 0.0000;
        let ivaval = 0.0000;
        let ivavaldescg = 0.0000;
        let descuentos = 0.0000;
        let descglobal = 0.0000;
        let total = 0.00;
        let subtotal = 0.0000;
        let subtforivadescg = 0.0000;
        let subtforiva = 0.0000;

        detalles.forEach(fila => {
            try {
                if (fila.dai_impg > 0) {
                    subtotal12 += fila.subtforiva;
                } else {
                    subtotal0 += fila.subtotal;
                }
                subtotal += fila.subtotal;
                ivaval += fila.ivaval;
                ivavaldescg += fila.ivavaldescg;
                total += fila.total;
                descuentos += (fila.dt_decto * fila.dt_cant);
                descglobal += fila.dt_dectogen;
                subtforiva += fila.subtforiva;
                subtforivadescg += fila.subtforiva;
            } catch (e) {
                console.error('Error al totalizar', e);
            }
        });

        const totales = {
            subtotal: this.round4(subtotal),
            subtotal12: this.round4(subtotal12),
            subtotal0: this.round4(subtotal0),
            iva: this.round4(ivaval),
            ivasindescg: this.round4(ivavaldescg),
            descuentos: this.round4(descuentos),
            total: this.round2(total),
            descglobal: this.round4(descglobal),
            subtforiva: this.round4(subtforiva)
        };
        return totales;
    }

    /*getIvasArray() {
        return [{label: 'Si', value: true}, {label: 'No', value: false}];
    }*/

    checkPagosPrevios(docpagos, totales, formaspago) {
        const filtered = docpagos.filter(row => (row.ic_clasecc === 'XC' || row.ic_clasecc === 'XP'));
        let totalcred = 0.0;
        let totalefec = 0.0;
        if (filtered && filtered.length > 0) {
            totalcred = filtered[0].dt_valor;
            if (totalcred < totales.total) {
                totalefec = this.round2(totales.total - totalcred);
            } else {
                totalcred = totales.total;
            }

        } else {
            totalefec = totales.total;
        }

        formaspago[0].dt_valor = totalefec;
        formaspago[1].dt_valor = totalcred;
    }

    isNumeric(val) {
        return /^-?\d+$/.test(val);
    }

}


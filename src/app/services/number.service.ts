import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NumberService {

    private iva: number;
    private ivaplus: number;
    private defndigits: number;

    constructor() {
        this.iva = null;
        this.ivaplus = null;
        this.defndigits = 6;
    }

    setIva(iva: number) {
        this.iva = iva;
        this.ivaplus = 1.0 + this.iva;
    }

    getIva(): number {
        return this.iva;
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

    quitarIva(valor: number): number {
        const siniva = Number(valor) / this.ivaplus;
        return this.round(siniva, this.defndigits);
    }

    ponerIva(valor: number): number {
        const coniva = Number(valor) * this.ivaplus;
        return this.round(coniva, this.defndigits);
    }

    /**
     * Retorna el valor del porcentaje aplicado al monto especificado
     * @param valor: El monto del que se desea onbtener el valor del iva
     */
    getValorIva(valor: number): number {
        const valoriva = Number(valor) * this.iva;
        return this.round6(valoriva);
    }

    recalcTotalFila(fila) {
        let subtotal = 0.0;
        let ivaval = 0.0;
        let total = 0.0;
        let subtforiva = 0.0;
        const dtDecto = fila.dt_decto;
        try {
            subtotal = fila.dt_cant * fila.dt_precio;
            subtforiva = subtotal - dtDecto;
            fila.dai_impg = 0.0;
            if (fila.icdp_grabaiva) {
                ivaval = this.getValorIva(subtforiva);
                fila.dai_impg = this.getIva();
            }
            total = this.round6(subtotal - dtDecto + ivaval);
            fila.subtotal = this.round6(subtotal);
            fila.subtforiva = this.round6(subtforiva);
            fila.ivaval = this.round6(ivaval);
            fila.total = this.round4(total);
        } catch (e) {
            console.error('Error  al calcular totales de fila', e);
        }
        fila.dt_valor = this.round6(fila.subtforiva);
        return fila;
    }

    totalizar(detalles: Array<any>) {
        let subtotal12 = 0.0;
        let subtotal0 = 0.0;
        let ivaval = 0.0;
        let descuentos = 0.0;
        let total = 0.0;
        let subtotal = 0.0;

        detalles.forEach(fila => {
            try {
                if (fila.dai_impg > 0) {
                    subtotal12 += fila.subtforiva;
                } else {
                    subtotal0 += fila.subtotal;
                }
                subtotal += fila.subtotal;
                ivaval += fila.ivaval;
                total += fila.total;
                descuentos += fila.dt_decto;
            } catch (e) {
                console.error('Error al totalizar', e);
            }
        });

        const recaltotal = this.round2(subtotal) - this.round2(descuentos) + this.round2(ivaval);
        return {
            subtotal: this.round2(subtotal),
            subtotal12: this.round2(subtotal12),
            subtotal0: this.round2(subtotal0),
            iva: this.round2(ivaval),
            descuentos: this.round2(descuentos),
            total: this.round2(recaltotal)
        };
    }

    getIvasArray() {
        return [{label: 'Si', value: true}, {label: 'No', value: false}];
    }

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

}


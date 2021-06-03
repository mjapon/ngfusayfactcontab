import {Injectable} from '@angular/core';
import {CadsUtilService} from './cads-util.service';
import {SwalService} from './swal.service';

@Injectable({
    providedIn: 'root'
})
export class DomService {
    constructor(private cadsUtil: CadsUtilService,
                private swalService: SwalService) {
    }

    /**
     * Setea el foco en el input especificado dado su id
     * @param elId: Identificador del componente al que desea obtene el foco
     */
    setFocus(elId) {
        if (document.getElementById(elId)) {
            document.getElementById(elId).focus();
        }
    }

    setFocusTm(elId, timeout = 200) {
        setTimeout(() => {
                if (document.getElementById(elId)) {
                    document.getElementById(elId).focus();
                }
            }
            , timeout);
    }

    clonarObjeto(obj: any) {
        return Object.assign({}, obj);
    }

    txtInputFieldHasValue(input: any) {
        return input.value.toString().trim().length > 0;
    }

    cmbInputFieldHasValue(input: any) {
        return !(input.value === 0);
    }

    validFormData(form: any, fieldValidList: Array<any>) {
        let allvalid = true;
        let itemvalid = false;
        fieldValidList.forEach(field => {
            itemvalid = true;
            if (field.name in form) {
                if (field.select) {
                    try {
                        const selectValue = parseInt(form[field.name], 10);
                        itemvalid = selectValue > 0;
                    } catch (e) {
                    }
                } else {
                    itemvalid = !this.cadsUtil.isEmpty(form[field.name].toString());
                }
                if (!itemvalid) {
                    allvalid = false;
                    const msg = field.msg || 'Datos requerido, favor verificar';
                    this.swalService.fireToastWarn(msg);
                }
            }
        });
        return allvalid;
    }

    delayKeyup(callback, ms, prevtimer, context) {
        clearTimeout(prevtimer);
        return setTimeout(() => {
            callback(context);
        }, ms);
    }

}

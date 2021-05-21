import {Injectable} from '@angular/core';
import swal from 'sweetalert2';
import {MessageService} from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class SwalService {
    defmsg = 'Mensaje';
    info = 'info';
    success = 'success';
    warning = 'warning';
    warn = 'warn';
    error = 'error';

    constructor(private messageService: MessageService) {
    }

    showMsg(msg: string, type: any, title: string = this.defmsg) {
        swal.fire(title, msg, type);
    }

    fireInfo(msg: string, title: string = this.defmsg) {
        this.showMsg(msg, this.info, title);
    }

    fireSuccess(msg: string, title: string = this.defmsg) {
        this.showMsg(msg, this.success, title);
    }

    fireWarning(msg: string, title: string = this.defmsg) {
        this.showMsg(msg, this.warning, title);
    }

    fireError(msg: string, title: string = this.defmsg) {
        this.showMsg(msg, this.error, title);
    }

    fireDialog(msg: string, ptitle: string = '') {
        return swal.fire({
            title: ptitle,
            text: msg,
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true
        });
    }

    fireToast(pseverity: string, psummary: string, pdetail: string) {
        this.messageService.add({
            severity: pseverity,
            summary: psummary,
            detail: pdetail
        });
    }

    fireToastSuccess(summary: string, detail?: string) {
        this.fireToast(this.success, summary, detail);
    }

    fireToastInfo(summary: string, detail?: string) {
        this.fireToast(this.info, summary, detail);
    }

    fireToastWarn(summary: string, detail?: string) {
        this.fireToast(this.warn, summary, detail);
    }

    fireToastError(summary: string, detail?: string) {
        this.fireToast(this.error, summary, detail);
    }
}

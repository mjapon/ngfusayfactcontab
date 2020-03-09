import { Injectable } from '@angular/core';
import swal, { SweetAlertType } from 'sweetalert2';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  constructor(private messageService: MessageService) {}

  showMsg(msg: string, type: any, title: string = 'Mensaje') {
    swal.fire(title, msg, type);
  }

  fireInfo(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'info', title);
  }

  fireSuccess(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'success', title);
  }

  fireWarning(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'warning', title);
  }

  fireError(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'error', title);
  }

  fireDialog(msg: string, ptitle: string = '¿Esta segur@?') {
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
    this.fireToast('success', summary, detail);
  }

  fireToastInfo(summary: string, detail?: string) {
    this.fireToast('info', summary, detail);
  }

  fireToastWarn(summary: string, detail?: string) {
    this.fireToast('warn', summary, detail);
  }

  fireToastError(summary: string, detail?: string) {
    this.fireToast('error', summary, detail);
  }
}

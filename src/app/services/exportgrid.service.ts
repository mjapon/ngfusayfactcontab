import {Injectable} from '@angular/core';
import {BaseService} from './base-service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {CtesService} from './ctes.service';

@Injectable({
    providedIn: 'root'
})
export class ExportgridService extends BaseService {

    constructor(
        protected http: HttpClient,
        protected localStrgServ: LocalStorageService,
        private ctes: CtesService
    ) {
        super('/grid', localStrgServ, http);
    }

    exportListPDF(body: any) {
        const urlTomcat = this.ctes.urlTomcat;
        const uri = `${urlTomcat}/grid/pdf`;
        return this.http.post(uri, body, {
            responseType: 'arraybuffer'
        });
    }

    exportListExcel(body: any) {
        const urlTomcat = this.ctes.urlTomcat;
        const uri = `${urlTomcat}/grid/excel`;
        return this.http.post(uri, body, {
            responseType: 'blob',
        });
    }

    viewPdf(data) {
        const file = new Blob([data], {
            type: 'application/pdf'
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, this.ctes._blank, this.ctes.featuresOpenNewWin);
    }
}

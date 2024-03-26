import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FileUtilService {

    arrayBuffer: any;

    getRawStringDataFile(file: File) {
        const fileReader = new FileReader();
        const promiseReadData = this.fileReaderEmb(fileReader, false);
        fileReader.readAsArrayBuffer(file);
        return promiseReadData;
    }

    getBase64DataFile(file: File) {
        const fileReader = new FileReader();
        const promiseReadData = this.fileReaderEmb(fileReader, true);
        fileReader.readAsArrayBuffer(file);
        return promiseReadData;
    }

    async fileReaderEmb(fileReader: FileReader, base64 = false) {
        return new Promise<any>((resolve) => {
            fileReader.onload = () => {
                this.arrayBuffer = fileReader.result;
                const data = new Uint8Array(this.arrayBuffer);
                const arr = [];
                for (let i = 0; i < data.byteLength; i++) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr = arr.join('');
                if (base64) {
                    return resolve(window.btoa(bstr));
                } else {
                    resolve(bstr);
                }
            };
        });
    }

}

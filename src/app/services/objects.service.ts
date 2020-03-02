import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectsService {

  constructor() {
  }

  clone(obj: any) {
    const formToPost: any = {};
    for (const prop of Object.keys(obj)) {
      formToPost[prop] = obj[prop];
    }
    return formToPost;
  }

}

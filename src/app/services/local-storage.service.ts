import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  public setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getItem(key: string): string {
    return localStorage.getItem(key);
  }

  public removeItem(key: string) {
    localStorage.removeItem(key);
  }

  public getAuthToken(): string {
    return this.getItem('auToken');
  }

  public getFacteAuthToken(): string {
    return this.getItem('MvFacteAuToken');
  }

}

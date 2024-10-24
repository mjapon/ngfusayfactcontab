import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RegexUtilService {

    alphanumericSpacesPattern: RegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/;
    alphaUnderscorePattern: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚ_]+$/;
    positiveDecimalPattern: RegExp = /^(\d+(\.\d*)?|\.\d+)$/;

    isValidAlphaNumericWithSpaces(inputValue: string): boolean {
        return this.alphanumericSpacesPattern.test(inputValue);
    }

    isValidAlphaUnderscore(inputValue: string): boolean {
        return this.alphaUnderscorePattern.test(inputValue);
    }

    isValidDecimalPattern(inputValue: string): boolean {
        return this.positiveDecimalPattern.test(inputValue);
    }

}

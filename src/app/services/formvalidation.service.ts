import {AbstractControl} from '@angular/forms';

export class ValidationService {

  // function to set error messages
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Este dato es requerido',
      twoDecimalAllowed: 'Decimal value upto 2 decimal places is allowed.',
      invalidNumber: 'El valor ingresado es incorrecto',
      invalidCreditCard: 'Is invalid credit card number',
      invalidEmailAddress: 'El email ingresado es incorrecto',
      invalidPassword: 'New password and confirm password does not match',
      invalidDob: 'User must be minimum 16 Years old.',
      invalidUrl: 'Invalid URL',
      alphaNumericAllowed: 'Only apha numeric input is allowed',
      numericAllowed: 'El valor ingresado es incorrecto',
      emailTaken: 'Este correo ya ha sido registrado',
      minlength: `La longitud mínima es de ${validatorValue.requiredLength} caracteres`,
      maxlength: `La máxima longitud permitida es ${validatorValue.requiredLength} caracteres`
    };

    return config[validatorName];
  }

  static creditCardValidator(control: AbstractControl) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return {invalidCreditCard: true};
    }
  }

  static emailValidator(control: AbstractControl) {
    if (control.value.length == 0 || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return {invalidEmailAddress: true};
    }
  }

  static alpaNumValidator(control: AbstractControl) {
    if (control.value.match(/^[a-zA-Z0-9]*$/)) {
      return null;
    } else {
      return {alphaNumericAllowed: true};
    }
  }


  static numberValidator(control: AbstractControl) {
    if (!control.value || control.value.length == 0 || control.value.match(/^[0-9]*$/)) {
      return null;
    } else {
      return {numericAllowed: true};
    }
  }


  static decimalValidation(control: AbstractControl) {
    if (control.value.match(/^\d*\.?\d{0,2}$/g)) {
      return null;
    } else {
      return {twoDecimalAllowed: true};
    }
  }

  // function to validate that dob should be 16 years old
  static dobValidator(control: AbstractControl) {
    const currentDate = new Date();
    if (control.value) {
      const dob = new Date(control.value);
      const dobYear = dob.getFullYear();
      const maxDobYear = currentDate.getFullYear() - 16;
      // console.log(dobYear, maxDobYear)
      if (maxDobYear < dobYear) {
        return {invalidDob: true};
      } else {
        return null;
      }
    }
  }

  static urlValidator(control: AbstractControl) {
    const URL_REGEXP = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|in|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    if (control.value.match(URL_REGEXP)) {
      return null;
    } else {
      return {invalidUrl: true};
    }
  }

  static confirmPasswordValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({invalidPassword: true});
    }
    return null;
  }

}

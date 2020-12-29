// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    baseUrlEndPoint: 'http://192.168.0.129:6543/api',
    baseUrlDwfile: 'http://192.168.0.129:6543/getrxdoc',

    facebookLoginApp: '571164293604524',
    googleLoginApp: '702999941401-ql2c4rufsliivam2f7hub633brvicgk0.apps.googleusercontent.com',
    firebase: {
        apiKey: "AIzaSyAREf9q3yK7lyLNIK3MK_zpG02EHRwknkU",
        authDomain: "project-4433654025475623952.firebaseapp.com",
        databaseURL: "https://project-4433654025475623952.firebaseio.com",
        projectId: "project-4433654025475623952",
        storageBucket: "project-4433654025475623952.appspot.com",
        messagingSenderId: "702999941401",
        appId: "1:702999941401:web:91eae1915ce04725b1b588"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

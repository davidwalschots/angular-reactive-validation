// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests of the app
const contextApp = require.context('./src', true, /\.spec\.ts$/);
// And load the modules.
contextApp.keys().map(contextApp);

// Then we find all the tests of the lib
const contextLib = require.context('./angular-reactive-validation', true, /\.spec\.ts$/);
// And load the modules.
contextLib.keys().map(contextLib);

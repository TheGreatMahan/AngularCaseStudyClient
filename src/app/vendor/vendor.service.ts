import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASEURL } from '../constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  resourceURL: string;
  status: string;
  constructor(public http: HttpClient) {
    this.resourceURL = `${BASEURL}vendors`;
    this.status = '';
  } // constructor
  /**
   * Retrieves the vendor JSON, then returns the array to a subscriber
   * we're temporarily using an any type (typically a bad idea) because the Spring Boot
   * repository returns all the data in an "embedded" property
   */
  get(): Observable<any> {
    return this.http
      .get(this.resourceURL)
      .pipe(retry(1), catchError(this.handleError));
  } // load
  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    error.error instanceof ErrorEvent
      ? // Get client-side error
        (errorMessage = error.error.message)
      : // Get server-side error
        (errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`);
    window.alert(errorMessage); // probably should console.log when going into production
    return throwError(() => errorMessage);
  }
} // VendorService

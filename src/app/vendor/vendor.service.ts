import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASEURL } from '../constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Vendor } from './vendor';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  resourceURL: string;
  status: string;
  constructor(public http: HttpClient) {
    this.resourceURL = `${BASEURL}api/vendors`;
    this.status = '';
  } // constructor
  /**
   * Retrieves the vendor JSON, then returns the array to a subscriber
   * we're temporarily using an any type (typically a bad idea) because the Spring Boot
   * repository returns all the data in an "embedded" property
   */
  get(): Observable<Vendor[]> {
    return this.http
      .get<Vendor[]>(this.resourceURL)
      .pipe(retry(1), catchError(this.handleError));
  } // load

  /**
   * Update an vendor on the server using http put, server returns
   * updated vendor, then return it as Observable to caller
   */
  update(vendor: Vendor): Observable<Vendor> {
    return this.http
      .put<Vendor>(`${this.resourceURL}`, vendor)
      .pipe(retry(1), catchError(this.handleError));
  } // update

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

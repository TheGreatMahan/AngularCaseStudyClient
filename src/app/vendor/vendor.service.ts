import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '@app/vendor/vendor';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class VendorService extends GenericHttpService<Vendor> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `vendors`);
  } // constructor
} // VendorService

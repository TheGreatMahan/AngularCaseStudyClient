import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
@Component({
  templateUrl: 'vendor-home.component.html',
})
export class VendorHomeComponent implements OnInit {
  msg: string;
  vendors$?: Observable<Vendor[]>;
  vendor: Vendor;
  hideEditForm: boolean;
  todo: string;
  initialLoad: boolean;
  constructor(public vendorService: VendorService) {
    this.vendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: '',
    };
    this.msg = '';
    this.hideEditForm = true;
    this.initialLoad = true;
    this.todo = '';
  } // constructor
  ngOnInit(): void {
    this.msg = 'loading vendors from server...';
    (this.vendors$ = this.vendorService.get().pipe(
      tap(() => {
        if (this.initialLoad) {
          this.msg = 'vendors loaded!';
          this.initialLoad = false;
        }
      })
    )),
      catchError((err) => (this.msg = err.message));
  } // ngOnInit
  select(vendor: Vendor): void {
    this.todo = 'update';
    this.vendor = vendor;
    this.msg = `${vendor.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select
  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    msg ? (this.msg = 'Operation cancelled') : null;
    this.hideEditForm = !this.hideEditForm;
  } // cancel
  /**
   * update - send changed update to service
   */
  update(vendor: Vendor): void {
    this.vendorService.update(vendor).subscribe({
      // Create observer object
      next: (emp: Vendor) => (this.msg = `Vendor ${emp.id} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => (this.hideEditForm = !this.hideEditForm),
    });
  } // update
} // VendorHomeComponent

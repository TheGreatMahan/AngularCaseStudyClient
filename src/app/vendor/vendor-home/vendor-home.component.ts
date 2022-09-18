import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
@Component({
  templateUrl: 'vendor-home.component.html',
})
export class VendorHomeComponent implements OnInit {
  vendors: Array<Vendor>;
  msg: string;
  constructor(public vendorService: VendorService) {
    this.vendors = [];
    this.msg = '';
  } // constructor
  ngOnInit(): void {
    this.msg = 'loading vendors from server...';
    this.vendorService.get().subscribe({
      // Observer object, complete method intrinscally unsubscribes
      next: (payload: any) => {
        this.vendors = payload._embedded.vendors;
        this.msg = 'vendors loaded!!';
      },
      error: (err: Error) => (this.msg = `Get failed! - ${err.message}`),
      complete: () => {},
    }); // subscribe
  } // ngOnInit
} // VendorHomeComponent

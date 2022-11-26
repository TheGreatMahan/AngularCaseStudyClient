import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '@app/product/product';
import { Vendor } from '@app/vendor/vendor';
import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { PurchaseOrderLineItem } from '../purchase-order-line-item';
import { PDFURL } from '@app/constants';
import { VendorService } from '@app/vendor/vendor.service';
import { ProductService } from '@app/product/product.service';
import { PurchaseOrderService } from '../purchase-order.service';

@Component({
  templateUrl: './viewer.component.html',
  styles: [],
})

export class ViewerComponent implements OnInit, OnDestroy {
  viewerForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  purchaseorderid: FormControl;  
  formSubscription?: Subscription;
  products$?: Observable<Product[]>; 
  vendors$?: Observable<Vendor[]>; 
  purchaseorders$?: Observable<PurchaseOrder[]>;

  productMap: Map<string, string>;
  
  items: Array<PurchaseOrderLineItem>; 
  vendorProducts: Product[]; 
  purchaseorderProducts: Product[]; 
  
  selectedVendor: Vendor; 
  selectedPurchaseOrder: PurchaseOrder;   
  pickedProduct: boolean;
  pickedVendor: boolean;  
  hasPurchaseOrder: boolean;
  msg: string;
  sub: number;
  tax: number;
  total: number;
  purchaseorderno: number;  
  datecreated?: string;
  
  constructor(
    private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private purchaseorderService: PurchaseOrderService
  ) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.msg = '';

    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.purchaseorderid = new FormControl('');
    this.viewerForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      purchaseorderid: this.purchaseorderid,
    });
    this.selectedVendor = {
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
    this.selectedPurchaseOrder = {
      id: 0,
      vendorid: 0,
      amount: 0,
      items:[],
    };
    this.items = new Array<PurchaseOrderLineItem>();
    this.vendorProducts = new Array<Product>();
    this.purchaseorderProducts = new Array<Product>();
    this.hasPurchaseOrder = false;
    this.total = 0.0;
    this.sub = 0;
    this.tax = 0;
    this.purchaseorderno=0;  
    this.datecreated= "";
    this.productMap = new Map<string, string>();
  }
  ngOnInit(): void {
    this.onPickVendor();
    this.onPickPurchaseOrder();
    this.msg = 'loading vendors and products from server...';
    (this.vendors$ = this.vendorService.get()),
      catchError((err) => (this.msg = err.message));
    (this.products$ = this.productService.get()),
      catchError((err) => (this.msg = err.message));
    this.msg = 'Select vendor';
  } 
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } 
  onPickVendor(): void {
    this.formSubscription = this.viewerForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedVendor = val;
        this.pickedProduct = false;
        this.hasPurchaseOrder = false;
        this.msg = 'Choose PO for vendor';
        this.pickedVendor = true;        
        this.items = [];
        this.vendorProducts = [];
        this.purchaseorderProducts = [];
        this.purchaseorders$ = this.purchaseorderService
          .getSome(this.selectedVendor.id)
          .pipe(
            catchError((error) => {
              if (error.error instanceof ErrorEvent) {
                this.msg = `Error: ${error.error.message}`;
              } else {
                this.msg = `Error: ${error.message}`;
              }
              return of([]); 
            })
          );
      });
  }   
  onPickPurchaseOrder(): void {
    this.formSubscription = this.viewerForm
      .get('purchaseorderid')
      ?.valueChanges.subscribe((val) => {
        this.items=[];
        this.tax = 0;
        this.sub = 0;
        this.selectedPurchaseOrder = val;
        this.selectedPurchaseOrder.items.map((item: PurchaseOrderLineItem) => {
          this.items.push(item);
          this.sub += item.price;
          this.tax = this.sub * 0.13;
          this.total = this.sub + this.tax;
          this.products$!.pipe(
            map((products: Product[]) => {
              let pro: Product | undefined = products.find(
                product => product.id == item.productid
              );
              if (pro) {
                this.productMap.set(pro.id, pro.name);
              }
            })
          ).subscribe((pro) => {});
          this.purchaseorderno = this.selectedPurchaseOrder.id;
          this.datecreated = this.selectedPurchaseOrder.datecreated;
          this.msg = `Details for PO ${this.purchaseorderno}`;
          this.hasPurchaseOrder = true;
        });
      });
  }  viewPdf(): void {
    window.open(`${PDFURL}${this.purchaseorderno}`);
  }
}

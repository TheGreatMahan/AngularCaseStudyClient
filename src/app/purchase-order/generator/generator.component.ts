import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vendor } from '@app/vendor/vendor';
import { Product } from '@app/product/product';
import { PurchaseOrderLineItem } from '@app/purchase-order/purchase-order-line-item';
import { PurchaseOrder } from '@app/purchase-order/purchase-order';
import { VendorService } from '@app/vendor/vendor.service';
import { ProductService } from '@app/product/product.service';
import { PurchaseOrderService } from '@app/purchase-order/purchase-order.service';
@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styles: [],
})
export class GeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  qtyVal: FormControl;
  // data
  formSubscription?: Subscription;
  products$?: Observable<Product[]>; 
  vendors$?: Observable<Vendor[]>; 
  vendorproducts$?: Observable<Product[]>; 
  items: Array<PurchaseOrderLineItem>;
  selectedproducts: Product[];
  selectedProduct: Product; 
  selectedVendor: Vendor; 
  qtyOptions: Array<Number>;

  pickedProduct: boolean;
  pickedVendor: boolean;
  pickedQuantity: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  total: number;
  reportno: number = 0;
  tax: number = 0.13;
  subWithTax: number;
  sub: number;
  poid: number = 0;
  resetSelection: number;
  qty: number;
  constructor(
    private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private PurchaseOrderService: PurchaseOrderService
  ) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.generated = false;
    this.pickedQuantity = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.qtyVal = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      qtyVal: this.qtyVal,
    });
    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0.0,
      msrp: 0.0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
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
    this.items = new Array<PurchaseOrderLineItem>();
    this.selectedproducts = new Array<Product>();
    this.hasProducts = false;
    this.total = 0.0;
    this.sub = 0.0;
    this.subWithTax = 0.0;
    this.qtyOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.resetSelection = 0;
    this.qty = 0;
  } // constructor

  ngOnInit(): void {
    this.onPickVendor();
    this.onPickProduct();
    this.onPickQuantity();
    this.msg = 'loading vendors and products from the server...';
    (this.vendors$ = this.vendorService.get()),
      catchError((err) => (this.msg = err.message));
    (this.products$ = this.productService.get()),
      catchError((err) => (this.msg = err.message));
    this.msg = 'server data loaded';
  } // ngOnInit
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy
  /**
   * onPickVendor - Another way to use Observables, subscribe to the select change event
   * then load specific vendor products for subsequent selection
   */
  onPickVendor(): void {
    this.formSubscription = this.generatorForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = {
          id: '',
          vendorid: 0,
          name: '',
          costprice: 0.0,
          msrp: 0.0,
          rop: 0,
          eoq: 0,
          qoh: 0,
          qoo: 0,
          qrcode: '',
          qrcodetxt: '',
        };
        this.selectedVendor = val;
        this.loadVendorProducts();
        this.pickedProduct = false;
        this.hasProducts = false;
        this.pickedQuantity = false;
        this.msg = 'choose product for vendor';
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; 
        this.selectedproducts = []; 
      });
  } // onPickVendor
  /**
   * onPickProduct - subscribe to the select change event then
   * update array containing items.
   */
  onPickProduct(): void {
    const productSubscription = this.generatorForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = val;
        const item: PurchaseOrderLineItem = {
          id: 0,
          poid: 0,
          productid: this.selectedProduct?.id,
          qty: val.eoq,
          //qty: 0,
          //price: val.costprice ,
          price: val.costprice * val.eoq,
        };
        if (
          this.items.find((item) => item.productid === this.selectedProduct?.id)
        ) {
          // ignore entry
        } else {
          //this.generatorForm.get('qtyVal')?.setValue(null);
          this.msg = `${val.eoq} ${this.selectedProduct.name} added!`;
          // add entry
          this.items.push(item);
          this.selectedproducts.push(this.selectedProduct);
        }
        if (this.items.length > 0) {
          this.hasProducts = true;
          this.pickedProduct = true;
        }
        this.sub = 0.0;
        this.items.forEach((pro) => (this.sub += pro.price));
        this.subWithTax = this.sub * this.tax;
        this.total = this.sub + this.subWithTax;
      });
    this.formSubscription?.add(productSubscription); // add it as a child, so all can be destroyed together
  } // onPickProduct
  onPickQuantity(): void {
    const quantitySubscibtion = this.generatorForm
      .get('qtyVal')
      ?.valueChanges.subscribe((val) => {
        if (val === 'EOQ') {
          this.items.forEach((i) => {
            if (i.productid === this.selectedProduct?.id) {
              i.qty = this.selectedProduct.eoq;
              i.price = this.selectedProduct.costprice * i.qty;
              this.pickedQuantity = true;
            }
          });
          this.msg = `${this.selectedProduct.eoq} ${this.selectedProduct.name} added`;
        } else if (val === 0) {
          this.items = this.items.filter(
            (i) => i.productid !== this.selectedProduct?.id
          );
          this.selectedproducts = this.selectedproducts.filter(
            (i) => i.id !== this.selectedProduct?.id
          );
          this.msg = `All ${this.selectedProduct.name} removed!`;
        } else {
          this.items.map((i) => {
            if (i.productid === this.selectedProduct?.id) {
              i.qty = val;
              i.price = this.selectedProduct.costprice * i.qty;
              this.pickedQuantity = true;
            }
          });
          this.msg = `${val} ${this.selectedProduct.name} added!`;
        }
        if (this.items.length === 0) {
          this.hasProducts = false;
          this.pickedProduct = false;
          this.pickedQuantity = false;
          this.msg = `No Items`;
        }

        this.sub = 0.0;
        this.items?.forEach((i) => {
          this.sub += i.price;
        });
        this.subWithTax = this.sub * this.tax;
        this.total = this.sub + this.subWithTax;
      });

    this.formSubscription?.add(quantitySubscibtion);
  }
  /**
   * loadVendorProducts - filter for a particular vendor's products
   */
  loadVendorProducts(): void {
    this.vendorproducts$ = this.products$?.pipe(
      map((products) =>
        products.filter(
          (product) => product.vendorid === this.selectedVendor?.id
        )
      )
    );
  } // loadVendorProducts
  /**
   * createReport - create the client side report
   */
  addPO(): void {
    this.generated = false;
    const purchase: PurchaseOrder = {
      id: 0,
      items: this.items,
      vendorid: this.selectedProduct.vendorid,
      amount: this.total,
    };
    this.PurchaseOrderService.add(purchase).subscribe({
      // observer object
      next: (purchase: PurchaseOrder) => {
        // server should be returning purchase with new id
        purchase.id > 0
          ? (this.msg = `PurchaseOrder ${purchase.id} added!`)
          : (this.msg = 'PurchaseOrder not added! - server error');
        this.reportno = purchase.id;
      },
      error: (err: Error) =>
        (this.msg = `PurchaseOrder not added! - ${err.message}`),
      complete: () => {
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.generated = true;
        this.pickedQuantity = false;
      },
    });
  } // addPO()
} // GeneratorComponent

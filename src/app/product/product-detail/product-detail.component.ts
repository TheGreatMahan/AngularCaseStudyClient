import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '@app/product/product';
import { Vendor } from '@app/vendor/vendor';
import { ValidateDecimal } from '@app/validators/decimal.validator';
import { ValidateInt } from '@app/validators/int.validator';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  // setter
  @Input() selectedProduct: Product = {
    id: '',
    vendorid: 0,
    name: '',
    costprice: 0,
    msrp: 0.0,
    rop: 0.0,
    eoq: 0.0,
    qoh: 0.0,
    qoo: 0.0,
    qrcode: '',
    qrcodetxt: '',
  };
  @Input() vendors: Vendor[] | null = null;
  @Input() products: Product[] | null = null;

  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();
  productForm: FormGroup;
  id: FormControl;
  vendorid: FormControl;
  name: FormControl;
  costprice: FormControl;
  msrp: FormControl;
  rop: FormControl;
  eoq: FormControl;
  qoh: FormControl;
  qoo: FormControl;
  qrcode: FormControl;
  qrcodetxt: FormControl;
  constructor(private builder: FormBuilder) {
    this.id = new FormControl('', Validators.compose([this.uniqueCodeValidator.bind(this),Validators.required]));
    this.vendorid = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.costprice = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateDecimal])
    );
    this.msrp = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateDecimal])
    );
    this.rop = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateInt])
    );
    this.eoq = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateInt])
    );

    this.qoh = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateInt])
    );
    this.qoo = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateInt])
    );
    this.qrcode = new FormControl(
      ''
      //Validators.compose([Validators.required])
    );
    this.qrcodetxt = new FormControl(
      ''
      //Validators.compose([Validators.required])
    );
    this.productForm = this.builder.group({
      id: this.id,
      vendorid: this.vendorid,
      name: this.name,
      costprice: this.costprice,
      msrp: this.msrp,
      rop: this.rop,
      eoq: this.eoq,
      qoh: this.qoh,
      qoo: this.qoo,
      qrcode: this.qrcode,
      qrcodetxt: this.qrcodetxt,
    });
  } // constructor
  ngOnInit(): void {
    // patchValue doesn't care if all values are present
    this.productForm.patchValue({
      id: this.selectedProduct.id,
      vendorid: this.selectedProduct.vendorid,
      name: this.selectedProduct.name,
      costprice: this.selectedProduct.costprice,
      msrp: this.selectedProduct.msrp,
      rop: this.selectedProduct.rop,
      eoq: this.selectedProduct.eoq,
      qoh: this.selectedProduct.qoh,
      qoo: this.selectedProduct.qoo,
      qrcode: this.selectedProduct.qrcode,
      qrcodetxt: this.selectedProduct.qrcodetxt,
    });
  } // ngOnInit
  updateSelectedProduct(): void {
    this.selectedProduct.id = this.productForm.value.id;
    this.selectedProduct.vendorid = this.productForm.value.vendorid;
    this.selectedProduct.name = this.productForm.value.name;
    this.selectedProduct.costprice = this.productForm.value.costprice;
    this.selectedProduct.msrp = this.productForm.value.msrp;
    this.selectedProduct.rop = this.productForm.value.rop;
    this.selectedProduct.eoq = this.productForm.value.eoq;
    this.selectedProduct.qoh = this.productForm.value.qoh;
    this.selectedProduct.qoo = this.productForm.value.qoo;
    this.selectedProduct.qrcode = this.productForm.value.qrcode;
    this.selectedProduct.qrcodetxt = this.productForm.value.qrcodetxt;

    this.saved.emit(this.selectedProduct);
  } // updateSelectedProduct
  /**
   * uniqueCodeValidator - needed access to products property so not
   * with the rest of the validators
   */
  uniqueCodeValidator(control: AbstractControl): { idExists: boolean } | null {
    if (this.products !== undefined) {
      if (
        this.products?.find(
          (p) => p.id === control.value && !this.selectedProduct.id
        ) !== undefined
      ) {
        return { idExists: true };
      }
    }
    return null; // if we make it here there are no product codes
  } // uniqueCodeValidator
}

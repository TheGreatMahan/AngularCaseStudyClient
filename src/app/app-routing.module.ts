import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VendorHomeComponent } from './vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from './product/product-home/product-home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Case Study - Home' },
  { path: 'vendors', component: VendorHomeComponent, title: 'Case Study - Vendors' },
  { path: '', component: HomeComponent, title: 'Case Study - Home' },
  { path: 'products', component: ProductHomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

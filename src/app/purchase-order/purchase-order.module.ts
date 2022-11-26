import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { GeneratorComponent } from './generator/generator.component';
import { ViewerComponent } from './viewer/viewer.component';



@NgModule({
  declarations: [
    GeneratorComponent,
    ViewerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatComponentsModule,
  ]
})
export class PurchaseOrderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { GeneratorComponent } from './generator/generator.component';



@NgModule({
  declarations: [
    GeneratorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatComponentsModule,
  ]
})
export class PurchaseOrderModule { }

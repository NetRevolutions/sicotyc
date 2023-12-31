import { NgModule } from '@angular/core';
import { EmptyLayoutComponent } from './empty.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@/shared/shared.module';



@NgModule({
  declarations: [
    EmptyLayoutComponent
  ],
  imports: [
    RouterModule,
    SharedModule
  ],
  exports: [
    EmptyLayoutComponent
  ]
})
export class EmptyLayoutModule { }

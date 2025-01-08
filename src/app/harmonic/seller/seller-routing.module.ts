import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { SellerLayoutComponent } from 'src/app/shared/layout/seller-layout/seller-layout.component';

const routes: Routes = [
  {
    path: '',
    component: SellerLayoutComponent,
    children: [
      {
        path: 'add-product',
        component: AddProductComponent,
        title: 'Add Product Page',
      },
    ],
  },
  { path: '**', redirectTo: 'add-product' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}

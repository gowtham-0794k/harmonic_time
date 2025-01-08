import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerLayoutComponent } from 'src/app/shared/layout/seller-layout/seller-layout.component';
import { ListComponent } from './products/list/list.component';
import { DetailsComponent } from './products/details/details.component';
import { AddEditComponent } from './products/add-edit/add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SellerLayoutComponent,
    children: [
      {
        path: 'add-product',
        component: AddEditComponent,
        title: 'Add Product Page',
      },
      {
        path: 'add-product/:id',
        component: AddEditComponent,
        title: 'Edit Product Page',
      },
      {
        path: 'product-list',
        component: ListComponent,
        title: 'Product List Page',
      },
      {
        path: 'product-details/:id',
        component: DetailsComponent,
        title: 'Product Details Page',
      },
    ],
  },
  { path: '**', redirectTo: 'product-list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}

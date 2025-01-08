import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyerRoutingModule } from './buyer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListComponent } from './products/list/list.component';
import { DetailsComponent } from './products/details/details.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ListComponent,
    DetailsComponent,
    CartComponent,
    WishlistComponent,
    CheckoutComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    BuyerRoutingModule
  ]
})
export class BuyerModule { }

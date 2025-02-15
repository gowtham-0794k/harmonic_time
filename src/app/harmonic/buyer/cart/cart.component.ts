import { Component } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  couponCode: string = '';
  shipCost: number = 0;
  cartProducts$: any = this.cartService.getCartProducts();

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.loadCartProducts();
  }

  handleCouponSubmit() {
    if (this.couponCode) {
      this.couponCode = '';
    }
  }

  handleShippingCost(value: number | string) {
    if (value === 'free') {
      this.shipCost = 0;
    } else {
      this.shipCost = value as number;
    }
  }
}

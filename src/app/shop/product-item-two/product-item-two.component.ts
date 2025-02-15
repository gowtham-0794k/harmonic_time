import { Component, Input } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { IProduct } from 'src/app/shared/types/product-d-t';

@Component({
  selector: 'app-product-item-two',
  templateUrl: './product-item-two.component.html',
  styleUrls: ['./product-item-two.component.scss'],
})
export class ProductItemTwoComponent {
  @Input() product!: any; // IProduct;

  constructor(
    public cartService: CartService,
    public utilsService: UtilsService
  ) {}

  // add to cart
  addToCart(item: IProduct) {
    this.cartService.addCartProduct(item);
  }
  // Function to check if an item is in the cart
  isItemInCart(item: any): boolean {
    return this.cartService
      .getCartProducts()
      .some((prd: any) => prd.ProductID === item._id);
  }
}

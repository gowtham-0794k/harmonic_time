import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IProduct, Product } from '../../types/product-d-t';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Store } from '@ngrx/store';
import { selectCartItems } from 'src/app/store/selectors/cart.selectors';

@Component({
  selector: 'app-product-details-upper-buyer',
  templateUrl: './product-details-upper-buyer.component.html',
  styleUrls: ['./product-details-upper-buyer.component.scss'],
})
export class ProductDetailsUpperBuyerComponent {
  @Input() product!: any; //  Product;
  @Input() bottomShow: boolean = true;
  @Input() style_2: boolean = false;
  @Output() itemDetails: EventEmitter<any> = new EventEmitter<any>();
  cartItems: any = [];

  constructor(
    public productService: ProductService,
    public cartService: CartService,
    public store: Store
  ) {}

  ngOnInit() {
    this.store.select(selectCartItems).subscribe((state) => {
      if (state?.length) {
        this.cartItems = state;
      } else {
        this.cartItems = [];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.productService.activeImg = this.product.Images[0].ImageURL;
    }
  }

  isItemInCart(item: any): boolean {
    return this.cartItems.some((prd: any) => prd.ProductID === item._id);
  }
}

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

  constructor(
    public productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      console.log(this.product.Images[0].ImageURL);
      this.productService.activeImg = this.product.Images[0].ImageURL;
    }
  }

  editProduct(item: any) {
    this.itemDetails.emit(item); // Set Page Number
  }
}

import { Component } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from 'src/app/shared/types/product-d-t';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  public product: IProduct | undefined;
  constructor(private productService: ProductService) {
    this.productService.products.subscribe((products) => {
      this.product = products[0];
    });
  }
}

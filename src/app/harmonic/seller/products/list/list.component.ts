import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  public orders = [
    { id: '1', name: 'Product 1', price: '123.45' },
    { id: '2', name: 'Product 2', price: '178.23' },
    { id: '3', name: 'Product 3', price: '65.89' },
    { id: '4', name: 'Product 4', price: '150.75' },
    { id: '5', name: 'Product 5', price: '92.40' },
    { id: '6', name: 'Product 6', price: '134.88' },
    { id: '7', name: 'Product 7', price: '199.10' },
    { id: '8', name: 'Product 8', price: '74.32' },
    { id: '9', name: 'Product 9', price: '155.67' },
    { id: '10', name: 'Product 10', price: '83.45' },
    { id: '11', name: 'Product 11', price: '132.90' },
    { id: '12', name: 'Product 12', price: '105.30' },
    { id: '13', name: 'Product 13', price: '176.88' },
    { id: '14', name: 'Product 14', price: '98.50' },
    { id: '15', name: 'Product 15', price: '157.62' },
    { id: '16', name: 'Product 16', price: '129.70' },
    { id: '17', name: 'Product 17', price: '111.44' },
    { id: '18', name: 'Product 18', price: '188.99' },
    { id: '19', name: 'Product 19', price: '69.11' },
    { id: '20', name: 'Product 20', price: '158.45' },
    { id: '21', name: 'Product 21', price: '93.34' },
    { id: '22', name: 'Product 22', price: '178.22' },
    { id: '23', name: 'Product 23', price: '124.57' },
    { id: '24', name: 'Product 24', price: '63.78' },
    { id: '25', name: 'Product 25', price: '195.46' },
    { id: '26', name: 'Product 26', price: '137.24' },
    { id: '27', name: 'Product 27', price: '115.99' },
    { id: '28', name: 'Product 28', price: '122.85' },
    { id: '29', name: 'Product 29', price: '140.65' },
    { id: '30', name: 'Product 30', price: '159.00' },
    { id: '31', name: 'Product 31', price: '74.89' },
    { id: '32', name: 'Product 32', price: '189.34' },
    { id: '33', name: 'Product 33', price: '98.77' },
    { id: '34', name: 'Product 34', price: '105.55' },
    { id: '35', name: 'Product 35', price: '174.12' },
    { id: '36', name: 'Product 36', price: '69.88' },
    { id: '37', name: 'Product 37', price: '152.99' },
    { id: '38', name: 'Product 38', price: '113.67' },
    { id: '39', name: 'Product 39', price: '164.73' },
    { id: '40', name: 'Product 40', price: '76.44' },
    { id: '41', name: 'Product 41', price: '180.45' },
    { id: '42', name: 'Product 42', price: '92.88' },
    { id: '43', name: 'Product 43', price: '135.67' },
    { id: '44', name: 'Product 44', price: '148.20' },
    { id: '45', name: 'Product 45', price: '59.78' },
    { id: '46', name: 'Product 46', price: '168.99' },
    { id: '47', name: 'Product 47', price: '110.12' },
    { id: '48', name: 'Product 48', price: '132.76' },
    { id: '49', name: 'Product 49', price: '142.56' },
    { id: '50', name: 'Product 50', price: '88.90' },
    { id: '51', name: 'Product 51', price: '195.78' },
    { id: '52', name: 'Product 52', price: '139.55' },
    { id: '53', name: 'Product 53', price: '170.67' },
    { id: '54', name: 'Product 54', price: '97.44' },
    { id: '55', name: 'Product 55', price: '158.77' },
    { id: '56', name: 'Product 56', price: '145.32' },
    { id: '57', name: 'Product 57', price: '112.89' },
    { id: '58', name: 'Product 58', price: '190.21' },
    { id: '59', name: 'Product 59', price: '63.90' },
    { id: '60', name: 'Product 60', price: '156.48' },
    { id: '61', name: 'Product 61', price: '101.67' },
    { id: '62', name: 'Product 62', price: '183.99' },
    { id: '63', name: 'Product 63', price: '140.23' },
    { id: '64', name: 'Product 64', price: '89.45' },
    { id: '65', name: 'Product 65', price: '174.33' },
    { id: '66', name: 'Product 66', price: '115.67' },
    { id: '67', name: 'Product 67', price: '99.45' },
    { id: '68', name: 'Product 68', price: '178.55' },
    { id: '69', name: 'Product 69', price: '143.88' },
    { id: '70', name: 'Product 70', price: '160.22' },
    { id: '71', name: 'Product 71', price: '71.34' },
    { id: '72', name: 'Product 72', price: '186.99' },
    { id: '73', name: 'Product 73', price: '85.45' },
    { id: '74', name: 'Product 74', price: '104.99' },
    { id: '75', name: 'Product 75', price: '175.10' },
    { id: '76', name: 'Product 76', price: '78.67' },
    { id: '77', name: 'Product 77', price: '150.90' },
    { id: '78', name: 'Product 78', price: '117.65' },
    { id: '79', name: 'Product 79', price: '162.44' },
    { id: '80', name: 'Product 80', price: '69.55' },
  ];
  paginationOrders: any = [];

  public paginate: any = {}; // Pagination use only
  public pageSize = 10;
  public pageNo: number = 1;

  constructor(
    public productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private viewScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.paginate = this.productService.getPager(
      this.orders.length,
      Number(+this.pageNo),
      this.pageSize
    );
    this.paginationOrders = this.orders.slice(
      this.paginate.startIndex,
      this.paginate.endIndex + 1
    );

    this.route.queryParams.subscribe((params) => {
      this.pageNo = params['page'] ? params['page'] : this.pageNo;
      this.paginate = this.productService.getPager(
        this.orders.length,
        Number(+this.pageNo),
        this.pageSize
      );
      this.paginationOrders = this.orders.slice(
        this.paginate.startIndex,
        this.paginate.endIndex + 1
      );
    });
  }

  setPage(page: number) {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { page: page },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
      })
      .finally(() => {
        this.viewScroller.setOffset([120, 120]);
      });
  }
}

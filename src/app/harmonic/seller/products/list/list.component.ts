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

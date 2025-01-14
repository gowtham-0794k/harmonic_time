import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  public orders = [
    { id: '1', name: 'Product 1', customer: 'Ella Lee' },
    { id: '2', name: 'Product 2', customer: 'Amelia Taylor' },
    { id: '3', name: 'Product 3', customer: 'Amelia Taylor' },
    { id: '4', name: 'Product 4', customer: 'Sophia Garcia' },
    { id: '5', name: 'Product 5', customer: 'Emma Johnson' },
    { id: '6', name: 'Product 6', customer: 'Lucas Moore' },
    { id: '7', name: 'Product 7', customer: 'Charlotte Anderson' },
    { id: '8', name: 'Product 8', customer: 'Isabella Martinez' },
    { id: '9', name: 'Product 9', customer: 'Liam Brown' },
    { id: '10', name: 'Product 10', customer: 'Mason Rodriguez' },
    { id: '11', name: 'Product 11', customer: 'Benjamin Thomas' },
    { id: '12', name: 'Product 12', customer: 'Sophia Garcia' },
    { id: '13', name: 'Product 13', customer: 'Ava Hernandez' },
    { id: '14', name: 'Product 14', customer: 'Liam Brown' },
    { id: '15', name: 'Product 15', customer: 'Olivia Williams' },
    { id: '16', name: 'Product 16', customer: 'Ava Hernandez' },
    { id: '17', name: 'Product 17', customer: 'Ava Hernandez' },
    { id: '18', name: 'Product 18', customer: 'Olivia Williams' },
    { id: '19', name: 'Product 19', customer: 'Sophia Garcia' },
    { id: '20', name: 'Product 20', customer: 'Liam Brown' },
    { id: '21', name: 'Product 21', customer: 'Charlotte Anderson' },
    { id: '22', name: 'Product 22', customer: 'Ava Hernandez' },
    { id: '23', name: 'Product 23', customer: 'Emma Johnson' },
    { id: '24', name: 'Product 24', customer: 'John Smith' },
    { id: '25', name: 'Product 25', customer: 'Emma Johnson' },
    { id: '26', name: 'Product 26', customer: 'Noah Jones' },
    { id: '27', name: 'Product 27', customer: 'John Smith' },
    { id: '28', name: 'Product 28', customer: 'Emma Johnson' },
    { id: '29', name: 'Product 29', customer: 'Amelia Taylor' },
    { id: '30', name: 'Product 30', customer: 'Mason Rodriguez' },
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

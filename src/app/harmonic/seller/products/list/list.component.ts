import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT } from '@config/index';
import { GenericService } from '@shared/services/generic.service';
import { UserService } from '@shared/services/user.service';
import { UtilsService } from '@shared/services/utils.service';
import { filter, Subscription, switchMap } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  public orders = [];
  paginationOrders: any = [];

  public paginate: any = {}; // Pagination use only
  public pageSize = 10;
  public pageNo: number = 1;
  userData: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private viewScroller: ViewportScroller,
    private genericService: GenericService,
    private userService: UserService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    // Subscribe to userData and fetch orders only when userData exists
    this.subscriptions.add(
      this.userService.userData$
        .pipe(
          filter((user) => !!user), // Ensure userData is not null
          switchMap((user) => {
            this.userData = user;
            const url = `${PRODUCT}?UserID=${this.userData._id}`;
            return this.genericService.getObservable(url);
          })
        )
        .subscribe({
          next: (response) => {
            this.orders = response?.data || [];
            this.updatePagination();
          },
          error: (err) => console.error(`Error fetching product data:`, err),
        })
    );

    // Subscribe to query params to update pagination
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.pageNo = params['page'] ? Number(params['page']) : this.pageNo;
        this.updatePagination();
      })
    );
  }

  updatePagination(): void {
    if (!this.orders.length) return;
    this.paginate = this.productService.getPager(
      this.orders.length,
      this.pageNo,
      this.pageSize
    );
    this.paginationOrders = this.orders.slice(
      this.paginate.startIndex,
      this.paginate.endIndex + 1
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Unsubscribe to avoid memory leaks
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

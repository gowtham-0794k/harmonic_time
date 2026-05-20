import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PRODUCT } from '@config/index';
import { GenericService } from '@shared/services/generic.service';
import { UtilsService } from '@shared/services/utils.service';
import { filter, Subscription, switchMap } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { selectUserData } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  public orders: any[] = [];
  public paginationOrders: any[] = [];
  public paginate: any = {}; // Pagination data
  public pageSize = 10;
  public pageNo: number = 1;
  private subscriptions: Subscription = new Subscription();
  private userData: any;

  constructor(
    private store: Store,
    public productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private viewScroller: ViewportScroller,
    private genericService: GenericService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    // Subscribe to user data from store and fetch products
    this.subscriptions.add(
      this.store
        .select(selectUserData)
        .pipe(
          filter((state) => !!state?.user?.data), // Ensure userData exists
          switchMap((state) => {
            this.userData = state.user.data;
            const url = `${PRODUCT}?UserID=${this.userData._id}&IsAvailable=true`;
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

    // Subscribe to query params for pagination
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

  setPage(page: number): void {
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }
}

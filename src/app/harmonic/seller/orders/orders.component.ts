import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CHECKOUT_ITEMS, PRODUCT } from '@config/index';
import { Store } from '@ngrx/store';
import { GenericService } from '@shared/services/generic.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { selectUserData } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  public orders = [];
  paginationOrders: any = [];

  public paginate: any = {}; // Pagination use only
  public pageSize = 10;
  public pageNo: number = 1;
  public userData: any = {};

  constructor(
    public productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private viewScroller: ViewportScroller,
    private store: Store,
    private genericService: GenericService
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserData).subscribe((state) => {
      this.userData = state?.user?.data;

      if (this.userData) {
        const checkoutUrl = CHECKOUT_ITEMS;
        this.genericService
          .getObservable(checkoutUrl)
          .subscribe((checkoutResponse) => {
            const checkoutItems = checkoutResponse?.data || [];

            const url = `${PRODUCT}?UserID=${this.userData._id}&IsAvailable=true`;
            this.genericService
              .getObservable(url)
              .subscribe((productResponse) => {
                let allProducts: any = productResponse?.data || [];

                // Filtering products that are not in checkoutItems
                this.orders = allProducts.filter((product: any) => {
                  const checkoutProductIds = new Set(
                    checkoutItems.flatMap((item: any) => item.ProductIDs)
                  );
                  return checkoutProductIds.has(product._id);
                });

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
          });
      }
    });

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

  addTracking(order: any) {
    console.log({ order });
  }
}

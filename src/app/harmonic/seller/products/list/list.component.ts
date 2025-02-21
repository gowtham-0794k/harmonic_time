import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT } from '@config/index';
import { GenericService } from '@shared/services/generic.service';
import { UserService } from '@shared/services/user.service';
import { UtilsService } from '@shared/services/utils.service';
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
    console.log(this.utilsService.openMobileMenus);
    this.userService.getUserData();
    this.userService.userData$.subscribe({
      next: (data) => {
        this.userData = data;
        if (this.userData) {
          const url = PRODUCT + `?UserID=${this.userData._id}`;
          this.genericService.getObservable(url).subscribe({
            next: (response) => {
              this.orders = response?.data;
              this.paginate = this.productService.getPager(
                this.orders.length,
                Number(+this.pageNo),
                this.pageSize
              );
              this.paginationOrders = this.orders.slice(
                this.paginate.startIndex,
                this.paginate.endIndex + 1
              );
            },
            error: (err) => {
              console.error(`Error fetching data for :`, err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      },
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
}

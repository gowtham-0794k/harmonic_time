import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GET_DIAL_COLOR } from '@config/index';
import { GenericService } from '@shared/services/generic.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-color-filtering',
  templateUrl: './color-filtering.component.html',
  styleUrls: ['./color-filtering.component.scss'],
})
export class ColorFilteringComponent {
  public all_colors: any = [];
  public color: string = '';

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    private genericService: GenericService
  ) {}

  ngOnInit(): void {
    this.genericService.getObservable(GET_DIAL_COLOR).subscribe({
      next: (response) => {
        const productColors = response.data?.map(
          (el: any) => el?.DialColorName
        );
        this.all_colors = [...new Set(productColors)];
      },
      error: (err) => {
        this.all_colors = [];
      },
    });
    this.route.queryParams.subscribe((params) => {
      this.color = params['color'] ? params['color'] : null;
    });
  }

  getColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      Red: 'red',
      Blue: 'blue',
      Green: 'green',
      Purple: 'purple',
      Black: 'black',
      White: 'white',
      Silver: 'silver',
      Gold: 'gold',
      Brown: 'brown',
      Pink: 'pink',
      Orange: 'orange',
      Grey: 'grey',
      Beige: 'beige',
      Yellow: 'yellow',
      Multicolor: 'multicolor',
    };
    return `color ${colorMap[color] || 'default'}`;
  }

  handleColor(color: string) {
    // Define the query parameters as an object
    const queryParams: Params = {
      color: color.toLowerCase(),
    };

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams, // Pass the queryParams object here
        queryParamsHandling: 'merge',
        skipLocationChange: false,
      })
      .finally(() => {
        this.viewScroller.setOffset([120, 120]);
        this.viewScroller.scrollToAnchor('products'); // Anchore Link
      });
  }
}

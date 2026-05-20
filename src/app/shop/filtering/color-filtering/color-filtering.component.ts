import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GET_DIAL_COLORS } from '@config/index';
import {
  DIAL_COLOR_OPTIONS,
  getDialColorSwatch,
  normalizeDialColor,
} from '@shared/constants/dial-colors';
import { GenericService } from '@shared/services/generic.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { DialColor } from 'src/app/shared/types/product-d-t';

@Component({
  selector: 'app-color-filtering',
  templateUrl: './color-filtering.component.html',
  styleUrls: ['./color-filtering.component.scss'],
})
export class ColorFilteringComponent {
  public all_colors: string[] = [];
  public color: string | null = null;

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private viewScroller: ViewportScroller,
    private genericService: GenericService
  ) {}

  ngOnInit(): void {
    this.genericService.getObservable(GET_DIAL_COLORS).subscribe({
      next: (response) => {
        const productColors = (response.data ?? [])
          .map((el: DialColor) => el?.DialColorName)
          .filter((dialColorName: string | undefined): dialColorName is string =>
            Boolean(dialColorName),
          );
        this.all_colors = this.mergeAndSortColors(productColors);
      },
      error: () => {
        this.all_colors = this.mergeAndSortColors();
      },
    });
    this.route.queryParams.subscribe((params) => {
      this.color = params['color'] ? normalizeDialColor(params['color']) : null;
    });
  }

  getColorStyles(color: string): Record<string, string> {
    const swatch = getDialColorSwatch(color);

    return {
      '--swatch-accent': swatch.accent,
      '--swatch-background': swatch.background,
      '--swatch-border': swatch.border ?? '1px solid transparent',
      '--swatch-shadow': swatch.boxShadow ?? 'none',
    };
  }

  trackByColor(_: number, color: string): string {
    return color;
  }

  normalizeColor(color: string): string {
    return normalizeDialColor(color);
  }

  handleColor(color: string) {
    // Define the query parameters as an object
    const queryParams: Params = {
      color: normalizeDialColor(color),
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

  private mergeAndSortColors(productColors: string[] = []): string[] {
    const uniqueColors = new Map<string, string>();

    [...DIAL_COLOR_OPTIONS, ...productColors].forEach((dialColor) => {
      const normalizedColor = normalizeDialColor(dialColor);
      if (!uniqueColors.has(normalizedColor)) {
        uniqueColors.set(normalizedColor, dialColor);
      }
    });

    return [...uniqueColors.values()].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );
  }
}

import { Component, HostListener } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-header-four',
  templateUrl: './header-four.component.html',
  styleUrls: ['./header-four.component.scss'],
})
export class HeaderFourComponent {
  public sticky: boolean = false;
  public token: string = '';

  constructor(
    public cartService: CartService,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.cartService.loadCartProducts();
    this.token = localStorage.getItem('token') || '';
  }

  // sticky nav
  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 80) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
}

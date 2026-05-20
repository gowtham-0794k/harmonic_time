import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../types/product-d-t';
import { UserService } from './user.service';
import { ADD_TO_CART, DELETE_CART_ITEM, USER_CART } from '@config/index';
import { GenericService } from './generic.service';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCartItems } from 'src/app/store/selectors/cart.selectors';
import { loadCart } from 'src/app/store/actions/cart.actions';
import { Router } from '@angular/router';
import { selectUserData } from 'src/app/store/selectors/user.selectors';

const state = {
  cart_products: JSON.parse(localStorage['cart_products'] || '[]'),
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public orderQuantity: number = 1;
  public isCartOpen: boolean = false;
  cart$: Observable<any[]> = this.store.select(selectCartItems);

  constructor(
    private toastrService: ToastrService,
    private userService: UserService,
    private genericService: GenericService,
    private store: Store,
    private router: Router
  ) {}

  handleOpenCartSidebar() {
    this.isCartOpen = !this.isCartOpen;
  }

  // add_cart_product
  addCartProduct(payload: any) {
    this.store
      .select(selectUserData)
      .pipe(
        take(1),
        switchMap((state) => {
          const data = state?.user?.data; // Extract user data from store

          if (data) {
            const url = USER_CART + `${data._id}/${payload._id}`;
            return this.genericService.getObservable(url).pipe(
              tap(() =>
                this.toastrService.warning(
                  `${payload.ProductName} exists in the cart`
                )
              ),
              catchError(() => {
                // If item is not found in the cart, add it
                const cartPayload = {
                  UserID: data._id,
                  ProductID: payload._id,
                };
                return this.genericService
                  .postObservable(ADD_TO_CART, cartPayload)
                  .pipe(
                    tap(() => {
                      this.toastrService.success(
                        `${payload.ProductName} added to cart`
                      );
                      this.store.dispatch(loadCart()); // Dispatch action to reload cart
                    })
                  );
              })
            );
          } else {
            this.router.navigate(['/auth/login']);
            this.toastrService.warning(`Please Login to Add item to Cart !`);
            return EMPTY;
          }
        })
      )
      .subscribe({
        error: (err) => this.toastrService.error(`Error: ${err.message}`),
      });
  }

  // total price quantity
  public totalPriceQuantity() {
    return state.cart_products.reduce(
      (cartTotal: { total: number; quantity: number }, cartItem: any) => {
        const { Price, orderQuantity, discount } = cartItem;
        if (typeof orderQuantity !== 'undefined') {
          if (discount && discount > 0) {
            // Calculate the item total with discount
            const itemTotal =
              (Price - (Price * discount) / 100) * orderQuantity;
            cartTotal.total += itemTotal;
          } else {
            // Calculate the item total without discount
            const itemTotal = Price * orderQuantity;
            cartTotal.total += itemTotal;
          }
          cartTotal.quantity += orderQuantity;
        }
        return cartTotal;
      },
      {
        total: 0,
        quantity: 0,
      }
    );
  }

  computeCartTotal(cartItems: any) {
    return cartItems.reduce(
      (cartTotal: { total: number; quantity: number }, cartItem: any) => {
        const { Price } = cartItem;
        if (Price) {
          cartTotal.total += Price;
        }
        return cartTotal;
      },
      { total: 0, quantity: 0 }
    );
  }

  // quantity increment
  increment() {
    return (this.orderQuantity = this.orderQuantity + 1);
  }

  // quantity decrement
  decrement() {
    return (this.orderQuantity =
      this.orderQuantity > 1
        ? this.orderQuantity - 1
        : (this.orderQuantity = 1));
  }

  // quantityDecrement
  quantityDecrement(payload: IProduct) {
    state.cart_products.map((item: IProduct) => {
      if (item.id === payload.id) {
        if (typeof item.orderQuantity !== 'undefined') {
          if (item.orderQuantity > 1) {
            item.orderQuantity = item.orderQuantity - 1;
            this.toastrService.info(`Decrement Quantity For ${item.title}`);
          }
        }
      }
      return { ...item };
    });
    localStorage.setItem('cart_products', JSON.stringify(state.cart_products));
  }

  // remover_cart_products
  removeCartProduct(payload: any) {
    if (payload._id) {
      const url = DELETE_CART_ITEM + `${payload._id}`;
      this.genericService.deleteObservable(url).subscribe({
        next: (response) => {
          this.toastrService.success(
            `${payload.ProductName} removed from cart`
          );
          this.store.dispatch(loadCart());
        },
        error: (err) => {
          this.toastrService.error(
            `${payload.ProductName} error removing from cart`
          );
        },
      });
    }
  }

  // clear cart
  clear_cart() {
    const confirmMsg = window.confirm(
      'Are you sure deleted your all cart items ?'
    );
    if (confirmMsg) {
      state.cart_products = [];
    }
    localStorage.setItem('cart_products', JSON.stringify(state.cart_products));
  }
  // initialOrderQuantity
  initialOrderQuantity() {
    return (this.orderQuantity = 1);
  }
}

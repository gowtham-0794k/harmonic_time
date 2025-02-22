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

const state = {
  cart_products: JSON.parse(localStorage['cart_products'] || '[]'),
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public orderQuantity: number = 1;
  public isCartOpen: boolean = false;
  private cartProducts$ = new BehaviorSubject<any[]>([]);
  cart$: Observable<any[]> = this.store.select(selectCartItems);

  constructor(
    private toastrService: ToastrService,
    private userService: UserService,
    private genericService: GenericService,
    private store: Store
  ) {}

  handleOpenCartSidebar() {
    this.isCartOpen = !this.isCartOpen;
  }

  // add_cart_product
  addCartProduct(payload: any) {
    this.userService.userData$
      .pipe(
        take(1),
        switchMap((data) => {
          if (data) {
            const url = USER_CART + `${data._id}/${payload._id}`;
            return this.genericService.getObservable(url).pipe(
              tap(() =>
                this.toastrService.warning(
                  `${payload.ProductName} exists in the cart`
                )
              ),
              catchError(() => {
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
                      this.store.dispatch(loadCart());
                    })
                  );
              })
            );
          } else {
            const isExist = state.cart_products.some(
              (i: any) => i._id === payload._id
            );
            if (!isExist) {
              state.cart_products.push({ ...payload, orderQuantity: 1 });
              localStorage.setItem(
                'cart_products',
                JSON.stringify(state.cart_products)
              );
              this.toastrService.success(
                `${payload.ProductName} added to cart`
              );
            }
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
  removeCartProduct(payload: any, userData: any) {
    if (userData) {
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
    } else {
      state.cart_products = state.cart_products.filter(
        (p: any) => p._id !== payload._id
      );
      this.toastrService.success(`${payload.ProductName} removed from cart`);
      localStorage.setItem(
        'cart_products',
        JSON.stringify(state.cart_products)
      );
    }
    if (state.cart_products.length) {
      state.cart_products = state.cart_products.filter(
        (p: any) => p._id !== payload._id
      );
      this.toastrService.success(`${payload.ProductName} removed from cart`);
      localStorage.setItem(
        'cart_products',
        JSON.stringify(state.cart_products)
      );
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

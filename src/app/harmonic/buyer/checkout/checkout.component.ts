import { Component } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { countries } from '@shared/constants/countries';
import { GenericService } from '@shared/services/generic.service';
import {
  CHECKOUT_ITEM,
  CHECKOUT_ITEM_ORDER,
  CREATE_ADDRESS,
  CREATE_PAYMENT_ORDER,
  VERIFY_PAYMENT_ORDER,
} from '@config/index';
import { UserService } from '@shared/services/user.service';
import {
  catchError,
  firstValueFrom,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { selectUserData } from 'src/app/store/selectors/user.selectors';
import { Store } from '@ngrx/store';
import { selectCartItems } from 'src/app/store/selectors/cart.selectors';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  public isOpenLogin = false;
  public isOpenCoupon = false;
  public couponCode: string = '';
  public payment_name: string = '';
  public countries = countries;
  public userData: any = {};
  public cartItems: any = [];

  constructor(
    public cartService: CartService,
    private toastrService: ToastrService,
    public genericService: GenericService,
    private store: Store
  ) {}

  handleOpenLogin() {
    this.isOpenLogin = !this.isOpenLogin;
  }
  handleOpenCoupon() {
    this.isOpenCoupon = !this.isOpenCoupon;
  }

  handleCouponSubmit() {
    // Add coupon code handling logic here
    if (this.couponCode) {
      // logic here

      // when submitted the from than empty will be coupon code
      this.couponCode = '';
    }
  }

  // handle payment item
  handlePayment(value: string) {
    this.payment_name = value;
  }

  public checkoutForm!: FormGroup;
  public formSubmitted = false;

  ngOnInit() {
    this.store.select(selectUserData).subscribe((state) => {
      this.userData = state.user.data;
    });
    this.store.select(selectCartItems).subscribe((state) => {
      if (state?.length) {
        this.cartItems = state;
      } else {
        this.cartItems = [];
      }
    });
    this.checkoutForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      country: new FormControl('India', Validators.required),
      address: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      apartment: new FormControl(null),
      zipCode: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      orderNote: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

    this.loadRazorpayScript();
  }

  loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-script';
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);

      document.body.appendChild(script);
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.checkoutForm.valid) {
      this.payNow();
      // this.toastrService.success(`Order successfully`);

      // Reset the form
      // this.checkoutForm.reset();
      // this.formSubmitted = false; // Reset formSubmitted to false
    }
  }

  get firstName() {
    return this.checkoutForm.get('firstName');
  }
  get lastName() {
    return this.checkoutForm.get('lastName');
  }
  get company() {
    return this.checkoutForm.get('company');
  }
  get country() {
    return this.checkoutForm.get('country');
  }
  get address() {
    return this.checkoutForm.get('address');
  }
  get city() {
    return this.checkoutForm.get('city');
  }
  get state() {
    return this.checkoutForm.get('state');
  }
  get apartment() {
    return this.checkoutForm.get('apartment');
  }
  get zipCode() {
    return this.checkoutForm.get('zipCode');
  }
  get phone() {
    return this.checkoutForm.get('phone');
  }
  get orderNote() {
    return this.checkoutForm.get('orderNote');
  }
  get email() {
    return this.checkoutForm.get('email');
  }

  async payNow() {
    await this.loadRazorpayScript();

    const formValue = this.checkoutForm.value;
    const cartTotal =
      this.cartService.computeCartTotal(this.cartItems).total * 100;

    this.genericService
      .postObservable(CREATE_PAYMENT_ORDER, { amount: cartTotal })
      .pipe(
        switchMap((order: any) => this.initiateRazorpay(order.data, formValue)),
        catchError((error) => {
          console.error('Error creating payment order:', error);
          this.toastrService.error('Payment initialization failed!');
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  private initiateRazorpay(orderRes: any, formValue: any) {
    return new Observable((observer) => {
      const options = {
        key: 'rzp_test_z8oH9LFfnlEpw0',
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'Your Company',
        description: 'Test Transaction',
        image: 'https://your-logo-url.com',
        order_id: orderRes.id,
        handler: async (handlerResponse: any) => {
          try {
            const verifyResponse = await this.verifyPayment(handlerResponse);
            if (verifyResponse) {
              await this.processCheckout(orderRes, formValue);
            } else {
              this.toastrService.error('Payment Verification Failed!');
            }
          } catch (error) {
            console.error('Payment Verification Error:', error);
            this.toastrService.error('Payment Verification Failed!');
          }
        },
        prefill: {
          name: formValue.firstName,
          email: formValue.email,
          contact: formValue.phone,
        },
        theme: { color: '#3399cc' },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
      observer.next();
      observer.complete();
    });
  }

  private async verifyPayment(handlerResponse: any): Promise<any> {
    try {
      return await firstValueFrom(
        this.genericService.postObservable(
          VERIFY_PAYMENT_ORDER,
          handlerResponse
        )
      );
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  private async processCheckout(orderRes: any, formValue: any) {
    try {
      const addressPayload = {
        UserID: this.userData._id,
        Country: formValue.country,
        FirstName: formValue.firstName,
        LastName: formValue.lastName,
        AddressLine1: formValue.address,
        AddressLine2: '',
        City: formValue.city,
        State: formValue.state,
        PostalCode: formValue.zipCode,
        Phone: formValue.phone,
        orderNotes: formValue.orderNote,
      };

      const addressResponse = await firstValueFrom(
        this.genericService.postObservable(CREATE_ADDRESS, addressPayload)
      );

      const checkoutPayload = {
        UserID: this.userData._id,
        TotalAmount: orderRes.amount,
        PaymentStatus: 'success',
        CheckoutDate: new Date(),
        DeliveryStatus: 'pending',
        AddressID: addressResponse.data.insertedId,
      };

      const checkOutRes = await firstValueFrom(
        this.genericService.postObservable(CHECKOUT_ITEM, checkoutPayload)
      );

      const cartItems = this.cartItems.map((el: any) => el.ProductID);
      const checkoutItemOrder = {
        CheckoutID: checkOutRes.data.insertedId,
        ProductIDs: cartItems,
        Price: orderRes.amount,
      };

      await firstValueFrom(
        this.genericService.postObservable(
          CHECKOUT_ITEM_ORDER,
          checkoutItemOrder
        )
      );

      this.toastrService.success(
        'Payment and Checkout Completed Successfully!'
      );
    } catch (error) {
      console.error('Error in checkout process:', error);
      this.toastrService.error('Checkout Failed!');
    }
  }
}

import { Component } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { countries } from '@shared/constants/countries';
import { GenericService } from '@shared/services/generic.service';
import {
  CHECKOUT_ITEM,
  CHECKOUT_ITEM_ORDER,
  CREATE_ADDRESS,
  CREATE_PAYMENT_ORDER,
  LOGIN_USER,
  REGISTER_USER,
  UPDATE_PRODUCT,
  VERIFY_PAYMENT_ORDER,
} from '@config/index';
import { loginUser, registerUser } from 'src/app/store/actions/user.actions';
import { UserService } from '@shared/services/user.service';
import {
  catchError,
  filter,
  firstValueFrom,
  Observable,
  Subscription,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import {
  selectUserData,
  selectUserError,
} from 'src/app/store/selectors/user.selectors';
import { Store } from '@ngrx/store';
import { selectCartItems } from 'src/app/store/selectors/cart.selectors';
import { loadCart } from 'src/app/store/actions/cart.actions';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  public isOpenLogin = false;
  public isOpenRegister = false;
  public isOpenCoupon = false;
  public showChargesDetails = false;
  public couponCode: string = '';
  public payment_name: string = '';
  public countries = countries;
  public userData: any = {};
  public cartItems: any = [];

  // Returning customer login
  public loginForm!: FormGroup;
  public loginSubmitted = false;
  public showLoginPassword = false;

  // New customer register
  public registerForm!: FormGroup;
  public registerSubmitted = false;
  public showRegisterPassword = false;
  public showRegisterConfirmPassword = false;

  private authDataSub?: Subscription;
  private authErrorSub?: Subscription;

  constructor(
    public cartService: CartService,
    private toastrService: ToastrService,
    public genericService: GenericService,
    private store: Store,
    private router: Router,
  ) {}

  handleOpenLogin() {
    this.isOpenLogin = !this.isOpenLogin;
  }
  handleOpenRegister() {
    this.isOpenRegister = !this.isOpenRegister;
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
      this.userData = state?.user?.data;
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

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });

    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
          ),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordsMatchValidator },
    );

    this.loadRazorpayScript();
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Returning customer login form getters
  get loginEmail() {
    return this.loginForm.get('email');
  }
  get loginPassword() {
    return this.loginForm.get('password');
  }

  // New customer register form getters
  get registerEmail() {
    return this.registerForm.get('email');
  }
  get registerPassword() {
    return this.registerForm.get('password');
  }
  get registerConfirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  toggleLoginPassword() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPassword(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showRegisterPassword = !this.showRegisterPassword;
    } else {
      this.showRegisterConfirmPassword = !this.showRegisterConfirmPassword;
    }
  }

  // Login using the same endpoint/action as the login page,
  // but stay on checkout so the user can continue ordering.
  onLogin() {
    this.loginSubmitted = true;
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const payload = {
        email: formValue.email,
        password: formValue.password,
      };
      // Drop any subscriptions from a previous submit so toasts don't stack
      this.authDataSub?.unsubscribe();
      this.authErrorSub?.unsubscribe();

      this.store.dispatch(loginUser({ url: LOGIN_USER, payload }));

      this.authErrorSub = this.store
        .select(selectUserError)
        .pipe(
          filter((error: any) => !!error),
          take(1)
        )
        .subscribe(() => {
          this.toastrService.error('Please check email and password !');
        });

      this.authDataSub = this.store
        .select(selectUserData)
        .pipe(
          filter((state: any) => !!state?.data?.token),
          take(1)
        )
        .subscribe((state: any) => {
          localStorage.setItem('token', JSON.stringify(state?.data?.token));
          this.toastrService.success('Login successful !');
          this.loginForm.reset();
          this.loginSubmitted = false;
          this.isOpenLogin = false;
        });
    }
  }

  // Register using the same endpoint/action as the register page,
  // but stay on checkout so the user can continue ordering.
  onRegister() {
    this.registerSubmitted = true;
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const payload = {
        email: formValue.email,
        password: formValue.password,
      };
      // Drop any subscription from a previous submit so toasts don't stack
      this.authDataSub?.unsubscribe();
      this.store.dispatch(registerUser({ url: REGISTER_USER, payload }));
      this.authDataSub = this.store
        .select(selectUserData)
        .pipe(
          filter((state: any) => !!state?.data?.token),
          take(1)
        )
        .subscribe((state: any) => {
          localStorage.setItem('token', JSON.stringify(state?.data?.token));
          this.toastrService.success('Registration successful!');
          this.registerForm.reset();
          this.registerSubmitted = false;
          this.isOpenRegister = false;
        });
    } else if (this.registerForm.hasError('passwordsMismatch')) {
      this.toastrService.error('Passwords do not match.');
    }
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
      this.cartService.computeCheckoutSummary(this.cartItems).grandTotal * 100;

    this.genericService
      .postObservable(CREATE_PAYMENT_ORDER, { amount: cartTotal })
      .pipe(
        switchMap((order: any) => this.initiateRazorpay(order.data, formValue)),
        catchError((error) => {
          console.error('Error creating payment order:', error);
          this.toastrService.error('Payment initialization failed!');
          return throwError(() => error);
        }),
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
          handlerResponse,
        ),
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
        this.genericService.postObservable(CREATE_ADDRESS, addressPayload),
      );
      const cartItems = this.cartItems.map((el: any) => el.ProductID);

      const checkoutPayload = {
        UserID: this.userData._id,
        TotalAmount: orderRes.amount,
        PaymentStatus: 'success',
        CheckoutDate: new Date(),
        DeliveryStatus: 'pending',
        AddressID: addressResponse.data.insertedId,
        ProductIDs: cartItems,
      };

      const checkOutRes = await firstValueFrom(
        this.genericService.postObservable(CHECKOUT_ITEM, checkoutPayload),
      );

      const checkoutItemOrder = {
        CheckoutID: checkOutRes.data.insertedId,
        ProductIDs: cartItems,
        Price: orderRes.amount,
      };

      await firstValueFrom(
        this.genericService.postObservable(
          CHECKOUT_ITEM_ORDER,
          checkoutItemOrder,
        ),
      );

      const updateProducts = {
        ProductIDs: cartItems,
      };

      const updateProductsRes = await firstValueFrom(
        this.genericService.putObservable(UPDATE_PRODUCT, updateProducts),
      );

      if (updateProductsRes) {
        this.router.navigate(['/buyer/products']);
        await this.store.dispatch(loadCart());
        await this.toastrService.success(
          'Payment and Checkout Completed Successfully!',
        );
      }
    } catch (error) {
      console.error('Error in checkout process:', error);
      this.toastrService.error('Checkout Failed!');
    }
  }
}

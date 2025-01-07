import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { environment } from '@environment';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { REGISTER_USER } from 'src/app/config';
import { GenericService } from 'src/app/shared/services/generic.service';
import { loadData } from 'src/app/store/actions/user.actions';
import { AppState } from 'src/app/store/app.state';
import {
  selectData,
  selectLoading,
} from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  // Show/Hide Password States
  public showPassword = false;
  public showConfirmPassword = false;

  // Form Group
  public registerForm!: FormGroup;
  public formSubmitted = false;

  constructor(
    private toastrService: ToastrService,
    public genericService: GenericService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    console.log({ environment });
    this.store.dispatch(loadData());
    this.store.select(selectData).subscribe((data) => {
      const values = data;
      // Perform functionality with the data
      console.log('Fetched Data:', values);
    });
    // Initialize the form with validators
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ), // Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // Custom Validator: Check if passwords match
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Getters for form controls
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Toggle Password Visibility
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Submit Form
  onSubmit() {
    const url = REGISTER_USER;
    this.formSubmitted = true;

    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      console.log('Registration successful:', formValue);
      this.toastrService.success('Registration successful!');
      this.registerForm.reset();
      this.formSubmitted = false; // Reset the form submission state
      const payload = {
        email: formValue.email,
        password: formValue.password,
      };
      console.log({ payload });
      this.genericService.postObservable(url, payload).subscribe({
        next: (result) => {
          // Handle success
          console.log({ result });
        },
        error: (err) => {
          // Handle error
          console.error({ err });
        },
        complete: () => {
          // Handle completion
          console.log('Request completed.');
        },
      });
    } else if (this.registerForm.hasError('passwordsMismatch')) {
      this.toastrService.error('Passwords do not match.');
    }
  }
}

import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  // Variables to toggle password visibility
  isShowPass = false;
  isShowConfirmPass = false;

  // Form group for registration form
  public registerForm!: FormGroup;
  public formSubmitted = false;

  constructor(private toastrService: ToastrService) {}

  ngOnInit() {
    // Initialize the registration form with validation
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        this.passwordRegexValidator(),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        this.passwordMatchValidator,
      ]),
    });
  }

  // Regex validator for password strength
  passwordRegexValidator(): ValidatorFn {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const isValid = regex.test(value);
      return isValid
        ? null
        : {
            passwordStrength: true,
          };
    };
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator: ValidatorFn = (
    form: AbstractControl
  ): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    console.log(this.registerForm.value);
    console.log(password && confirmPassword && password !== confirmPassword);
    return password && confirmPassword && password !== confirmPassword
      ? { mustMatch: true } // Trigger 'mustMatch' error if passwords don't match
      : null;
  };

  // Toggle password visibility
  handleShowPass() {
    this.isShowPass = !this.isShowPass;
  }

  // Toggle confirm password visibility
  handleShowConfirmPass() {
    this.isShowConfirmPass = !this.isShowConfirmPass;
  }

  // Getter for form controls
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Handle form submission
  onSubmit() {
    this.formSubmitted = true;

    // Mark all controls as touched so validation messages will show up
    this.markAllAsTouched();

    if (this.registerForm.valid) {
      console.log('register-form-value', this.registerForm.value);
      this.toastrService.success(`Registration successful`);

      // Reset the form after submission
      this.registerForm.reset();
      this.formSubmitted = false; // Reset formSubmitted to false
    }
  }

  // Mark all form controls as touched
  markAllAsTouched() {
    Object.values(this.registerForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}

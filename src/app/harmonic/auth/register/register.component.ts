import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { REGISTER_USER } from 'src/app/config';
import { GenericService } from 'src/app/shared/services/generic.service';
import { registerUser } from 'src/app/store/actions/user.actions';
import { AppState } from 'src/app/store/app.state';
import { selectData } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public showPassword = false;
  public showConfirmPassword = false;
  public registerForm!: FormGroup;
  public formSubmitted = false;

  constructor(
    private toastrService: ToastrService,
    public genericService: GenericService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    const url = REGISTER_USER;
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const payload = {
        email: formValue.email,
        password: formValue.password,
      };
      console.log({ payload });
      this.store.dispatch(registerUser({ url, payload }));
      this.store.select(selectData).subscribe((state) => {
        console.log({ state });
        // this.toastrService.success('Registration successful!');
        // this.registerForm.reset();
        // this.formSubmitted = false; // Reset the form submission state
      });
    } else if (this.registerForm.hasError('passwordsMismatch')) {
      this.toastrService.error('Passwords do not match.');
    }
  }
}

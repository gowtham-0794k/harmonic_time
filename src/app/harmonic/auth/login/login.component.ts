import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericService } from 'src/app/shared/services/generic.service';
import { LOGIN_USER } from 'src/app/config';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { loginUser } from 'src/app/store/actions/user.actions';
import { selectUserData } from 'src/app/store/selectors/user.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isShowPass = false;

  handleShowPass() {
    this.isShowPass = !this.isShowPass;
  }

  public loginForm!: FormGroup;
  public formSubmitted = false;

  constructor(
    private toastrService: ToastrService,
    public genericService: GenericService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    const url = LOGIN_USER;
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const payload = {
        email: formValue.email,
        password: formValue.password,
      };
      this.store.dispatch(loginUser({ url, payload }));
      this.store.select(selectUserData).subscribe((state: any) => {
        console.log({ state });
        localStorage.setItem('token', JSON.stringify(state?.data?.token));
        this.toastrService.success('Registration successful!');
        this.loginForm.reset();
        this.formSubmitted = false; // Reset the form submission state
        this.router.navigate(['/buyer/products']);
      });
    }
  }
}

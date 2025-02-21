// user.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginUserSuccess } from 'src/app/store/actions/user.actions';
import { GenericService } from './generic.service';
import { USER } from '@config/index';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDataSubject = new BehaviorSubject<any>(null); // Initial value is null
  userData$ = this.userDataSubject.asObservable(); // Observable for subscription
  constructor(
    private store: Store,
    private genericService: GenericService,
    private router: Router
  ) {}

  loadUserFromLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      this.store.dispatch(loginUserSuccess({ data: { data: { token } } }));
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('token');
    this.userDataSubject.next(null);
    this.store.dispatch(loginUserSuccess({ data: null }));
  }

  getUserData() {
    const url = USER;
    this.genericService.getObservableToken(url).subscribe({
      next: (response) => {
        this.userDataSubject.next(response.data);
      },
      error: (err) => {
        console.error(`Error fetching data : `, err);
      },
    });
  }
}

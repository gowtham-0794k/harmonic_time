import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartService } from '@shared/services/cart.service';
import { UserService } from '@shared/services/user.service';
import { loadUser } from './store/actions/user.actions';
import { loadCart } from './store/actions/cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Harmonic Time';

  constructor(
    private userService: UserService,
    private store: Store,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.userService.loadUserFromLocalStorage();
    this.store.dispatch(loadUser());
    // this.store.dispatch(loadCart());
  }
}

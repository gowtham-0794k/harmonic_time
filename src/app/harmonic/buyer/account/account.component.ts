import { Component } from '@angular/core';
import { companyDetails } from '@shared/constants/companyDetails';
import { CartService } from '@shared/services/cart.service';
import { GenericService } from '@shared/services/generic.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  public userData: any = {};
  public mail = `mailt:${companyDetails.email}`;

  constructor(
    private userService: UserService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.userService.getUserData();
    this.userService.userData$.subscribe({
      next: (data) => {
        console.log({ data });
        this.userData = data;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      },
    });
  }
}

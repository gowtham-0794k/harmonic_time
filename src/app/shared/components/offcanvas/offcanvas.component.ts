import { Component } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { IMobileMenu } from '../../types/menu-d-t';
import { mobile_menus } from '../../data/menu-data';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.scss'],
})
export class OffcanvasComponent {
  public roles: number[] = [];

  constructor(
    public utilsService: UtilsService,
    private userService: UserService
  ) {}

  mobile_menus: IMobileMenu[] = mobile_menus;

  activeMenu: string = '';

  ngOnInit(): void {
    this.userService.getUserData();
    this.userService.userData$.subscribe({
      next: (data) => {
        this.roles = data?.roles;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      },
    });
  }

  handleOpenMenu(navTitle: string) {
    if (navTitle === this.activeMenu) {
      this.activeMenu = '';
    } else {
      this.activeMenu = navTitle;
    }
  }

  checkRole(value: boolean | undefined) {
    if (value) return this.roles?.includes(2);
    return true;
  }
}

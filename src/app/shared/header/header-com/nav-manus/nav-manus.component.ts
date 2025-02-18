import { Component } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import menuData from 'src/app/shared/data/menu-data';
import { IMenuType } from 'src/app/shared/types/menu-d-t';

@Component({
  selector: 'app-nav-manus',
  templateUrl: './nav-manus.component.html',
  styleUrls: ['./nav-manus.component.scss'],
})
export class NavManusComponent {
  public menu_data: IMenuType[] = menuData;
  public roles: number[] = [];

  bg: string = '/assets/img/bg/mega-menu-bg.jpg';

  constructor(private userService: UserService) {}

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

  getMenuClasses(item: IMenuType): string {
    const classes = [];
    if (item.hasDropdown && !item.megamenu) {
      classes.push('active', 'has-dropdown');
    } else if (item.megamenu) {
      classes.push('mega-menu', 'has-dropdown');
    }
    return classes.join(' ');
  }

  checkRole(value: boolean | undefined) {
    if (value) return this.roles.includes(2);
    return true;
  }
}

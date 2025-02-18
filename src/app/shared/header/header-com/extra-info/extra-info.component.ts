import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-extra-info',
  templateUrl: './extra-info.component.html',
  styleUrls: ['./extra-info.component.scss'],
})
export class ExtraInfoComponent {
  constructor(private userService: UserService) {}

  navigate() {
    this.userService.logout();
  }
}

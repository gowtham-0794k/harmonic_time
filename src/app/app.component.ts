import { Component } from '@angular/core';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Outstock - Clean, Minimal eCommerce Angular Template';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.userService.loadUserFromLocalStorage();
  }
}

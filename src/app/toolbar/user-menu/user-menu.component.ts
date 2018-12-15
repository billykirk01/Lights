import { Component, Input, Output, EventEmitter } from '@angular/core';
import { user } from 'src/models/user';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserManagerComponent } from 'src/app/user-manager/user-manager.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {


  @Input() user: user;


  @Output('LogIn')
  _logInButtonClicked = new EventEmitter();

  constructor(private bottomSheet: MatBottomSheet) { }

  logIn() {
    this._logInButtonClicked.emit()
  }

  manageUser() {
    this.bottomSheet.open(UserManagerComponent, {
      data: {
        user: this.user
      },
      autoFocus: false,
      restoreFocus: false
    });
  }

}

import { Component, Inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TokenEditorComponent } from './token-editor/token-editor.component';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent {

  constructor(private auth: AuthService, private bottomSheet: MatBottomSheet, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  logOut() {
    this.bottomSheet.dismiss()
    setTimeout(() => {
      this.auth.signOut();
    }, 500);
  }

  editToken() {
    this.bottomSheet.open(TokenEditorComponent, {
      data: {
        user: this.data.user
      },
      autoFocus: false,
      restoreFocus: false
    });
  }
}

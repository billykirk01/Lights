import { Component, Inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-token-editor',
  templateUrl: './token-editor.component.html',
  styleUrls: ['./token-editor.component.css']
})
export class TokenEditorComponent {

  constructor(private auth: AuthService, private bottomSheet: MatBottomSheet, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  saveToken(token: string) {
    this.auth.saveToken(this.data.user, token);
    this.bottomSheet.dismiss()
  }

}

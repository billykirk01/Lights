import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { HttpClientModule } from '@angular/common/http'

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [AuthService]
})
export class CoreModule { }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore'

import { AppComponent } from './app.component';
import { PowerComponent } from './cards/power/power.component';
import { ScenesComponent } from './cards/scenes/scenes.component';
import { AdjustComponent } from './cards/adjust/adjust.component';
import { DeveloperComponent } from './cards/developer/developer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UserMenuComponent } from './toolbar/user-menu/user-menu.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { TokenEditorComponent } from './user-manager/token-editor/token-editor.component';
import { LocationMenuComponent } from './toolbar/location-menu/location-menu.component';
import { LocationManagerComponent } from './location-manager/location-manager.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CircleButtonComponent } from './circle-button/circle-button.component';

@NgModule({
   declarations: [
      AppComponent,
      PowerComponent,
      ScenesComponent,
      AdjustComponent,
      DeveloperComponent,
      ToolbarComponent,
      UserMenuComponent,
      UserManagerComponent,
      LocationMenuComponent,
      LocationManagerComponent,
      TokenEditorComponent,
      CircleButtonComponent
   ],
   imports: [
      CoreModule,
      BrowserModule,
      BrowserAnimationsModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule.enablePersistence(),
      MatToolbarModule,
      MatButtonModule,
      MatBottomSheetModule,
      MatIconModule,
      MatListModule,
      MatProgressSpinnerModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ],
   entryComponents: [
      UserManagerComponent,
      LocationManagerComponent,
      TokenEditorComponent
   ]
})
export class AppModule { }

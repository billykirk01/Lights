import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { user } from 'src/models/user';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<user>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {

    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<user>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )

    this.user.subscribe(user => {

      if (!user) {
        return
      }
      // store just enough to load the toolbar
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        currentLocationName: user.currentLocationName,
        photoURL: user.photoURL,
      }));
    })

  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateOrCreateUserData(credential.user)
      })
  }

  signOut() {
    this.afAuth.auth.signOut()
      .then(() => localStorage.clear());
  }

  private updateOrCreateUserData(user: user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: user = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(data, { merge: true })

  }

  saveToken(user: user, token: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: user = {
      lifxToken: token
    }

    return userRef.set(data, { merge: true })
  }
}

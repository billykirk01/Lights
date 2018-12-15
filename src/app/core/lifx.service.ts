import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { user } from 'src/models/user';
import { location } from 'src/models/location';
import { group } from 'src/models/group';
import { light } from 'src/models/light';
import { scene } from 'src/models/scene';
import { states } from 'src/models/states';

@Injectable({
  providedIn: 'root'
})
export class LifxService {

  colors = {
    "red": 0,
    "orange": 36,
    "green": 120,
    "blue": 250,
    "purple": 280,
    "pink": 325
  }

  requestsRemaining: number;

  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  getLocations(user: user) {
    return this.afs.doc(`users/${user.uid}`).collection<location>('locations').valueChanges()
  }

  getGroups(user: user) {
    return this.afs.collection("users").doc(`${user.uid}`).collection("groups", ref => ref.where("location", "==", user.currentLocation)).valueChanges()
  }

  getLights(user: user) {
    return this.afs.collection("users").doc(`${user.uid}`).collection("lights", ref => ref.where("location", "==", user.currentLocation)).valueChanges()
  }

  getScenes(user: user) {
    return this.afs.collection("users").doc(`${user.uid}`).collection("scenes").valueChanges()
  }

  changeLocation(user: user, location: location) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data = {
      currentLocation: location.id,
      currentLocationName: location.name
    }

    return userRef.set(data, { merge: true })
  }

  updateFirestore(user: user) {
    if (!user.lifxToken) { return }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + user.lifxToken)


    this.http.get<any[]>("https://api.lifx.com/v1/lights/all", { headers: headers, observe: 'response' })
      .subscribe((response) => {

        let batch = this.afs.firestore.batch()

        const lights = response.body

        let _lights: any[] = [];
        let _groups: any[] = [];
        let _locations: any[] = [];
        for (const light of lights) {

          if (!_locations.some((location) => location.id === light.location.id)) {
            _locations.push(light.location);
          }

          const groupIndex = _groups.indexOf((group) => group.id === light.group.id)
          if (groupIndex == -1) {
            _groups.push({ id: light.group.id, name: light.group.name, power: light.power, location: light.location.id })
          } else {
            if (light.power == 'on') {
              _groups[groupIndex].power == "on"
            }
          }

          _lights.push({ id: light.id, name: light.label, location: light.location.id, group: light.group.id, power: light.power, hue: light.color.hue, saturation: light.color.saturation, brightness: light.brightness, kelvin: light.color.kelvin })

          for (const light of _lights) {
            batch.set(this.afs.firestore.collection("users").doc(`${user.uid}`).collection("lights").doc(`${light.id}`), light)
          }

          for (const group of _groups) {
            batch.set(this.afs.firestore.collection("users").doc(`${user.uid}`).collection("groups").doc(`${group.id}`), group)
          }

          for (const location of _locations) {
            batch.set(this.afs.firestore.collection("users").doc(`${user.uid}`).collection("locations").doc(`${location.id}`), location)
          }
        }

        batch.commit()
      })

    this.http.get<any[]>("https://api.lifx.com/v1/scenes", { headers: headers, observe: 'response' })
      .subscribe((response) => {

        let batch = this.afs.firestore.batch()

        const scenes = response.body

        scenes.sort((a, b) => {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        for (const scene of scenes) {
          batch.set(this.afs.firestore.collection("users").doc(`${user.uid}`).collection("scenes").doc(`${scene.uuid}`), scene)
        }

        batch.commit()
      })



  }

  setPowerGroup(user: user, group: group, power: string) {
    this.setState(user, "group_id:" + group.id, { power: power })
    this.afs.collection("users").doc(`${user.uid}`).collection("groups").doc(`${group.id}`).update({ power: power })
    this.afs.collection("users").doc(`${user.uid}`).collection("lights", ref => ref.where("group", "==", group.id)).get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((light) => {
          this.afs.collection("users").doc(`${user.uid}`).collection("lights").doc(`${light.id}`).update({ power: power })
        }, this);
      })
  }

  protected _tempGroupPower: string;
  setPowerLight(user: user, light: light, power: string) {
    this.setState(user, "id:" + light.id, { power: power })
    this.afs.collection("users").doc(`${user.uid}`).collection("lights").doc(`${light.id}`).update({ power: power })
    this.afs.collection("users").doc(`${user.uid}`).collection("lights", ref => ref.where("group", "==", light.group)).get()
      .subscribe((querySnapshot) => {
        this._tempGroupPower = "off"
        querySnapshot.forEach((doc) => {
          let _light = doc.data() as light;
          if (_light.id = light.id) { _light.power = power }
          if (_light.power == "on") { this._tempGroupPower = "on" }
        }, this);
        this.afs.collection("users").doc(`${user.uid}`).collection("groups").doc(`${light.group}`).update({ power: this._tempGroupPower })
      })
  }

  setState(user: user, selector: string, state: any) {
    this.http.put("https://api.lifx.com/v1/lights/" + selector + "/state", state, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.lifxToken), observe: 'response' })
      .subscribe((response) => {
        this.requestsRemaining = parseInt(response.headers.get('X-RateLimit-Remaining'))
      })
  }

  setStateData: any;
  setStates(user: user, states: states) {
    this.http.put("https://api.lifx.com/v1/lights/states", states, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.lifxToken), observe: 'response' })
      .subscribe((response) => {
        this.requestsRemaining = parseInt(response.headers.get('X-RateLimit-Remaining'))
      })

    this.setStateData = {};

    if (states.defaults.color) {
      if (states.defaults.color.includes("kelvin")) {
        this.setStateData.kelvin = states.defaults.color.slice(7)
      } else {
        this.setStateData.hue = this.colors[states.defaults.color]
      }
    }
    if (states.defaults.brightness) {
      this.setStateData.brightness = states.defaults.brightness
    }

    for (const group of states.states) {
      let groupID = group.selector.slice(9);
      this.afs.collection("users").doc(`${user.uid}`).collection("lights", ref => ref.where("group", "==", groupID)).get()
        .subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.afs.firestore.collection("users").doc(`${user.uid}`).collection("lights").doc(`${doc.id}`).update(this.setStateData)
          }, this);
        })
    }
  }

  activateScene(user: user, scene: scene) {
    this.http.put("https://api.lifx.com/v1/scenes/scene_id:" + scene.uuid + "/activate", null, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.lifxToken), observe: 'response' })
      .subscribe((response) => {
        this.requestsRemaining = parseInt(response.headers.get('X-RateLimit-Remaining'))
      })

    let batch = this.afs.firestore.batch()
    for (const _scene of scene.states) {
      let docID = _scene.selector.slice(3);
      let data = {
        brightness: _scene.brightness,
        hue: _scene.color.hue,
        saturation: _scene.color.saturation,
        kelvin: _scene.color.kelvin,
        power: _scene.power
      }
      batch.update(this.afs.firestore.collection("users").doc(`${user.uid}`).collection("lights").doc(`${docID}`), data)
    }
    batch.commit()
  }
}

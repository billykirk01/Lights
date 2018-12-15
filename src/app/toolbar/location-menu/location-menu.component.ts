import { Component, Input, SimpleChanges } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { user } from 'src/models/user';
import { location } from 'src/models/location';
import { LocationManagerComponent } from 'src/app/location-manager/location-manager.component';
import { LifxService } from 'src/app/core/lifx.service';

@Component({
  selector: 'app-location-menu',
  templateUrl: './location-menu.component.html',
  styleUrls: ['./location-menu.component.css']
})
export class LocationMenuComponent {

  @Input() user: user;

  locations: location[];

  constructor(private database: LifxService, private bottomSheet: MatBottomSheet) { }

  ngOnChanges(changes: SimpleChanges) {
    //check if user exists to prevent logout error
    if (!changes.user.currentValue) { return }

    if (!changes.user.previousValue || changes.user.currentValue.currentLocation != changes.user.previousValue.currentLocation) {
      this.database.getLocations(this.user).subscribe((locations) => this.locations = locations)
    }
  }

  openLocationManager() {
    if (!this.user.lifxToken) { return }
    this.bottomSheet.open(LocationManagerComponent, {
      data: {
        user: this.user,
        locations: this.locations
      },
      autoFocus: false,
      restoreFocus: false
    });
  }


}

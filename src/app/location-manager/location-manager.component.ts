import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { LifxService } from '../core/lifx.service';
import { location } from 'src/models/location';

@Component({
  selector: 'app-location-manager',
  templateUrl: './location-manager.component.html',
  styleUrls: ['./location-manager.component.css']
})
export class LocationManagerComponent {

  constructor(private database: LifxService, private bottomSheet: MatBottomSheet, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  changeLocation(location: location) {
    this.database.changeLocation(this.data.user, location)
    this.bottomSheet.dismiss();
  }

}

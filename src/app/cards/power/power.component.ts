import { Component, Input, SimpleChanges } from '@angular/core';
import { LifxService } from 'src/app/core/lifx.service';
import { map } from 'rxjs/operators'
import { user } from 'src/models/user';
import { group } from 'src/models/group';
import { light } from 'src/models/light';

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.css']
})
export class PowerComponent {

  @Input() user: user;
  @Input() onMobile: boolean;

  groups: any[];
  lights: any[];

  constructor(private lifx: LifxService) { }

  ngOnChanges(changes: SimpleChanges) {
    //check if user exists
    if (!changes.user.currentValue) {
      return
    }

    if (!changes.user.previousValue || changes.user.currentValue.currentLocation != changes.user.previousValue.currentLocation) {
      this.lifx.getGroups(this.user).subscribe((groups) => {
        if (!this.groups || this.groups.length != groups.length) { this.groups = groups }
        else {
          groups.forEach((group, index) => {
            this.groups[index].power = group.power
          });
        }
      })
      this.lifx.getLights(this.user).pipe(
        map(lights => lights.sort(this.sortByGroup))
      ).subscribe((lights) => {
        if (!this.lights || this.lights.length != lights.length) { this.lights = lights }
        else {
          lights.forEach((light, index) => {
            this.lights[index].power = light.power
            this.lights[index].brightness = light.brightness
          });
        }
      })
    }
  }

  private sortByGroup(a: light, b: light) {
    if (a.group < b.group)
      return -1;
    if (a.group > b.group)
      return 1;
    return 0;
  }

  groupButtonPressed(group: group) {
    this.lifx.setPowerGroup(this.user, group, group.power == "on" ? "off" : "on")
  }

  lightButtonPressed(light: light) {
    this.lifx.setPowerLight(this.user, light, light.power == "on" ? "off" : "on")
  }

  transformId(id: string) {
    return id.replace(/[0-9]/g, '')
  }

}

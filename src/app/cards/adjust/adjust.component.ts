import { Component, Input, SimpleChanges } from '@angular/core';
import { user } from 'src/models/user';
import { LifxService } from 'src/app/core/lifx.service';
import { group } from 'src/models/group';

@Component({
  selector: 'app-adjust',
  templateUrl: './adjust.component.html',
  styleUrls: ['./adjust.component.css']
})
export class AdjustComponent {

  @Input() user: user

  groups: group[];

  colors = [
    { name: "red", hue: 0 },
    { name: "orange", hue: 36 },
    { name: "green", hue: 120 },
    { name: "blue", hue: 250 },
    { name: "purple", hue: 280 },
    { name: "pink", hue: 325 }
  ]

  brightnessLevels = [20, 40, 60, 80, 100]

  kelvinLevels = [1500, 2500, 3500, 4500, 5500]

  hueSliderValue = 0;
  saturationSliderValue = 0;
  brightnessSliderValue = 0;
  kelvinSliderValue = 0;

  activeBrightness: number = 0
  activeKelvin: number = 0
  activeColor: string = ""

  enableButtons: boolean = false;

  constructor(private lifx: LifxService) { }

  ngOnChanges(changes: SimpleChanges) {
    //check if user exists
    if (!changes.user) { return }

    if (!changes.user.previousValue || changes.user.currentValue.currentLocation != changes.user.previousValue.currentLocation) {
      this.lifx.getGroups(this.user).subscribe((groups) => {
        this.groups = groups
        this.checkEnable()
      })
    }
  }

  setKelvin(kelvin: number) {
    this.activeKelvin = kelvin;
    this.activeColor = "";
    this.buildState()
  }

  setBrightness(brightness: number) {
    this.activeBrightness = brightness;
    this.buildState()
  }

  setColor(color: any) {
    this.activeColor = color.name
    this.activeKelvin = 0;
    this.buildState()
  }

  selectionButtonPressed(group: group) {
    group.selected = !group.selected;
    this.activeBrightness = 0;
    this.activeColor = "";
    this.activeKelvin = 0;
    this.checkEnable()
  }

  buildState() {
    let state: any = {
      "states": [],
      "defaults": {},
      "fast": true
    }

    for (const group of this.groups) {
      if (group.selected) { state.states.push({ "selector": `group_id:${group.id}` }) }
    }

    if (!state.states.length) { return }

    state.defaults.duration = 1.0
    if (this.activeBrightness) { state.defaults.brightness = this.activeBrightness / 100 }
    if (this.activeColor) { state.defaults.color = this.activeColor }
    if (this.activeKelvin) { state.defaults.color = `kelvin:${this.activeKelvin}` }
    this.lifx.setStates(this.user, state)
  }

  checkEnable() {
    let tempEnableButtons = false;
    for (const group of this.groups) {
      if (group.selected) { tempEnableButtons = true }
    }
    this.enableButtons = tempEnableButtons;
  }

}

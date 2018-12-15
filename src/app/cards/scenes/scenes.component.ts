import { Component, Input, SimpleChanges } from '@angular/core';
import { user } from 'src/models/user';
import { LifxService } from 'src/app/core/lifx.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.css']
})
export class ScenesComponent {

  @Input() user: user

  scenes: Observable<any[]>;

  activeScene: string;

  constructor(private lifx: LifxService) { }

  ngOnChanges(changes: SimpleChanges) {
    //check if user exists
    if (!changes.user) { return }

    if (!changes.user.previousValue || changes.user.currentValue.currentLocation != changes.user.previousValue.currentLocation) {
      this.scenes = this.lifx.getScenes(this.user)
    }
  }

  activateScene(scene: any) {
    this.activeScene = scene.name;
    this.lifx.activateScene(this.user, scene);
  }
}

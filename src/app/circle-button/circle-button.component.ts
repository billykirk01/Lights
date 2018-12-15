import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

import * as ProgressBar from 'progressbar.js'

@Component({
  selector: 'app-circle-button',
  templateUrl: './circle-button.component.html',
  styleUrls: ['./circle-button.component.css']
})
export class CircleButtonComponent {

  @Input() id: string;
  @Input() label: string;
  @Input() level: number;
  @Input() onMobile: boolean;

  @Output() touched: EventEmitter<string> = new EventEmitter();

  circle: any;

  ngAfterViewInit() {
    this.circle = new ProgressBar.Circle('#' + this.id, {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null,
      text: {
        value: this.label,
        style: {
          color: '#666',
          position: 'absolute',
          left: '50%',
          top: '50%',
          padding: 0,
          margin: 0,
          // You can specify styles which will be browser prefixed
          transform: {
            prefix: true,
            value: 'translate(-50%, -50%)'
          }
        }
      }
    });
    this.circle.animate(this.level, {
      duration: 900,
      easing: 'easeInOut'
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.circle && changes.level && changes.level.currentValue != changes.level.previousValue) {
      this.circle.animate(this.level, {
        duration: 900,
        easing: 'easeInOut'
      });
    }
  }

  circleTouched() {
    this.touched.emit()
  }

}

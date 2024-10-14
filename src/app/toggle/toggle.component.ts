import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'

})
export class ToggleComponent {
 @Output() changed = new EventEmitter<string>();
}

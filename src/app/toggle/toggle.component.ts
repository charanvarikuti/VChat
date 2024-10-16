import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'

})
export class ToggleComponent {
//  @Output() changed = new EventEmitter<string>();
 isToggled: boolean = true;

 // Create an EventEmitter to emit the toggle state to the parent
 @Output() toggle = new EventEmitter<boolean>();
 onToggle() {
  this.isToggled = !this.isToggled;  // Toggle the state locally
  this.toggle.emit(this.isToggled);  // Emit the new state to the parent
}
}

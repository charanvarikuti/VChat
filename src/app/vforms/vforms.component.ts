
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'vform',
  templateUrl: './vforms.component.html',
  styleUrl: './vforms.component.scss'
})
export class VformsComponent implements OnInit {
  @Input() fields: any[]; // Array of field configurations passed from the parent
  @Output() formChange = new EventEmitter<FormGroup>(); // Emits form group changes to parent
  @Output() inputClick = new EventEmitter<string>();
  form: FormGroup;
  btn:boolean=false;
  @Output() formData = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.createFormGroup(this.fields);
    if(this.form.controls['Btn']){
      this.btn=true
    }
    // Emit form changes to parent
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(this.form);
    });
  }

  // Method to create FormGroup based on fields
  createFormGroup(fields: any[]): FormGroup {
    const group = this.fb.group({});
    fields.forEach(field => {
      group.addControl(field.name, new FormControl(field.value || ''));
    });
    return group;
  }
  sendData(){
    this.formData.emit(this.form)
  }
  sendFormData(){
    this.formData.emit(this.form)
  }
  
  onInputClick(eve:any){
    this.inputClick.emit(eve);
  }
  // emit(value: any) {
  //   throw new Error('Method not implemented.');
  // }
}


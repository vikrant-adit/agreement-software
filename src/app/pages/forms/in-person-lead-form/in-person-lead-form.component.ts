import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "../../../header/header.component";
@Component({
  selector: 'app-in-person-lead-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './in-person-lead-form.component.html',
  styleUrl: './in-person-lead-form.component.scss'
})
export class InPersonLeadFormComponent implements OnInit {
  practiceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.practiceForm = this.fb.group({
      practiceName: ['', Validators.required],
      selectEvent: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      pocForDemo: [''],
      officePhoneNumber: [''],
      officeEmail: [''],
      practiceIndustry: [''],
      selectPMS: [''],
      selectCurrency: [''],
      notes: ['']
    });
  }
  eventz:any[]=[];
  ngOnInit(): void {
    // this.getEventz()
  }
  onSubmit() {
    if (this.practiceForm.valid) {
      console.log(this.practiceForm.value);
      // Handle form submission here
    }
  }
  // getEventz(){
  //   this.eventzSevice.getEventz().subscribe({
  //     next:res=>{
  //       console.log(res)
  //       this.eventz=res
  //     }
  //   })
  // }
}

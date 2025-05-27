import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "../../../header/header.component";
import { PhoneNumberFormatterDirective } from '../../../../directives/phone-number-formatter.directive';
import { EventsService } from '../../../../services/events/events.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PacakgeSelectionComponent } from './pacakge-selection/pacakge-selection.component';

@Component({
  selector: 'app-in-person-lead-form',
  standalone: true,
  imports: [
    PhoneNumberFormatterDirective,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    ReactiveFormsModule, 
    HeaderComponent,
    MatDialogModule
  ],
  templateUrl: './in-person-lead-form.component.html',
  styleUrl: './in-person-lead-form.component.scss'
})
export class InPersonLeadFormComponent implements OnInit {
  practiceForm: FormGroup;
  eventzSevice: any = inject(EventsService);
  dental_or_optometry = '';
  private dialog = inject(MatDialog);
  
  constructor(private fb: FormBuilder) {
    this.practiceForm = this.fb.group({
      practiceName: ['', Validators.required],
      selectEvent: ['', Validators.required],
      fullName: ['', Validators.required],
      pocForDemo: [''],
      officePhoneNumber: [''],
      officeEmail: ['', Validators.required],
      personalPhoneNumber: [''],
      personalEmail: [''],
      practiceIndustry: ['', Validators.required],
      pms: ['', Validators.required],
      selectCurrency: ['', Validators.required],
      notes: [''],
      selectedPackage: [''],
    });
  }
  
  eventz: any[] = [];
  
  ngOnInit(): void {
    this.getEventz()
  }
  
  onSubmit() {
    if(this.practiceForm.get('selectedPackage')?.value === '') {
      this.practiceForm.get('selectedPackage')?.setValue('Event')
      console.log('Please select a package',this.practiceForm.get('selectedPackage')?.value);
    }
    if (this.practiceForm.valid) {
      console.log(this.practiceForm.value);
      // Handle form submission here
    }
  }
  
  getEventz() {
    this.eventzSevice.getAllEventz().subscribe((res: any) => {
      this.eventz = res.data
    })
  }
  
  openPacakgeDialog() {
    const dialogRef = this.dialog.open(PacakgeSelectionComponent, {
       minWidth: '75vw',
       maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        this.practiceForm.patchValue({
          selectedPackage: result
        });
      }
    });
  }
}

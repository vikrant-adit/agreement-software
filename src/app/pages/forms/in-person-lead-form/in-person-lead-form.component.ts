import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../../header/header.component';
import { PhoneNumberFormatterDirective } from '../../../../directives/phone-number-formatter.directive';
import { EventsService } from '../../../../services/events/events.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PacakgeSelectionComponent } from './pacakge-selection/pacakge-selection.component';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';
import { Router } from '@angular/router';
import { promotionPricing } from '../pre-agreement-form/pricingArr';
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
    MatDialogModule,
  ],
  templateUrl: './in-person-lead-form.component.html',
  styleUrl: './in-person-lead-form.component.scss',
})
export class InPersonLeadFormComponent implements OnInit {
  practiceForm: FormGroup;
  promotionPricing: any = promotionPricing;

  eventzSevice: any = inject(EventsService);
  onlineFormService: any = inject(OnlineFormAgreementService);
  dental_or_optometry = '';
  private dialog = inject(MatDialog);
  router: any = inject(Router);
  constructor(private fb: FormBuilder) {
    this.practiceForm = this.fb.group({
      practiceName: ['', Validators.required],
      which_event: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      poc_demo: [''],
      office_phone_number: [''],
      office_email: ['', Validators.required],
      personal_phone_number: [''],
      personal_email: [''],
      practiceIndustry: ['', Validators.required],
      practice_ehr: ['', Validators.required],
      other_ehr: [''],
      currency: ['USD', Validators.required],
      notes: [''],
      selectedPackageName: [''],
      medium: ['In-person'],
      newOrExistingClient: ['New'],
      lead_source: ['Eventz'],
      pricingDetails: this.createPricingFormGroup(),
    });
  }
  createPricingFormGroup(): FormGroup {
    return this.fb.group({});
  }
  eventz: any[] = [];

  ngOnInit(): void {
    this.getEventz();
    this.practiceForm.get('currency')?.valueChanges.subscribe((currency) => {
      // If the dialog is open, update its currency property
      const openDialogs = this.dialog.openDialogs;
      openDialogs.forEach((dialogRef) => {
        if (dialogRef.componentInstance instanceof PacakgeSelectionComponent) {
          dialogRef.componentInstance.currency = currency;
          dialogRef.componentInstance.updatePricesForCurrency();
        }
      });
    });
  }

  // onSubmit() {
  //   if(this.practiceForm.get('selectedPackage')?.value === '') {
  //     this.practiceForm.get('selectedPackage')?.setValue('Event')
  //     console.log('Please select a package',this.practiceForm.get('selectedPackage')?.value);
  //   }
  //   if (this.practiceForm.valid) {
  //     console.log(this.practiceForm.value);
  //     // Handle form submission here
  //     this.onlineFormService.addInPersonFormData(this.practiceForm.value).subscribe((res: any) => {
  //         this.router.navigate(['/view-agreement/' + res.data.agreementId]);
  //       console.log(res);
  //     })
  //   }
  // }
  onSubmit() {
    if (this.practiceForm.get('selectedPackageName')?.value === '') {
      this.practiceForm.get('selectedPackageName')?.setValue('Event');
      console.log(
        'Please select a package',
        this.practiceForm.get('selectedPackageName')?.value
      );
    }

    // Check if pricingDetails is empty
    const pricingDetailsGroup = this.practiceForm.get(
      'pricingDetails'
    ) as FormGroup;
    if (
      pricingDetailsGroup &&
      Object.keys(pricingDetailsGroup.controls).length === 0
    ) {
      const currency = this.practiceForm.get('currency')?.value || 'USD';
      const eventPricing = this.promotionPricing['Event'];
      for (const key in eventPricing) {
        if (key === 'add_on_verification') continue; // Skip this key
        if (
          eventPricing[key] &&
          typeof eventPricing[key] === 'object' &&
          (eventPricing[key].USD !== undefined ||
            eventPricing[key].CAD !== undefined)
        ) {
          pricingDetailsGroup.addControl(
            key,
            new FormControl(eventPricing[key][currency] ?? 0)
          );
        } else {
          pricingDetailsGroup.addControl(
            key,
            new FormControl(eventPricing[key])
          );
        }
      }
    }

    if (this.practiceForm.valid) {
      console.log(this.practiceForm.value);
      // Handle form submission here
      this.onlineFormService
        .addInPersonFormData(this.practiceForm.value)
        .subscribe(
          (res: any) => {
            if (res && res.success === false && res.message) {
              alert(res.message); // Show alert if lead already exists or any error message
            } else {
           this.router.navigate(['/view-agreement/' + res.data.agreementId]);
              console.log(res);
            }
          },
          (error: any) => {
            alert('An error occurred while submitting the form.');
            console.error(error);
          }
        );
    }
  }
  getEventz() {
    this.eventzSevice.getAllEventz().subscribe((res: any) => {
      this.eventz = res.data;
    });
  }

  openPacakgeDialog() {
    const dialogRef = this.dialog.open(PacakgeSelectionComponent, {
      minWidth: '75vw',
      maxHeight: '90vh',
      data: { currency: this.practiceForm.get('currency')?.value || 'USD' },
    });

    dialogRef.componentInstance.currency =
      this.practiceForm.get('currency')?.value || 'USD';

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'asddddddddddddddd');
      if (result) {
        this.practiceForm.patchValue({
          selectedPackageName: result.selectedPackage,
        });
        const pricingDetailsGroup = this.practiceForm.get(
          'pricingDetails'
        ) as FormGroup;
        if (pricingDetailsGroup && result?.pricingArray) {
          Object.entries(result.pricingArray).forEach(([key, value]) => {
            if (pricingDetailsGroup.contains(key)) {
              pricingDetailsGroup.get(key)?.setValue(value);
            } else {
              pricingDetailsGroup.addControl(key, new FormControl(value));
            }
          });
        }
      } else {
        this.practiceForm.patchValue({
          selectedPackageName: 'Event',
        });

        // Get the selected currency
        const currency = this.practiceForm.get('currency')?.value || 'USD';
        // Get the Event pricing object
        const eventPricing = this.promotionPricing['Event'];
        // Create a new object with only the selected currency values
        const pricingDetails: any = {};
        for (const key in eventPricing) {
          if (
            eventPricing[key] &&
            typeof eventPricing[key] === 'object' &&
            (eventPricing[key].USD !== undefined ||
              eventPricing[key].CAD !== undefined)
          ) {
            pricingDetails[key] = eventPricing[key][currency] ?? 0;
          } else {
            pricingDetails[key] = eventPricing[key];
          }
        }
        const pricingDetailsGroup = this.practiceForm.get(
          'pricingDetails'
        ) as FormGroup;
        Object.entries(pricingDetails).forEach(([key, value]) => {
          if (pricingDetailsGroup.contains(key)) {
            pricingDetailsGroup.get(key)?.setValue(value);
          } else {
            pricingDetailsGroup.addControl(key, new FormControl(value));
          }
        });
      }
    });
  }
  updatePricingForCurrency(currency: string) {
    // Use the selected package or default to 'Event'
    const selectedPromo =
      this.practiceForm.get('selectedPackageName')?.value || 'Event';
    const basePricing = this.promotionPricing[selectedPromo];
    if (!basePricing) return;

    const pricingDetails = this.practiceForm.get('pricingDetails') as FormGroup;

    // Update or add all controls for the selected currency
    for (const key in basePricing) {
      let value = basePricing[key];
      if (
        value &&
        typeof value === 'object' &&
        (value.USD !== undefined || value.CAD !== undefined)
      ) {
        value = value[currency] ?? 0;
      }
      if (pricingDetails.contains(key)) {
        pricingDetails.get(key)?.setValue(value, { emitEvent: false });
      } else {
        pricingDetails.addControl(key, new FormControl(value));
      }
    }
  }
}

//pre agremet form

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../header/header.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';
import { promotionPricing } from '../pre-agreement-form/pricingArr';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EventRepsService } from '../../../../services/system-setting/event-reps.service';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectorRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

// Import the bundle configuration
import { BundleField, BundleGroup, bundleGroups } from '../pre-agreement-form/bundle-config';
@Component({
  selector: 'app-pre-agreement-test',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    ToastrModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pre-agreement-test.component.html',
  styleUrl: './pre-agreement-test.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class PreAgreementTestComponent {
  preAgreementForm: FormGroup;
  dental_or_optometry = '';
  formService=inject(OnlineFormAgreementService);
  receivedForm!: FormGroup;
  sendForm:any;
  bundleGroups: BundleGroup[] = [];
  private eventService = inject(EventRepsService);
  private datePipe = inject(DatePipe);
  agreementId:any;
  selectedPromotion: string  = '';
  isAccountIdLoading: boolean = false; // Add this property to your component class
  constructor(private fb: FormBuilder, private router:Router,private toastr:ToastrService,private cdr: ChangeDetectorRef) {
    this.preAgreementForm = this.fb.group({
      practiceIndustry: ['', Validators.required],
      newOrExistingClient: ['', Validators.required],
      multipleLocations: ['', Validators.required],
      accountId: ['', [Validators.required, Validators.pattern(/^\d{19}$/)]],
      currency: ['', Validators.required],
      deal: [''], 
      deal_id: [''],
      practice_ehr: ['', Validators.required],
      displayPricing: [false],
      displayTechStackComparison: [false],
      sales_person_promotion_type: [''],
      promotionExpiryDate:[''],
      promotionExpiryDate_display:[''],
      event_type: [''],
      no_of_days: [''],
      pricingDetails: this.createPricingFormGroup(), // Nested FormGroup
      techStack:[[]]
    });
  }

  initBundleGroups() {
    // Get bundle groups from the external file
    this.bundleGroups = bundleGroups;
    console.log(this.bundleGroups)
    // Add form controls for each field
    this.bundleGroups.forEach(group => {
      group.fields.forEach(field => {
        const pricingDetails = this.preAgreementForm.get('pricingDetails') as FormGroup;
        pricingDetails.addControl(field.name, this.fb.control(null, field.validators));
      });
    });
    
    // Set initial visibility
    // this.updateBundleVisibility();
  }
  
  // Update bundle visibility based on selected promotion
  updateBundleVisibility() {
    // Check if no promotion is selected or it's empty
    if (!this.selectedPromotion || this.selectedPromotion.trim() === '') {
      // Hide all bundles when no promotion is selected
      this.bundleGroups.forEach(bundle => {
        bundle.enabled = false;
      });
      // Update form controls and exit early
      this.updateFormControlsBasedOnVisibility();
      return;
    }

    // First, hide all bundles by default
    this.bundleGroups.forEach(bundle => {
      bundle.enabled = false;
    });

    // Then show only the appropriate bundles based on promotion type
    if (this.selectedPromotion === 'No Vendor Promo') {
      // For No Vendor Promo, only show these specific bundles
      this.showBundle('aditCore', true);
      this.showBundle('addOns', true);
      this.showBundle('pozative', true);     // Only show for No Vendor Promo
      this.showBundle('verifications', true); // Only show for No Vendor Promo
      this.showBundle('fees', true);
       this.showBundle('noOfDays', true);
    } 
    else if (this.selectedPromotion.includes('Only Lite')) {
      // Show only Adit Lite bundles for Lite-only promotions
      this.showBundle('aditLite', true);
      this.showBundle('fees', true);
       this.showBundle('noOfDays', true);
    }
    else if (this.selectedPromotion.includes('Core')) {
      // Show Adit Core and add-ons for Core promotions
      this.showBundle('aditCore', true);
      this.showBundle('addOns', true);
      this.showBundle('fees', true);
       this.showBundle('noOfDays', true);
    }
    else if (this.selectedPromotion.includes('Free Verifications')) {
      // For Free Verifications promos
      this.showBundle('aditCore', true);
      this.showBundle('addOns', true);
      this.showBundle('fees', true);
       this.showBundle('noOfDays', true);
      
      // Set verification price to 0
      const verificationField = this.findField('add_on_verification');
      if (verificationField) {
        verificationField.enabled = true;
        this.getFormControl('add_on_verification')?.setValue(0);
      }
    }
    else if (this.selectedPromotion.includes('Free Phones')) {
      // For Free Phones promos
      this.showBundle('aditCore', true);
      this.showBundle('addOns', true);
      this.showBundle('fees', true);
       this.showBundle('noOfDays', true);
      
      // Enable phones add-on
      const phonesField = this.findField('add_on_phones');
      if (phonesField) {
        phonesField.enabled = true;
      }
    }
    else {
      // Default case - show standard bundles
      this.showBundle('tech', true);
      this.showBundle('analytics', true);
      this.showBundle('fees', true);
       this.showBundle('noOfDays', true);
    }
    
    // Update form controls based on visibility
    this.updateFormControlsBasedOnVisibility();
  }

  // Helper to show/hide an entire bundle
  showBundle(bundleId: string, show: boolean) {
    const bundle = this.bundleGroups.find(b => b.id === bundleId);
    if (bundle) {
      bundle.enabled = show;
    }
  }

  // Helper to find a specific field
  findField(fieldName: string): BundleField | undefined {
    for (const bundle of this.bundleGroups) {
      const field = bundle.fields.find(f => f.name === fieldName);
      if (field) {
        return field;
      }
    }
    return undefined;
  }

  // Update form controls based on bundle visibility
  updateFormControlsBasedOnVisibility() {
    this.bundleGroups.forEach(bundle => {
      // Only process fields in enabled bundles
      if (bundle.enabled) {
        bundle.fields.forEach(field => {
          const control = this.getFormControl(field.name);
          
          if (field.isAddOn) {
            // For add-ons, check if they're individually enabled
            if (field.enabled) {
              control?.enable();
              control?.setValidators(field.validators);
            } else {
              control?.disable();
              control?.setValue(null);
              control?.clearValidators();
            }
          } else {
            // For regular fields, they should be enabled if the bundle is enabled
            control?.enable();
            control?.setValidators(field.validators);
          }
          
          control?.updateValueAndValidity({ emitEvent: false });
        });
      } else {
        // If bundle is disabled, disable all its fields
        bundle.fields.forEach(field => {
          const control = this.getFormControl(field.name);
          control?.disable();
          control?.setValue(null);
          control?.clearValidators();
          control?.updateValueAndValidity({ emitEvent: false });
        });
      }
    });
    
    this.cdr.detectChanges();
  }
 
  createPricingFormGroup(): FormGroup {
    return this.fb.group({    });
  }
  formPatched: boolean = false;
  gotId: boolean = false;
  ngOnInit() {
    this.initBundleGroups();
    
    // Watch for promotion changes
    this.preAgreementForm.get('sales_person_promotion_type')?.valueChanges
      .subscribe(promotion => {
        this.selectedPromotion = promotion;
        console.log('Promotion changed to:', promotion);
        
        // Update visibility first
        this.updateBundleVisibility();
        
        // Then patch values from promotionPricing
        if (promotion) {
          this.patchPromotionValues(promotion);
        }
      });
  }

  addVaildate(){
    if (this.preAgreementForm.get('displayPricing')?.value == true) {
      this.preAgreementForm.get('sales_person_promotion_type')?.setValidators([Validators.required]);
      this.preAgreementForm.get('sales_person_promotion_type')?.updateValueAndValidity();
      
    }
  this.cdr.detectChanges();
  }

  onSubmit() {
    // Check if pricing is displayed but no promotion is selected
    if (this.preAgreementForm.get('displayPricing')?.value === true && 
      (!this.selectedPromotion || this.selectedPromotion.trim() === '')) {
      this.toastr.error('Please select a promotion type');
      return;
    }

    // Validate the form
    const basicFieldsValid = true;
    const pricingDetailsGroup = this.preAgreementForm.get('pricingDetails') as FormGroup;
    
    // Only validate pricing details if pricing is displayed
    let pricingValid = true;
    if (this.preAgreementForm.get('displayPricing')?.value === true) {
      // Check if each enabled bundle has valid values
      this.bundleGroups.forEach(bundle => {
        if (bundle.enabled) {
          bundle.fields.forEach(field => {
            if (!field.isAddOn || (field.isAddOn && field.enabled)) {
              const control = pricingDetailsGroup.get(field.name);
              if (control?.invalid) {
                pricingValid = false;
                control.markAsTouched(); // Mark as touched to show validation errors
              }
            }
          });
        }
      });
    }

    if (basicFieldsValid && pricingValid) { 
      // Store the multiple locations value BEFORE processing the form
      const multipleLocations = this.preAgreementForm.get('multipleLocations')?.value;
      
      // Prepare form data for submission
      const formData = new FormData();
      
      // Extract only enabled bundle values for submission
      const pricingData: any = {};
      
      // Add the selected promotion type
      pricingData.promotionType = this.selectedPromotion;
      
      // Add bundle information - which bundles are enabled
      const enabledBundles = this.bundleGroups
        .filter(bundle => bundle.enabled)
        .map(bundle => bundle.id);
      pricingData.enabledBundles = enabledBundles;
      
      // Add all field values from enabled bundles
      this.bundleGroups.forEach(bundle => {
        if (bundle.enabled) {
          bundle.fields.forEach(field => {
            if (!field.isAddOn || (field.isAddOn && field.enabled)) {
              const control = this.getFormControl(field.name);
              if (control?.enabled && control?.value !== null) {
                pricingData[field.name] = control.value;
              }
            }
          });
        }
      });
      
      // EXPLICITLY handle special fields regardless of bundle enabled status
      // This ensures these critical fields are always included if they have values
      
      // 1. Get the activation fee value
      const activationFeeControl = this.getFormControl('activation_fee');
      if (activationFeeControl?.value !== null && activationFeeControl?.value !== undefined) {
        pricingData.activation_fee = activationFeeControl.value;
      }
      
      // 2. Get the no_of_days value
      const noOfDaysControl = this.getFormControl('no_of_days');
      if (noOfDaysControl?.value !== null && noOfDaysControl?.value !== undefined) {
        pricingData.no_of_days = noOfDaysControl.value;
        
        // Debug log
        console.log('Setting no_of_days value:', noOfDaysControl.value);
      } else {
        console.log('No of days control value is null or undefined');
        console.log('Control enabled:', noOfDaysControl?.enabled);
        console.log('Control exists:', !!noOfDaysControl);
      }
      
      // Append non-file form fields except techStack and pricingDetails
      Object.keys(this.preAgreementForm.value).forEach(key => {
        if (key === 'techStack' || key === 'pricingDetails') return; // Skip these
        
        const value = this.preAgreementForm.value[key];
        if (typeof value === 'object' && value !== null && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      // Append the processed pricing data
      formData.append('pricingDetails', JSON.stringify(pricingData));
      
      // Conditionally append techStack
      if (this.preAgreementForm.get('displayTechStackComparison')?.value === true) {
        formData.append('techStack', JSON.stringify(this.preAgreementForm.get('techStack')?.value));
      } else {
        formData.append('techStack', JSON.stringify([])); // Send blank array if false
      }
      
      // Append file separately if selected
      if (this.selectedFile) {
        formData.append('fileUpload', this.selectedFile, this.selectedFile.name);
      }
      
      // Log the FormData for debugging
      console.log("Selected Promotion:", this.selectedPromotion);
      console.log("Enabled Bundles:", enabledBundles);
      console.log("Pricing Data:", pricingData);
      console.log("Full Form Data:", formData);
      
      // Submit the form
      this.loading = true; // Show loader during submission
      
      // this.formService.saveForm(formData).subscribe({
      //   next: (response) => {
      //     this.loading = false;
      //     this.toastr.success('Form submitted successfully!');
          
      //     // Navigate based on the stored multipleLocations value
      //     if (multipleLocations === 'yes') {
      //       this.router.navigate(['/view-agreements/' + response.data.agreementId]);
      //     } else {
      //       this.router.navigate(['/view-agreement/' + response.data.agreementId]);
      //     }
          
      //     // Reset the form AFTER navigation decision
      //     this.preAgreementForm.reset();
      //     this.selectedFile = null;
      //   },
      //   error: (error) => {
      //     this.loading = false;
      //     console.error('Error submitting form:', error);
      //     this.toastr.error('Error submitting form. Please try again.');
      //   }
      // });
    } else {
      // Show appropriate error message
      let errorMessage = 'Please fill all required fields.';
      
      if (!pricingValid) {
        errorMessage = 'Please check pricing details. Some values are invalid.';
      }
      
      this.toastr.error(errorMessage);
      
      // Focus the first invalid field
      const invalidControl = document.querySelector('.ng-invalid');
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  loading: boolean = false;
  
  eventOptions: any[] = [];
  
  
  onPromotionChange() {
    const selectedPromo = this.preAgreementForm.get('sales_person_promotion_type')?.value;
    this.selectedPromotion = selectedPromo || ''; // Ensure it's never null
    
    // Clear pricing details if no promotion is selected
    if (!this.selectedPromotion) {
      this.bundleGroups.forEach(bundle => {
        bundle.enabled = false;
      });
      this.updateFormControlsBasedOnVisibility();
      return;
    }
    
    if(this.selectedPromotion === 'Event'){
      this.eventService.getUsers().subscribe(res => {
       this.eventOptions = res.data;
      });
    }
    
    this.loading = true; // Show loader

    // Remove existing controls
    const pricingDetailsGroup = this.preAgreementForm.get('pricingDetails') as FormGroup;
    Object.keys(pricingDetailsGroup?.controls || {}).forEach((control) => {
      pricingDetailsGroup.removeControl(control);
    });

    // Re-initialize bundle groups with the new promotion type
    this.initBundleGroups();
    
    // Update visibility based on selected promotion
    this.updateBundleVisibility();
    
    // Patch values from promotionPricing
    this.patchPromotionValues(this.selectedPromotion);
    
    this.loading = false; // Hide loader
    
    this.preAgreementForm.updateValueAndValidity();
  }


getFormControl(controlName: string) {
  const pricingDetailsGroup = this.preAgreementForm.get('pricingDetails') as FormGroup;
  return pricingDetailsGroup?.get(controlName);
}
 
  bundleStates: { [key: string]: boolean } = {};
  pozativeState=true
  verificationOnlyState=true
  aditCoreState=true
    toggleBundle(control: string) {
      this.bundleStates[control] = !this.bundleStates[control];
      if(this.bundleStates[control]){
        if(control=='pozative_Only_Monthly'||control=='pozative_Only_Annually'){
          this.pozativeState=false
        }else   if(control=='verifications_Only_Monthly' || control=='verifications_Only_Annually' ){
          this.verificationOnlyState=false
        }else if(control=='aditCore_monthly' || control=='aditCore_annually'){
          this.aditCoreState=false
        }
      }else{
        if(control=='pozative_Only_Monthly'||control=='pozative_Only_Annually'){
          this.pozativeState=true
        }else   if(control=='verifications_Only_Monthly' || control=='verifications_Only_Annually' ){
          this.verificationOnlyState=true
        }else if(control=='aditCore_monthly' || control=='aditCore_annually'){
          this.aditCoreState=true
        }
      }
        
    }
    isBundleEnabled(control: string): boolean {
      return this.bundleStates[control];
    }


  
  addOnStates: { [key: string]: boolean } = {};
  phoneState:boolean=true
  analyticsState:boolean= true
  verificationState:boolean=true

  toggleBundleGroup(bundleId: string) {
    console.log('Toggling bundle:', bundleId);
    
    const bundle = this.bundleGroups.find(b => b.id === bundleId);
    if (bundle) {
      bundle.enabled = !bundle.enabled;
      console.log(`Bundle ${bundleId} is now ${bundle.enabled ? 'enabled' : 'disabled'}`);
      
      // If enabling the bundle, patch values from promotion data
      if (bundle.enabled && this.selectedPromotion) {
        const promotionData = promotionPricing[this.selectedPromotion] || {};
        
        bundle.fields.forEach(field => {
          if (promotionData[field.name] !== undefined) {
            const control = this.getFormControl(field.name);
            control?.setValue(promotionData[field.name]);
          }
        });
      }
      
      // Update form controls
      this.updateFormControlsBasedOnVisibility();
    } else {
      console.error(`Bundle with ID ${bundleId} not found`);
    }
  }
  
  // Toggle an individual add-on field
  toggleAddOnField(fieldName: string) {
    // Find the field in our bundle groups
    for (const bundle of this.bundleGroups) {
      const fieldIndex = bundle.fields.findIndex(f => f.name === fieldName);
      if (fieldIndex !== -1) {
        // Toggle the field's enabled state
        bundle.fields[fieldIndex].enabled = !bundle.fields[fieldIndex].enabled;
        
        const control = this.getFormControl(fieldName);
        
        if (bundle.fields[fieldIndex].enabled) {
          // When enabled, restore the saved value or the default from promotionPricing
          const promotionData = promotionPricing[this.selectedPromotion] || {};
          const value = promotionData[fieldName] || 0;
          control?.setValue(value);
          control?.enable();
        } else {
          // When disabled, clear the value
          control?.setValue(null);
          control?.disable();
        }
        
        control?.updateValueAndValidity();
        break;
      }
    }
    
    this.cdr.detectChanges();
  }
  // Toggle the add_on control state

  selectedFile: File | null = null;
  deals: any[] = [];
  errorMessage: string = '';
  successMsg!:string


disablePastDates = (date: Date | null): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
  return date ? date >= today : false;
};

 // Method to handle date change and format it
 formattedPromotionExpiryDate: string | null = null; // Property to store the formatted date
  dateToShow:any
 onDateChange(event: any, picker: any): void {
  const selectedDate = event.value; // Get the selected date
  if (selectedDate) {
    // Format the date to "March 27, 2025"
    this.formattedPromotionExpiryDate = this.datePipe.transform(selectedDate, 'MMMM d, y');
    // Store both the Date object and formatted string in the form control if needed
    this.preAgreementForm.get('promotionExpiryDate')?.setValue(selectedDate);
    this.preAgreementForm.get('promotionExpiryDate_display')?.setValue(this.formattedPromotionExpiryDate);
    // this.dateToShow=selectedDate
    
    // Close the datepicker
    picker.close();
  }
}

// Add this method to patch values from promotionPricing to your bundle fields
patchPromotionValues(promotionType: string) {
  if (!promotionType || !promotionPricing[promotionType]) {
    console.error(`No pricing data found for promotion: ${promotionType}`);
    return;
  }
  
  // console.log(`Patching values for promotion: ${promotionType}`);
  const promotionData = promotionPricing[promotionType];
  
  // First pass: Set all field values based on promotion data
  this.bundleGroups.forEach(bundle => {
    bundle.fields.forEach(field => {
      if (promotionData.hasOwnProperty(field.name)) {
        const value = promotionData[field.name];
        // console.log(`Setting ${field.name} to ${value}`);
        
        const control = this.getFormControl(field.name);
        if (control) {
          control.setValue(value);
          
          // For add-ons, determine if they should be enabled based on promotion type
          if (field.isAddOn) {
            // Enable add-ons when they have a non-zero value in the promotion data
            const shouldEnable = value > 0 || 
                               (field.name === 'add_on_verification' && promotionType.includes('Free Verifications')) ||
                               (field.name === 'add_on_phones' && promotionType.includes('Free Phones'));
            
            field.enabled = shouldEnable;
            
            if (!shouldEnable) {
              control.disable();
            } else {
              control.enable();
            }
          }
        }
      }
    });
  });
  
  // Second pass: Special handling for specific promotion types
  if (promotionType.includes('Free Verifications')) {
    // Find and update verification add-on
    const verificationField = this.findField('add_on_verification');
    if (verificationField) {
      verificationField.enabled = true;
      const control = this.getFormControl('add_on_verification');
      if (control) {
        control.setValue(0); // Free verifications = $0
        control.enable();
      }
    }
  }
  
  if (promotionType.includes('Free Phones')) {
    // Find and update phones add-on
    const phonesField = this.findField('add_on_phones');
    if (phonesField) {
      phonesField.enabled = true;
      const control = this.getFormControl('add_on_phones');
      if (control) {
        // Set the value but don't make it 0 - phone add-on might still have a cost
        control.enable();
      }
    }
  }
  
  // Update form validation based on current visibility and enabled state
  this.updateFormControlsBasedOnVisibility();
}



shouldShowBundleForNoVendorPromo(bundleId: string): boolean {
  // List of bundles that should be visible for No Vendor Promo
  const visibleBundles = ['aditCore', 'addOns', 'pozative', 'verifications', 'fees'];
  return visibleBundles.includes(bundleId);
}
}
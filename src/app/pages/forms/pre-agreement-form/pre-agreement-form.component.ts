import { Component, inject, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
import { TechStackComparisonComponent } from './tech-stack-comparison/tech-stack-comparison.component';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';
import { promotionPricing } from './pricingArr';
import { ToastrModule,ToastrService } from 'ngx-toastr';
import { EventRepsService } from '../../../../services/system-setting/event-reps.service';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
@Component({
  selector: 'app-pre-agreement-form',
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
    TechStackComparisonComponent,
    ToastrModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pre-agreement-form.component.html',
  styleUrl: './pre-agreement-form.component.scss',
  providers: [provideNativeDateAdapter(),DatePipe],
})
export class PreAgreementFormComponent implements OnInit {
  preAgreementForm: FormGroup;
  dental_or_optometry = '';
  formService=inject(OnlineFormAgreementService);
  receivedForm!: FormGroup;
  sendForm:any;

  private eventService = inject(EventRepsService);
  private activeRouter =inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  agreementId:any;
  isAccountIdLoading: boolean = false; // Add this property to your component class
  constructor(private fb: FormBuilder, private router:Router,private toastr:ToastrService) {
    this.preAgreementForm = this.fb.group({
      practiceIndustry: ['', Validators.required],
      newOrExistingClient: ['', Validators.required],
      multipleLocations: ['', Validators.required],
      accountId: ['', [Validators.required, Validators.pattern(/^\d{19}$/)]],
      sales_person_account_name: [''],
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
      pricingDetails: this.createPricingFormGroup(), // Nested FormGroup
      techStack:[[]]
    });
  }
  validateAccountId() {
    const accountIdControl = this.preAgreementForm.get('accountId');
    
    if (accountIdControl?.valid && accountIdControl.value) {
      // Set loading state to true before API call
      this.isAccountIdLoading = true;
      this.errorMessage = '';
      this.successMsg = '';
      
      this.formService.fetchDeal(accountIdControl.value).subscribe({
        next: (response:any) => {
          this.isAccountIdLoading = false; // Hide loader
          
          if (response && response.success) {
            // Clear any previous API errors
  
            // accountIdControl.set({.../accountIdControl.errors, apiError: null});
            
            // Handle successful response
            if(response.message!='No open deal present'){
              this.deals = response.data.deals;
              this.successMsg ='Account validated successfully'
              this.preAgreementForm.patchValue({
                sales_person_account_name: response.data.accountName,
              });
            }else{
               this.successMsg = response.message ;
           accountIdControl.setErrors({...accountIdControl.errors, apiError: null});
                this.deals=[]
            }
          } else {

            accountIdControl.setErrors({...accountIdControl.errors, apiError: response.message || 'Invalid Account ID'});
            this.errorMessage = response.message || 'Invalid Account ID';
          }
        },
        error: (error:any) => {
          this.isAccountIdLoading = false; // Hide loader on error
          
          // Set the error message from the API
          let errorMessage = 'Error validating Account ID';

          
          if (error && error.message) {
            // errorMessage = error.message;
            errorMessage = 'Invalid Accounnt ID';
          } else if (typeof error === 'string') {
            errorMessage = 'Invalid Accounnt ID';
          }
          
          this.errorMessage = errorMessage;
          accountIdControl.setErrors({...accountIdControl.errors, apiError: 'Invalid Account ID'});
        }
      });
    }
  }
  onFormChanged(form: FormGroup) {
    this.receivedForm = form;
    // console.log('Received Form:', this.receivedForm.value);
  }
  onDealSelect(event: MatSelectChange) {
    const selectedDealId = event.value;
    
    const selectedDeal = this.deals.find(deal => deal.name === selectedDealId);
  

    if (selectedDeal) {
      this.preAgreementForm.patchValue({
        deal: selectedDeal.name,
        deal_id: selectedDeal.id
      });
    }
  }
  showAllowCoreOnly: boolean = false;
  createPricingFormGroup(): FormGroup {
    return this.fb.group({});
  }
  formPatched: boolean = false;
 gotId: boolean = false;

  ngOnInit(): void {
    // First set up form change monitors
    // console.log('Form initialized:', this.promotionKeys);
    this.preAgreementForm.get('accountId')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => value.length === 19)
    ).subscribe(value => {
      if (this.preAgreementForm.get('accountId')?.valid) {
        this.validateAccountId()
      }
    });
    
    // Check for ID param and load existing data if available
    let id = this.activeRouter.snapshot.params['id'];
    if (id) {
      this.agreementId = id;
      this.formService.getAgreement(this.agreementId).subscribe(res => {

        this.gotId=true
        // First set the promotion type to ensure correct pricing controls
        if (res.data.sales_person_promotion_type) {
          this.preAgreementForm.get('sales_person_promotion_type')?.setValue(res.data.sales_person_promotion_type);
          this.selectedPromotion = res.data.sales_person_promotion_type;
          if(res.data.sales_person_promotion_type=='Event'){
            if(res.data.event_type && typeof res.data.event_type === 'object' && res.data.event_type.name) {
              // Extract the name and set it to the form control
              this.preAgreementForm.get('event_type')?.setValue(res.data.event_type.name);
         
            } else {
              // Handle case where event_type might be just the ID or another format
          
              // Set a default value or leave as is
              this.preAgreementForm.get('event_type')?.setValue(res.data.event_type);
            }
          }
          // Initialize promotion controls before patching pricing values
          this.onPromotionChange();
        }
        
        // Then patch the general form data
        this.preAgreementForm.patchValue({
          practiceIndustry: res.data.practiceIndustry,
          newOrExistingClient: res.data.newOrExistingClient,
          multipleLocations: res.data.multipleLocations,
          accountId: res.data.accountId,
          currency: res.data.currency,
          practice_ehr: res.data.practice_ehr,
          displayPricing: res.data.displayPricing || false,
          displayTechStackComparison: res.data.displayTechStackComparison || false,
          event_type: res.data.event_type,
          // promotionExpiryDate: res.data.promotionExpiryDate,
          promotionExpiryDate_display: res.data.promotionExpiryDate_display
        });
        if(res.data.promotionExpiryDate_display){
           const dateParts = res.data.promotionExpiryDate_display.split(' ');
          if (dateParts.length === 3) {
            const month = dateParts[0]; // "May"
            const day = parseInt(dateParts[1].replace(',', '')); // "31" (remove comma)
            const year = parseInt(dateParts[2]); // "2025"
             const monthIndex = new Date(`${month} 1, 2000`).getMonth();
            const dateObject = new Date(year, monthIndex, day);
                if (!isNaN(dateObject.getTime())) {
                  // Set both form controls
                  this.preAgreementForm.patchValue({
                    promotionExpiryDate: dateObject,
                    promotionExpiryDate_display: res.data.promotionExpiryDate_display
                  });
                 
                }
          }
        }
        // Handle deal data
        if (res.data.deal) {
          this.preAgreementForm.patchValue({
            deal: res.data.deal,
            deal_id: res.data.deal_id
          });
        }
        this.allowCore= res.data.allow_core || false;
        
        // Set industry type
        this.dental_or_optometry = res.data.practiceIndustry;
        
        // Initialize add-ons and bundle states with direct pricing data
        // this.initializeAddOnsAndBundleStates(res.data);
        
        // Set the form patched flag
        this.formPatched = true;
        
        // Handle tech stack comparison
        if (res.data.displayTechStackComparison) {
          this.sendForm = res.data.techStackData;
        }
        
        // Update pricing controls
        this.getPricingControls();

        if(res.data.add_on_phones ==null){
          this.phoneState = false;
          this.addOnStates['add_on_phones'] = true;
        }
        if(res.data.add_on_analytic==null){
          this.analyticsState = false;
          this.addOnStates['add_on_analytic'] = true;
        }
        if(res.data.add_on_verification ==null){
          this.verificationState = false;
          this.addOnStates['add_on_verification'] = true;
        }
      });
    } else {
      // For new forms, initialize with default promotion
      this.onPromotionChange();

      console.log('New form initialized');
      this.getPricingControls();
       this.gotId=false
    }
  }

  addVaildate(){
    if (this.preAgreementForm.get('displayPricing')?.value == true) {
      this.preAgreementForm.get('sales_person_promotion_type')?.setValidators([Validators.required]);
      this.preAgreementForm.get('sales_person_promotion_type')?.updateValueAndValidity();
      
    }
  }
  private checkBasicFieldsValidity(): boolean {
  const basicFields = [
    'practiceIndustry',
    'newOrExistingClient',
    'multipleLocations',
    'accountId',
    'currency',
    'practice_ehr'
  ];
  
  return basicFields.every(field => {
    const control = this.preAgreementForm.get(field);
    return control && control.valid;
  });
}
  onSubmit() {
    // Handle add-on states and tech stack as you already do
    if (this.phoneState == false) {
      const addOnVerificationControl = this.preAgreementForm.get('pricingDetails.add_on_phones');
        if(addOnVerificationControl){
          addOnVerificationControl.setValue(null)
        }
    }
    if(this.analyticsState==false){
      const addOnVerificationControl = this.preAgreementForm.get('pricingDetails.add_on_analytic');
        if(addOnVerificationControl){
          addOnVerificationControl.setValue(null)
        }
    }
    if(this.verificationState==false){
      const addOnVerificationControl = this.preAgreementForm.get('pricingDetails.add_on_verification');
        if(addOnVerificationControl){
          addOnVerificationControl.setValue(null)
        }
    }
    if(this.pozativeState==false){
      const addOnVerificationControl1 = this.preAgreementForm.get('pricingDetails.pozative_Only_Monthly');
      const addOnVerificationControl2 = this.preAgreementForm.get('pricingDetails.pozative_Only_Annually');

        if(addOnVerificationControl1 && addOnVerificationControl2){
          addOnVerificationControl1.setValue(null)
          addOnVerificationControl2.setValue(null)
        }
    }
    if(this.aditCoreState==false){
      const addOnVerificationControl1 = this.preAgreementForm.get('pricingDetails.aditCore_monthly');
      const addOnVerificationControl2 = this.preAgreementForm.get('pricingDetails.aditCore_annually');

        if(addOnVerificationControl1 && addOnVerificationControl2){
          addOnVerificationControl1.setValue(null)
          addOnVerificationControl2.setValue(null)
        }
    }
    if(this.verificationOnlyState==false){
      const addOnVerificationControl1 = this.preAgreementForm.get('pricingDetails.verifications_Only_Monthly');
      const addOnVerificationControl2 = this.preAgreementForm.get('pricingDetails.verifications_Only_Annually');

        if(addOnVerificationControl1 && addOnVerificationControl2){
          addOnVerificationControl1.setValue(null)
          addOnVerificationControl2.setValue(null)
        }
    }
    
    console.log('Pricing', this.preAgreementForm.value);
    
    // Set verifications = 0 if currency is CAD
    if (this.preAgreementForm.get('currency')?.value === 'CAD') {
      const verificationsControlAnnually = this.preAgreementForm.get('pricingDetails.verifications_Only_Annually');
      if (verificationsControlAnnually) {
        verificationsControlAnnually.setValue(0);
      }
       const verificationsControlMonthly = this.preAgreementForm.get('pricingDetails.verifications_Only_Monthly');
      if (verificationsControlMonthly) {
        verificationsControlMonthly.setValue(0);
      }
      const verificationsControl = this.preAgreementForm.get('pricingDetails.add_on_verification');
      if (verificationsControl) {
        verificationsControl.setValue(0);
      }
    }

    // Handle tech stack comparison
    if(this.preAgreementForm.get('displayTechStackComparison')?.value == true) {
      this.preAgreementForm.get('techStack')?.setValue(this.receivedForm.value);
    }

    // First check if displayPricing is true
    const displayPricing = this.preAgreementForm.get('displayPricing')?.value === true;
    
    // Only validate pricing details if displayPricing is true
    if (displayPricing) {
      const pricingDetails = this.preAgreementForm.get('pricingDetails')?.value;
      const pricingControls = this.getPricingControls();
      let hasNullValues = false;
      let nullFieldNames: string[] = [];
      
      // Check for null or undefined values
      for (const control of pricingControls) {
        // Skip add-ons that are intentionally disabled
        if (this.isAddOnControl(control) && !this.addOnStates[control]) {
          continue;
        }
        
        // Skip bundle controls that are intentionally disabled
        if (this.isNoVendorPackage(control)) {
          const bundlePrefix = control.split('_')[0];
          if (
            (bundlePrefix === 'pozative' && this.pozativeState === true) ||
            (bundlePrefix === 'verifications' && this.verificationOnlyState === true) ||
            (bundlePrefix === 'aditCore' && this.aditCoreState === true)
          ) {
            continue;
          }
        }
        
        // If value is null, undefined or empty string, mark as invalid
        if (pricingDetails[control] === null || pricingDetails[control] === undefined || pricingDetails[control] === '') {
           if (control === 'add_on_phones' || control === 'add_on_analytic' || control === 'add_on_verification') {
            // Don't mark these add-on controls as invalid, skip to next iteration
            continue;
          }
          hasNullValues = true;
          nullFieldNames.push(this.getLabel(control));
          
          // Mark the specific field as invalid
          const formControl = this.getFormControl(control);
          console.log(`Marking ${control} as invalid`,this.getFormControl(control));
          if (formControl) {
            formControl.setErrors({'required': true});
            formControl.markAsTouched();
          }
        }
      }
      
      // If null values found, show error and return
      if (hasNullValues) {
        this.toastr.error(`Please fill all required pricing fields: ${nullFieldNames.join(', ')}`);
        // Scroll to the first invalid control
        const invalidControl = document.querySelector('.ng-invalid');
        if (invalidControl) {
          invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    // Check form validity based on what's enabled
    // We need to check basic form fields, and conditionally check pricing/tech stack
    const basicFieldsValid = this.checkBasicFieldsValidity();
    const displayTechComparison = this.preAgreementForm.get('displayTechStackComparison')?.value === true;
    
    // Form is valid if basic fields are valid AND 
    // either displayPricing is false OR pricing details were validated above
    // AND if displayTechComparison is true, then techStack must be valid
    this.ensureAllPricingKeys()
    if (basicFieldsValid && 
        (displayPricing || displayTechComparison)) {
      
      // IMPORTANT: Store the multiple locations value BEFORE processing the form
      const multipleLocations = this.preAgreementForm.get('multipleLocations')?.value;
      
      // Prepare form data for submission
      const formData = new FormData();
      
      // Append non-file form fields except techStack
      Object.keys(this.preAgreementForm.value).forEach(key => {
        if (key === 'techStack') return; // Skip techStack for now
        const value = this.preAgreementForm.value[key];
        if (typeof value === 'object' && value !== null && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
    
      // Conditionally append techStack
      if (this.preAgreementForm.get('displayTechStackComparison')?.value === true) {
        formData.append('techStack', JSON.stringify(this.preAgreementForm.get('techStack')?.value));
      } else {
        formData.append('techStack', JSON.stringify([])); // Send blank array if false
      }
    
      // Append file separately if selected
      if (this.selectedFile) {
        formData.append('fileUpload', this.selectedFile, this.selectedFile.name); // Include file name
      }
      formData.append('medium','Online')
      formData.append('allowCore',JSON.stringify(this.allowCore));
      // Log the FormData for debugging
      // console.log("Data that is submitted:", formData);
    
      // Submit the form data to the API
      if(this.agreementId) {
        this.formService.updateForm(formData, this.agreementId).subscribe({
          next: (response) => {
            this.isAccountIdLoading=true
            // console.log('Form updated successfully:', response);
            this.toastr.success('Form submitted successfully!');
            
            // Navigate based on the stored multipleLocations value
            if (multipleLocations === 'yes') {
              this.router.navigate(['/view-agreements/' + response.data.agreementId]);
            } else {
              this.router.navigate(['/view-agreement/' + response.data.agreementId]);
            }
            
            // Reset the form AFTER navigation decision
            this.preAgreementForm.reset();
            this.selectedFile = null;
            this.isAccountIdLoading=false
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
          }
        });
      } else {
        this.formService.saveForm(formData).subscribe({
          next: (response) => {
            // console.log('Form submitted successfully:', response);
            this.toastr.success('Form submitted successfully!');
            this.isAccountIdLoading=true
            // Navigate based on the stored multipleLocations value
            if (multipleLocations === 'yes') {
              this.router.navigate(['/view-agreements/' + response.data.agreementId]);
            } else {
              this.router.navigate(['/view-agreement/' + response.data.agreementId]);
            }
            
            // Reset the form AFTER navigation decision
            this.preAgreementForm.reset();
            this.selectedFile = null;
            this.isAccountIdLoading=false
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
          }
        });
      }
    } else {
      // Show appropriate error message
      let errorMessage = 'Please fill all required fields.';
      
      if (!basicFieldsValid) {
        errorMessage = 'Please fill all required basic information fields.';
      } else if (displayPricing && !this.preAgreementForm.get('pricingDetails')?.valid) {
        errorMessage = 'Please fill all required pricing fields.';
      } else if (displayTechComparison && !this.preAgreementForm.get('techStack')?.valid) {
        errorMessage = 'Please complete the Tech Stack Comparison.';
      }
      
      this.toastr.error(errorMessage);
      
      // Focus the first invalid field
      const invalidControl = document.querySelector('.ng-invalid');
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  
// Helper method to ensure all possible pricing keys are included
private ensureAllPricingKeys() {
  if (!this.preAgreementForm.get('displayPricing')?.value) {
    return; // Skip this if pricing isn't being displayed/used
  }

  // Get the current pricing details form group
  const pricingDetails = this.preAgreementForm.get('pricingDetails') as FormGroup;
  if (!pricingDetails) return;
  
  // Get the selected promotion type
  const selectedPromo = this.preAgreementForm.get('sales_person_promotion_type')?.value;
  if (!selectedPromo) return;
  
  // Create a set of all possible pricing keys from all promotion types
  const allPossibleKeys = new Set<string>();
  
  // Iterate through all promotion types to collect all possible keys
  Object.values(this.promotionPricing).forEach((pricing:any) => {
    Object.keys(pricing).forEach(key => {
      // Skip min/max metadata keys
      if (!key.endsWith('_Min') && !key.endsWith('_Max')) {
        allPossibleKeys.add(key);
      }
    });
  });
  
  // Log for debugging
  console.log('All possible pricing keys:', allPossibleKeys);
  
  // Ensure each key exists in the form group
  allPossibleKeys.forEach(key => {
    if (!pricingDetails.get(key)) {
      // Add control with null value if it doesn't exist
      pricingDetails.addControl(key, new FormControl(null));
    }
  });
  
  // Log the final pricing details for debugging
  console.log('Final pricing details before submission:', pricingDetails.value);
}
  promotionPricing: any = promotionPricing;
  get promotionKeys() {
    // console.log('this.promotionPricing', Object.keys(this.promotionPricing));
    return Object.keys(this.promotionPricing);
  }

  loading: boolean = false;
  selectedPromotion: string | null = null;
  eventOptions: any[] = [];
  
  
  onPromotionChange() {
    const selectedPromo = this.preAgreementForm.get(
      'sales_person_promotion_type'
    )?.value;
    const pricingDetails = this.preAgreementForm.get(
      'pricingDetails'
    ) as FormGroup;
    this.selectedPromotion = selectedPromo; // Capture selected promotion type
    
    // Store existing values to restore after changing promotion
    const existingValues = this.formPatched ? { ...pricingDetails.value } : null;
    
    if(this.selectedPromotion === 'Event'){
      this.eventService.getUsers().subscribe(res=>{
       this.eventOptions = res.data
      })
    }
    if(this.selectedPromotion=='Inbound Core'){
      this.showAllowCoreOnly=true;
    }else{
      this.showAllowCoreOnly=false;
    }
    if (!this.promotionPricing[selectedPromo]) {
      return;
    }

    this.loading = true; // Show loader

    // Remove existing controls
    Object.keys(pricingDetails.controls).forEach((control) => {
      pricingDetails.removeControl(control);
    });

    this.preAgreementForm.updateValueAndValidity();

    setTimeout(() => {
      const newPricing = this.promotionPricing[selectedPromo];
      const pricingDetails = this.preAgreementForm.get(
        'pricingDetails'
      ) as FormGroup;

      // First, remove existing pricing controls
      Object.keys(pricingDetails.controls).forEach((control) => {
        pricingDetails.removeControl(control);
      });

      // Loop through new pricing object and add controls
      Object.keys(newPricing).forEach((control) => {
        if (!control.endsWith('_Min') && !control.endsWith('_Max')) {
          const minValue = newPricing[`${control}_Min`] ?? null;
          const maxValue = newPricing[`${control}_Max`] ?? null;
          const isEditable = minValue !== null && maxValue !== null;
          
          // Use existing value if available and patching form
          const initialValue = existingValues && existingValues[control] !== undefined ? 
                              existingValues[control] : newPricing[control];
                  // console.log('Adding activation_fee control with value:', initialValue);

          pricingDetails.addControl(
            control,
            new FormControl(
              initialValue,
              isEditable
                ? [
                    Validators.min(minValue),
                    Validators.max(maxValue),
                  ]
                : []
            )
          );
        }
      });
      const currency = this.preAgreementForm.get('currency')?.value || 'USD';
      this.updatePricingForCurrency(currency);

      // Ensure `activation_fee` is always added
      // if (!pricingDetails.get('activation_fee')) {
      //   const activationFeeValue = existingValues && existingValues['activation_fee'] !== undefined ?
      //                           existingValues['activation_fee'] : (newPricing.activation_fee ?? 0);
        
      //   pricingDetails.addControl(
      //     'activation_fee',
      //     new FormControl(activationFeeValue)
      //   );
      //   pricingDetails.get('activation_fee')?.setValue(0);
      //   // console.log('Adding activation_fee control with value:', activationFeeValue, pricingDetails.get('activation_fee')?.value);
      // }
        // console.log('Adding activation_fee control with value:',  pricingDetails.get('activation_fee')?.value);
      // Update form validity to trigger change detection
      this.preAgreementForm.updateValueAndValidity();
      this.loading = false;
      
      // If we're patching the form, ensure we update the add-on and bundle states
      if (this.formPatched && existingValues) {
        this.updateStatesFromPatchedValues(existingValues);
      }
    }, 100);
   

  }

  // Add a new helper method for updating states from patched values
  updateStatesFromPatchedValues(values: any) {
    // Handle add-ons
    if (values.add_on_phones !== null && values.add_on_phones !== undefined) {
      this.phoneState = false;
      this.addOnStates['add_on_phones'] = true;
    }
    
    if (values.add_on_analytic !== null && values.add_on_analytic !== undefined) {
      this.analyticsState = false;
      this.addOnStates['add_on_analytic'] = true;
    }
    
    if (values.add_on_verification !== null && values.add_on_verification !== undefined) {
      this.verificationState = false;
      this.addOnStates['add_on_verification'] = true;
    }
    
    // Handle bundles
    if (values.pozative_Only_Monthly !== null && values.pozative_Only_Monthly !== undefined ||
        values.pozative_Only_Annually !== null && values.pozative_Only_Annually !== undefined) {
      this.pozativeState = false;
      this.bundleStates['pozative_Only_Monthly'] = true;
      this.bundleStates['pozative_Only_Annually'] = true;
    }
    
    if (values.verifications_Only_Monthly !== null && values.verifications_Only_Monthly !== undefined ||
        values.verifications_Only_Annually !== null && values.verifications_Only_Annually !== undefined) {
      this.verificationOnlyState = false;
      this.bundleStates['verifications_Only_Monthly'] = true;
      this.bundleStates['verifications_Only_Annually'] = true;
    }
    
    if (values.aditCore_monthly !== null && values.aditCore_monthly !== undefined ||
        values.aditCore_annually !== null && values.aditCore_annually !== undefined) {
      this.aditCoreState = false;
      this.bundleStates['aditCore_monthly'] = true;
      this.bundleStates['aditCore_annually'] = true;
    }
  }

  getMinValue(control: string): number | null {
    return (
      this.promotionPricing[
        this.preAgreementForm.get('sales_person_promotion_type')?.value
      ]?.[`${control}_Min`] || null
    );
  }

  getMaxValue(control: string): number | null {
    return (
      this.promotionPricing[
        this.preAgreementForm.get('sales_person_promotion_type')?.value
      ]?.[`${control}_Max`] || null
    );
  }

  isFieldDisabled(control: string): boolean {
    return (
      this.getMinValue(control) === null || this.getMaxValue(control) === null
    );
  }
  getFormControl(control: string) {
    return this.preAgreementForm.get('pricingDetails')?.get(control);
  }
  getPricingControls(): string[] {
    // Ensure pricing is updated for the current currency before getting controls
  
    const selectedPromotion = this.preAgreementForm.get('sales_person_promotion_type')?.value;
    const pricingDetails = this.preAgreementForm.get('pricingDetails')?.value || {};
    
    // Get all controls from pricingDetails
    const allControls = Object.keys(pricingDetails).filter(key => !key.toLowerCase().includes('hardware'));
    
    // If no promotion is selected, return empty array
    if (!selectedPromotion) {
      return [];
    }

    // Get the pricing structure for the selected promotion
    const promotionPricing = this.promotionPricing[selectedPromotion];
    if (!promotionPricing) {
      return [];
    }

    // Filter controls based on the selected promotion's pricing structure
    return allControls.filter(control => {
      // Check if the control exists in the promotion's pricing structure
      return control in promotionPricing;
    });
  }

  bundleStates: { [key: string]: boolean } = {};

  isNoVendorPackage(control: string): boolean {
    return (
      control.startsWith('pozative') ||
      control.startsWith('verifications') ||
      control.startsWith('aditCore')
    );
  }
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

  getLabel(control: string): string {
    if (control.includes('techMonthly_Disc')) {
      return 'Tech Bundle Monthly Discount';
    } else if (control.includes('techMonthly')) {
      return 'Tech Bundle Monthly';
    } else if (control.includes('techAnnual_Disc')) {
      return 'Tech Bundle Annual Discount';
    } else if (control.includes('techAnnual')) {
      return 'Tech Bundle Annual';
    } else if (control.includes('analyticMonthly_Disc')) {
      return 'Analytic Bundle Monthly Discount';
    } else if (control.includes('analyticMonthly')) {
      return 'Analytic Bundle Monthly';
    } else if (control.includes('analyticAnnual_Disc')) {
      return 'Analytic Bundle Annual Discount';
    } else if (control.includes('analyticAnnual')) {
      return 'Analytic Bundle Annual';
    } else if (control.includes('aditLiteMontly_Disc')) {
      return 'Adit Lite Monthly Discount';
    } else if (control.includes('aditLiteMontly')) {
      return 'Adit Lite Monthly';
    } else if (control.includes('aditLiteAnnual_Disc')) {
      return 'Adit Lite Annual Discount';
    } else if (control.includes('aditLiteAnnual')) {
      return 'Adit Lite Annual';
    } else if (control.includes('aditCore_monthly')) {
      return ' Monthly';
    } else if (control.includes('aditCore_annually')) {
      return ' Annually';
    } else if (control.includes('add_on_phones')) {
      return 'Phones';
    } else if (control.includes('add_on_analytic')) {
      return 'Analytics';
    } else if (control.includes('add_on_verification')) {
      return 'Verifications';
    } else if (control.includes('pozative_Only_Monthly')) {
      return ' Monthly';
    } else if (control.includes('pozative_Only_Annually')) {
      return ' Annually';
    } else if (control.includes('verifications_Only_Monthly')) {
      return ' Monthly';
    } else if (control.includes('verifications_Only_Annually')) {
      return 'Annually';
    }else if(control.includes('no_of_days')){
      return 'No of days';
    } else {
      return 'Activation Fee'; // Default label if none match
    }
  }
  
  getBundleTitle(control: string): string {
    const lowerControl = control.toLowerCase();
  
    if (lowerControl.includes('tech')) {
      return 'Tech Bundle';
    } else if (lowerControl.includes('analyticm') ||lowerControl.includes('analytica')) {
      return 'Analytic Bundle';
    } else if (lowerControl.includes('aditlite')) {
      return 'Adit Lite Bundle';
    } else if (lowerControl.includes('aditcore')) {
      return 'Adit Core';
    } else if (lowerControl.includes('pozative')) {
      return 'Pozative Only';
    } else if (lowerControl.includes('verifications')) {
      return 'Verification Only';
    } else if (lowerControl.includes('add')) {
      return 'Add-Ons';
    } else if(lowerControl.includes('no_of_days')){
      return 'No of days';
    }else{
      return 'Activation Fee'; // Default title if none match
    }
  }
  
  getBundleClass(control: string): string {
    if (control.toLowerCase().includes('tech')) {
      return 'techBundle';
    } else if (control.toLowerCase().includes('analyticm') || control.toLowerCase().includes('analytica')) {
      return 'analyticBundle';
    } else if (control.toLowerCase().includes('aditlite')) {
      return 'aditLiteBundle';
    }  else if (control.toLowerCase().includes('aditcore')) {
      return 'aditCoreBundle';
    }  else if (control.toLowerCase().includes('pozative')) {
      return 'pozativeBundle';
    } else if (control.toLowerCase().includes('verifications')) {
      return 'verficationBundle';
    } else if (control.toLowerCase().includes('add')) {
      return 'addonBundle';
    }else if(control.includes('no_of_days')){
      return 'No of days';
    } else {
      return 'Activation Fee'; // Default title if none match
    }
  }
  addOnStates: { [key: string]: boolean } = {};
  phoneState:boolean=true
  analyticsState:boolean= true
  verificationState:boolean=true
  isAddOnControl(control: string): boolean {
    return control.startsWith('add_on');
  }

  // Check if the add_on control is enabled
  isAddOnEnabled(control: string): boolean {
    // console.log('isAddOnEnabled', control, this.addOnStates[control]);/
    return this.addOnStates[control];
  }

  // Toggle the add_on control state
  toggleAddOn(control: string) {
    this.addOnStates[control] = !this.addOnStates[control];
  //  this.isAddOnEnabled(control)
    const formControl = this.getFormControl(control);

    // Enable/disable the form control based on the checkbox state
    if(formControl){
      // debugger
      if (this.addOnStates[control]) {
        if(control=='add_on_phones'){
          this.phoneState=false
        }else   if(control=='add_on_verification'){
          this.verificationState=false
        }else if(control=='add_on_analytic'){
          this.analyticsState=false
        }

      } else{
        if(control=='add_on_phones'){
          this.phoneState=true
          const addOnVerificationControl = this.preAgreementForm.get('pricingDetails.add_on_phones');
          if(addOnVerificationControl){
            addOnVerificationControl.setValue(100)
          }
        }else if(control=='add_on_verification'){
          this.verificationState=true
          const addOnVerificationControl = this.preAgreementForm.get('pricingDetails.add_on_verification');
          if(addOnVerificationControl){
            addOnVerificationControl.setValue(100)
  
          }
        }else if(control=='add_on_analytic'){
          this.analyticsState=true
          const addOnVerificationControl = this.preAgreementForm.get('pricingDetails.add_on_analytic');
          if(addOnVerificationControl){
            addOnVerificationControl.setValue(100)
  
          }
        }
      }
      // else {
        // formControl.disable();
        // formControl.reset(); // Optional: Reset the value when disabled
        // debugger
      // }
    }
    
  }

  shouldShowTitle(control: string, index: number): boolean {
    if (index === 0) {
      return true; // Always show title for the first item
    }

    const prevControl = this.getPricingControls()[index - 1];

    return this.getBundleClass(control) !== this.getBundleClass(prevControl);
  }
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.preAgreementForm.patchValue({ fileUpload: file });
      console.log('Selected file:', file.name);
    }
  }
  
  downloadSampleFile(): void {
    this.formService.downloadSampleFile().subscribe({
        next: (file: Blob) => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(file);
            a.href = objectUrl;
            a.download = 'Muliple-Location-Data-Sample.csv';
            a.click();
            URL.revokeObjectURL(objectUrl); // Clean up
        },
        error: (error) => {
            console.error('Error downloading file:', error);
        },
        complete: () => {
            console.log('File download completed.');
        }
    });
}
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

// Add or update this method in your component
updatePricingForCurrency(currency: string) {
  const selectedPromo = this.preAgreementForm.get('sales_person_promotion_type')?.value;
  if (!selectedPromo) return;

  const basePricing = this.promotionPricing[selectedPromo];
  if (!basePricing){
    return;
  } 

  const pricingDetails = this.preAgreementForm.get('pricingDetails') as FormGroup;
   if (!pricingDetails.get('activation_fee')) {
        
        pricingDetails.addControl(
          'activation_fee',
          new FormControl()
        );
        pricingDetails.get('activation_fee')?.setValue(0);
        // console.log('Adding activation_fee control with value:', activationFeeValue, pricingDetails.get('activation_fee')?.value);
      }
  Object.keys(pricingDetails.controls).forEach((key) => {
    const value = basePricing[key];

    // console.log('Key:', key, 'Value:', value);
    if (value && typeof value === 'object' ) {
      pricingDetails.get(key)?.setValue(value[currency], { emitEvent: false });
      // console.log(`Updated ${key} for ${currency}:`, value[currency]);
    }
  });
}
allowCore: boolean = false;
  toggleAllowCore() {
    this.allowCore = !this.allowCore;
  }
}
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
import { MatSelectModule } from '@angular/material/select';
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
    ToastrModule
  ],
  templateUrl: './pre-agreement-form.component.html',
  styleUrl: './pre-agreement-form.component.scss',
  providers: provideNativeDateAdapter(),
})
export class PreAgreementFormComponent implements OnInit {
  preAgreementForm: FormGroup;
  dental_or_optometry = '';
  formService=inject(OnlineFormAgreementService);
  receivedForm!: FormGroup;
  sendForm:any;

  private eventService = inject(EventRepsService)
  private activeRouter =inject(ActivatedRoute)
  agreementId:any;
  constructor(private fb: FormBuilder, private router:Router,private toastr:ToastrService) {
    this.preAgreementForm = this.fb.group({
      practiceIndustry: ['', Validators.required],
      newOrExistingClient: ['', Validators.required],
      multipleLocations: ['', Validators.required],
      accountId: ['', [Validators.required, Validators.pattern(/^\d{19}$/)]],
      currency: ['', Validators.required],
      pms: ['', Validators.required],
      displayPricing: [false],
      displayTechStackComparison: [false],
      sales_person_promotion_type: [''],
      promotionExpiryDate:[],
      event_type: [''],
      pricingDetails: this.createPricingFormGroup(), // Nested FormGroup
      techStack:[[]]
    });
  }

  onFormChanged(form: FormGroup) {
    this.receivedForm = form;
    // console.log('Received Form:', this.receivedForm.value);
  }

 
  createPricingFormGroup(): FormGroup {
    return this.fb.group({});
  }

  ngOnInit(): void {
    this.onPromotionChange()
    this.getPricingControls()
    let id =  this.activeRouter.snapshot.params['id']
    if(id){
      this.agreementId=id
      this.formService.getAgreement(this.agreementId).subscribe(res=>{
        this.preAgreementForm.patchValue(res);
        this.onPromotionChange()
        this.getPricingControls()
        this.sendForm=res.techStack
        console.log(this.sendForm)
      })
    }
    // this.onPromotionChange();
    this.preAgreementForm.get('accountId')?.valueChanges.pipe(
        debounceTime(300), // Wait for 300ms after the user stops typing
        distinctUntilChanged(), // Only emit if the value has changed
        filter(value => value.length === 19) // Only proceed if the input is exactly 19 digits
      )
      .subscribe(value => {
        if (this.preAgreementForm.get('accountId')?.valid) {
          this.fetchDeals(value);
        }
      });
  }
  onSubmit() {
    // Set the techStack value from receivedForm
    
    if(this.phoneState==false){
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
    
    console.log('Priceing',this.preAgreementForm.get('pricingDetails')?.value)
    // Check if the form is valid
    this.preAgreementForm.get('techStack')?.setValue(this.receivedForm.value);
    if (this.preAgreementForm.valid) {
      const formData = new FormData();
  
      // Append non-file form fields
      Object.keys(this.preAgreementForm.value).forEach(key => {
        const value = this.preAgreementForm.value[key];
  
        // Handle nested objects (e.g., pricingDetails)
        if (typeof value === 'object' && value !== null && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value)); // Convert object to JSON string
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
  
      // Append file separately if selected
      if (this.selectedFile) {
        formData.append('fileUpload', this.selectedFile, this.selectedFile.name); // Include file name
      }
  
      // Log the FormData for debugging
      console.log("Data that is submitted:", formData);
  
      // Submit the form data to the API
      if(this.agreementId){
        this.formService.updateForm(formData,this.agreementId).subscribe({
          next: (response) => {
            console.log('Form updated successfully:', response);
            this.router.navigate(['/view-agreement'])
            this.toastr.success('Form submitted successfully!');
            this.preAgreementForm.reset(); // Reset the form
            this.selectedFile = null; // Clear the selected file
            this.router.navigate(['/view-agreement/'+response.agreementId])
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
          }
        });
      }else{
        this.formService.saveForm(formData).subscribe({
          next: (response) => {
            console.log('Form submitted successfully:', response);
            this.router.navigate(['/view-agreement'])
            this.toastr.success('Form submitted successfully!');
            this.preAgreementForm.reset(); // Reset the form
            this.selectedFile = null; // Clear the selected file
            this.router.navigate(['/view-agreement/'+response.agreementId])
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
          }
        });
      }
    } else {
      // If the form is invalid, show an alert
      alert('Please fill all required fields.');
    }
  }
  
  promotionPricing: any = promotionPricing;
  get promotionKeys() {
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
    if(this.selectedPromotion === 'Event'){
      this.eventService.getUsers().subscribe(res=>{
       this.eventOptions = res
      })
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

          pricingDetails.addControl(
            control,
            new FormControl(
              newPricing[control],
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

      // Ensure `activation_fee` is always added
      if (!pricingDetails.get('activation_fee')) {
        pricingDetails.addControl(
          'activation_fee',
          new FormControl(newPricing.activation_fee ?? 0)
        );
      }

      // Update form validity to trigger change detection
      this.preAgreementForm.updateValueAndValidity();
      this.loading = false;
    }, 100);
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
    return Object.keys(
      this.preAgreementForm.get('pricingDetails')?.value || {}
    ).filter((key) => !key.toLowerCase().includes('hardware'));
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
    } else {
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
    return this.addOnStates[control];
  }

  // Toggle the add_on control state
  toggleAddOn(control: string) {
    this.addOnStates[control] = !this.addOnStates[control];
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
        // debugger
        // formControl.enable();d
        // debugger
      } else{
        if(control=='add_on_phones'){
          this.phoneState=true
          const addOnVerificationControl = this.preAgreementForm.get('pricingDetails.add_on_phones');
          if(addOnVerificationControl){
            addOnVerificationControl.setValue(100)
  
          }
        }else   if(control=='add_on_verification'){
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
fetchDeals(accountId: string): void {
  this.formService.fetchDeal(accountId).subscribe({
   next: (response: any) => {
      if (response.deals && response.deals.length > 0) {
        this.deals = response.deals;
       this.successMsg='Account Validated'
      } else {
        this.deals = [];
        this.errorMessage = 'No deals found for the given account ID';
      }
    },
    error: (error) => {
      this.deals = [];
      this.errorMessage = 'No deals found for the given account ID';
    }
});
}
}

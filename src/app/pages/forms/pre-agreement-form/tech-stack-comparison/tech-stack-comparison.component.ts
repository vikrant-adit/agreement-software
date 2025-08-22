import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ChangeDetectorRef } from '@angular/core';

import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { arrFeatures, verificationArrFeatures } from './arrFeatures';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SelectProviderComponent } from './select-provider/select-provider.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OnlineFormAgreementService } from '../../../../../services/online form/online-form-agreement.service';
import { verifications,communicationsList,mobile,operations,analytics } from './tech-stack-gaps';

type Pricing = { [key: string]: string };
@Component({
  selector: 'app-tech-stack-comparison',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './tech-stack-comparison.component.html',
  styleUrl: './tech-stack-comparison.component.scss',
})
export class TechStackComparisonComponent implements OnInit {
  techStackForm!: FormGroup;
  @Output() formChanged = new EventEmitter<FormGroup>();
 @Input() getForm:any
  dialog = inject(MatDialog);
  onlineFormService = inject(OnlineFormAgreementService);
  expand:boolean=true

  communicationsList=communicationsList
  operations=operations.map(op => ({ ...op, show: true }));

  analytics=analytics
  mobile=mobile
  verifications=verifications

  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef) {
  
    this.techStackForm = this.fb.group({
      current_phone_provider: [],
      patient_texting: [],
      reminder_recall: [],
      digital_forms: [],
      treatment_presentation_payment_plans: [],
      current_payment_provider: [],
      review: [],
      online_scheduling: [],
      mass_texting: [],
      mass_emailing: [],
      analytics_morning_huddle: [],
      verification_provider: [],
      current_phone_provider_price: [],
      patient_texting_price: [],
      reminder_recall_price: [],
      digital_forms_price: [],
      treatment_presentation_payment_plans_price: [],
      current_payment_provider_price: [],
      review_price: [],
      online_scheduling_price: [],
      mass_texting_price: [],
      mass_emailing_price: [],
      analytics_morning_huddle_price: [],
      verification_provider_price: [],
      tech_stack_total_prices: [],
      features:[[]]
    });
    this.techStackForm.valueChanges.subscribe(() => {
      
      // this.calculateTotal();
        this.totalCost = Object.keys(this.techStackForm.controls)
      .filter((key) => key.endsWith('_price'))
      .map((key) => Number(this.techStackForm.controls[key].value) || 0)
      .reduce((acc, val) => acc + val, 0);
      // this.techStackForm.get('features')?.setValue(this.featuresArray, { emitEvent: false });
      this.techStackForm.get('tech_stack_total_prices')?.setValue(this.totalCost, { emitEvent: false });
      
      this.formChanged.emit(this.techStackForm);
    });
  }
  ngOnInit(): void {
    console.log(this.getForm);
    if(this.getForm){
      this.techStackForm.patchValue(this.getForm)
      
      const keysWithValues = Object.keys(this.getForm).filter((key:any) => this.getForm[key] !== null);
      console.log(keysWithValues); // Print keys with non-null values
      keysWithValues.forEach((key:any)=>{
        if(key!=='features' && !key.includes('price')){
          this.storeTheArray.push(this.getForm[key])
          this.manageGapsWhileUpdating()
        }
      })
     

    }
  }
  manageGapsWhileUpdating() {
    let falseTexts:any[]=[]
    this.storeTheArray.forEach((data) => {
      const featuresToUncheck = arrFeatures[data] || [];
      const updateArray = (arr: { text: string; value: boolean }[]) => {
        // Corrected type here
        arr.forEach((item) => {
          if (featuresToUncheck.includes(item.text)) {
            item.value = false; 
            falseTexts.push(item.text)
          }
        });
      };
      updateArray(this.communicationsList);
      updateArray(this.operations);
      updateArray(this.analytics);
      updateArray(this.mobile);
    });
    this.techStackForm.get('features')?.setValue(falseTexts)
  }

  pricing: Pricing = {
    Birdeye: '250',
    CareCru: '500',
    'Dear Doc': '300',
    'Demand Force': '500',
    'Dental Symphony': '300',
    'Dentrix Hub': '300',
    Doctible: '300',
    'Enlive Forms': '300',
    'Flex Dental': '400',
    Kasper: '700',
    Legwork: '500',
    'Lighthouse 360': '350',
    'M-Consent': '500',
    'DI/Modento/LocalMed': '500',
    Nexhealth: '700',
    'Opera DDS': '300',
    'Patient Activator': '300',
    'Dentrix Patient Engage': '300',
    'Patient Viewer': '200',
    'Patient Xpress': '500',
    'Peer Logic': '400',
    Podium: '300',
    'Practice By Numbers': '700',
    'Practice Mojo': '500',
    RecallMax: '400',
    'Revenue Well': '500',
    Simplifeye: '300',
    'Solution Reach': '500',
    Swell: '200',
    Vyne: '700',
    Weave: '600',
    YAPI: '400',
    ZocDoc: '500',
    'AT&T': '200',
    Bell: '200',
    Comcast: '200',
    xFinity: '200',
    'GoTo Connect': '200',
    Intiveo: '200',
    Mango: '150',
    Aloha: '200',
    Nextiva: '200',
    Ooma: '200',
    Optimum: '200',
    RingCentral: '200',
    Shaw: '200',
    Spectrum: '200',
    Verizon: '200',
    '8x8': '200',
    'No Texting System': '0',
    OTHER: '',
    Jarvis: '500',
    'EHR/PMS': '',
    'Vyne Verification': '200',
    Zuub: '450',
    AirPay: '400',
    'E-Assist': '3000',
    'Weave Verification': '400',
    'Practice By Numbers Verification': '250',
    'Solution Reach Verification': '400',
    'NexHealth Verification': '400',
    'Dental Intel': '400',
    'Revenue Well Verification': '400',
    'No Vendor': '0',
    'Cooper Vision': '500',
    '4PatientCare': '500',
    'ABB Analyze': '500',
    'Edge Pro': '500',
  };

  verification_providers: Pricing = {
    Vyne: '200',
    Zuub: '450',
    AirPay: '400',
    'E-Assist': '3000',
    Weave: '400',
    'Practice By Numbers': '250',
    'Solution Reach': '400',
    NexHealth: '400',
    'Dental Intel': '400',
    'Revenue Well': '400',
    'No Vendor': '0',
  };
 
  totalCost: number = 0;
  array: { text: string; value: boolean }[][] = [];

  selectedValues: { [key: number]: string } = {}; // Store selected values for each dropdown
  resetValue: any;


  reset(){
    this.techStackForm.enable();
    this.techStackForm.reset();
    this.techStackForm.reset();
    this.storeTheArray=[]
    const updateArray = (arr: { text: string; value: boolean }[]) => {
      // Corrected type here
      arr.forEach((item) => {
          item.value = true;
      });
    };
    updateArray(this.communicationsList);
    updateArray(this.operations);
    updateArray(this.analytics);
    updateArray(this.mobile);
    this.featuresArray=[]
  }


  manageGapsInVerification(result: string) {
    this.verifications.forEach((res) => {
      res.value = true;
    });
    if (verificationArrFeatures[result]) {
      verificationArrFeatures[result].forEach((feature) => {
        this.verifications.forEach((item) => {
          if (item.text === feature) {
            item.value = false;
          }
        });
      });
    }
  }
  storeTheArray: any[] = [];
  featuresArray:any[]=[]
  manageGaps() {
    let falseTexts:any[]=[]
    this.storeTheArray.forEach((data) => {
      const featuresToUncheck = arrFeatures[data] || [];
      console.log(data)
      const updateArray = (arr: { text: string; value: boolean }[]) => {
        // Corrected type here
        arr.forEach((item) => {
          if (featuresToUncheck.includes(item.text)) {
            item.value = false; 
            falseTexts.push(item.text)
          } else if (!item.value) {
            item.value = true;
          }
        });
      };
      updateArray(this.communicationsList);
      updateArray(this.operations);
      updateArray(this.analytics);
      updateArray(this.mobile);
    });
  
    // Log or use the falseTexts array as needed
    console.log(falseTexts);
    this.techStackForm.get('features')?.setValue(falseTexts);
    // this.featuresArray=falseTexts
  }


  copyValue(sourceControlName: string, targetControlName: string): void {
    const sourceValue = this.techStackForm.get(sourceControlName)?.value;
    if (sourceValue !== null && sourceValue !== undefined) {
      this.techStackForm.get(targetControlName)?.setValue(sourceValue);
        const priceControl = this.techStackForm.get(targetControlName + '_price');
        if (priceControl) {
          priceControl.disable(); // Disable the input field
          this.cdr.detectChanges(); // Trigger change detection

        } else {
          console.log(`FormControl ${targetControlName + '_price'} does not exist.`);
        }
    } else {
       console.log(sourceValue,'getting aaaaa')
      console.log(`No value found in ${sourceControlName} to copy.`);
    }
   

  }
  

  setThePriceOfTechStack(result:string,formControlName:string,label:string){
    if (result) {  
      this.techStackForm.get(formControlName)?.setValue(result);
      if (label == 'Verification Provider') {
        let price = this.verification_providers[result];
        this.techStackForm.get(formControlName + '_price')?.setValue(price);
        this.manageGapsInVerification(result);
      } else {
        let price = this.pricing[result];
        this.techStackForm.get(formControlName + '_price')?.setValue(price);
        this.storeTheArray.push(result); 
        this.manageGaps();
      }
    }
  }

  //open the dialog and get value and price
  openSelectProvider(label: string, formControlName: string) {
    const dialogRef = this.dialog.open(SelectProviderComponent, {
      minWidth: '70vw',
      maxHeight: '70vh',
      data: label
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {  
        if(result == 'reset') {
          // Store the old price before resetting
          // const oldPrice = Number(this.techStackForm.get(formControlName + '_price')?.value) || 0;
          
          this.techStackForm.get(formControlName)?.reset();
          this.techStackForm.get(formControlName + '_price')?.reset();
          
          // Remove the previous value for this control from storeTheArray
          const currentValue = this.techStackForm.get(formControlName)?.value;
          if (currentValue) {
            const index = this.storeTheArray.indexOf(currentValue);
            if (index > -1) {
              this.storeTheArray.splice(index, 1);
            }
          }
          
          this.manageGaps();
          // this.calculateTotal();
          return;
        }
        
        // Get the current value to check if we're updating
        const currentValue = this.techStackForm.get(formControlName)?.value;
        
        // If there was a previous value, remove it from storeTheArray
        if (currentValue && currentValue !== result) {
          const index = this.storeTheArray.indexOf(currentValue);
          if (index > -1) {
            this.storeTheArray.splice(index, 1);
          }
        }
        
        this.techStackForm.get(formControlName)?.setValue(result);
        
        if (label == 'Verification Provider') {
          let price = this.verification_providers[result];
          this.techStackForm.get(formControlName + '_price')?.setValue(price);
          this.manageGapsInVerification(result);
        } else {
          let price = this.pricing[result];
          this.techStackForm.get(formControlName + '_price')?.setValue(price);
          
          // Only add to storeTheArray if it's not already there
          if (!this.storeTheArray.includes(result)) {
            this.storeTheArray.push(result);
          }
          
          this.manageGaps();
        }
        
        // Force recalculation to ensure correct total
        // this.calculateTotalDirectly();
      }
    });
  }

  providerImages: { [key: string]: string } = {
    '8x8': '/assets/images/8-8-logo.png',
    'RingCentral': '/assets/images/ring-central-logo.png',
    'Weave': '/assets/images/weave-logo.png',
    'AT&T': '/assets/images/at-and-t-logo.png',
    'Bell': '/assets/images/bell-logo.png',
    'Comcast': '/assets/images/comcast-logo.png',
    'xFinity': '', // No image path provided
    'GoTo Connect': '/assets/images/goto-connect-logo.png',
    'Intiveo': '/assets/images/intiveo-logo.png',
    'Mango': '/assets/images/mango-logo.png',
    'Nextiva': '/assets/images/nextiva-logo.png',
    'Ooma': '/assets/images/ooma-logo.png',
    'Optimum': '/assets/images/optimum-logo.png',
    'Shaw': '/assets/images/shaw-logo.png',
    'Spectrum': '/assets/images/spectrum-logo.png',
    'Verizon': '/assets/images/verizon-logo.png',
    'Birdeye': '/assets/images/birdeye-logo.png',
    'Dear Doc': '/assets/images/dear-doc-logo.png',
    'Demand Force': '/assets/images/demand-force-logo.png',
    'Dental Symphony': '/assets/images/dental-symphony-logo.png',
    'Dentrix Hub': '/assets/images/dentrix-hub-logo.png',
    'Doctible': '/assets/images/doctible-logo.png',
    'Enlive Forms': '/assets/images/enlive-dental-logo.png',
    'Flex Dental': '/assets/images/flex-dental-logo.png',
    'Kasper': '/assets/images/kasper-logo.png',
    'Legwork': '/assets/images/legwork-logo.png',
    'Lighthouse 360': '/assets/images/lighthouse-logo.png',
    'M-Consent': '/assets/images/mconsent-logo.png',
    'Localmed': '/assets/images/localmed-logo.png',
    'DI': '/assets/images/dental-intelligence-logo.png',
    'Modento': '/assets/images/modento-logo.png',
    'Nexhealth': '/assets/images/nex-health-logo.png',
    'Opera DDS': '/assets/images/opera-dds-logo.png',
    'Patient Activator': '/assets/images/patient-activator-logo.png',
    'Dentrix Patient Engage': '/assets/images/dentrix-logo.png',
    'Patient Viewer': '/assets/images/patient-viewer-logo.png',
    'Patient Xpress': '/assets/images/patient-express-logo.png',
    'Podium': '/assets/images/podium-logo.png',
    'Practice By Numbers': '/assets/images/practice-by-numbers-logo.png',
    'Practice Mojo': '/assets/images/practic-mojo-logo.png',
    'RecallMax': '/assets/images/recall-max-logo.png',
    'Revenue Well': '/assets/images/revenue-well-logo.png',
    'Simplifeye': '/assets/images/simplifeye-logo.png',
    'Solution Reach': '/assets/images/solotion-reach-logo.png',
    'Swell': '/assets/images/swell-logo.png',
    'Vyne': '/assets/images/vynecorp-logo.png',
    'YAPI': '/assets/images/yapi-logo.png',
    'ZocDoc': '/assets/images/zoc-doc-logo.png',
    'Jarvis': '/assets/images/jarvis-analytics-logo.png',
    'Peer Logic': '/assets/images/peerlogic-logo.png',
    'CareCru': '/assets/images/carecru_logo.png',
    'Dental Intel': '/assets/images/dental-intelligence-logo.png',
    'Vyne Verification': '/assets/images/vynecorp-logo.png',
    'Weave Verification': '/assets/images/weave-logo.png',
    'Practice By Numbers Verification': '/assets/images/practice-by-numbers-logo.png',
    'Solution Reach Verification': '/assets/images/solotion-reach-logo.png',
    'NexHealth Verification': '/assets/images/nex-health-logo.png',
    'Revenue Well Verification': '/assets/images/revenue-well-logo.png'
  };

  // Method to get image URL for a provider
  getProviderImageUrl(providerName: string): string | null {
    if (!providerName) return null;
    
    // Check for exact matches first
    if (this.providerImages[providerName]) {
      return this.providerImages[providerName];
    }
    
    // Optional: Check for partial matches (e.g., if provider name contains "8x8")
    for (const key of Object.keys(this.providerImages)) {
      if (providerName.toLowerCase().includes(key.toLowerCase())) {
        return this.providerImages[key];
      }
    }
    
    return null; // No matching image found
  }

  // Method to get all selected providers as an array
  getSelectedProviders(): string[] {
    const providers: string[] = [];
    const formControls = [
      'current_phone_provider',
      'patient_texting',
      'reminder_recall',
      'digital_forms',
      'treatment_presentation_payment_plans',
      'current_payment_provider',
      'review',
      'online_scheduling',
      'mass_texting',
      'mass_emailing',
      'analytics_morning_huddle',
      'verification_provider'
    ];
    
    for (const control of formControls) {
      const value = this.techStackForm.get(control)?.value;
      if (value && typeof value === 'string' && value.trim() !== '') {
        providers.push(value);
      }
    }
    
    return providers;
  }

  // Method to get unique providers with their images
  getUniqueProvidersWithImages(): { name: string, imageUrl: string }[] {
    const providers = this.getSelectedProviders();
    const uniqueProviders = [...new Set(providers)];
    
    return uniqueProviders
      .map(provider => ({
        name: provider,
        imageUrl: this.getProviderImageUrl(provider)
      }))
      .filter(item => item.imageUrl !== null) as { name: string, imageUrl: string }[];
  }
}
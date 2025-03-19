import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
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
export class TechStackComparisonComponent {
  techStackForm!: FormGroup;
  @Output() formChanged = new EventEmitter<FormGroup>();

  dialog = inject(MatDialog);
  onlineFormService = inject(OnlineFormAgreementService);
  expand:boolean=true

  communicationsList=communicationsList
  operations=operations.map(op => ({ ...op, show: true }));

  analytics=analytics
  mobile=mobile
  verifications=verifications

  constructor(private fb: FormBuilder) {
    this.techStackForm = this.fb.group({
      current_phone_proivder: [],
      patient_texting: [],
      reminder_recall: [],
      digital_froms: [],
      treatment_presentation_payment_plans: [],
      current_payement_provider: [],
      review: [],
      online_scheduling: [],
      mass_texting: [],
      mass_emailing: [],
      analytics_morning_huddle: [],
      verification_provider: [],
      current_phone_proivder_price: [],
      patient_texting_price: [],
      reminder_recall_price: [],
      digital_froms_price: [],
      treatment_presentation_payment_plans_price: [],
      current_payement_provider_price: [],
      review_price: [],
      online_scheduling_price: [],
      mass_texting_price: [],
      mass_emailing_price: [],
      analytics_morning_huddle_price: [],
      verification_provider_price: [],
      tech_stack_totalprice: [],
      features:[[]]
    });
    this.techStackForm.valueChanges.subscribe(() => {
      this.calculateTotal();
      // this.techStackForm.get('features')?.setValue(this.featuresArray, { emitEvent: false });
      this.techStackForm.get('tech_stack_totalprice')?.setValue(this.totalCost, { emitEvent: false });
      this.formChanged.emit(this.techStackForm);
    });
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

  //open the dialog and get value and price
  openSelectProvider(label: string, formControlName: string) {
    const dialogRef = this.dialog.open(SelectProviderComponent, {
      minWidth: '70vw',
      maxHeight: '70vh',
      data: label
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {  
        if(result=='reset'){
          this.techStackForm.get(formControlName)?.reset();
          this.techStackForm.get(formControlName + '_price')?.reset();
          this.storeTheArray.pop()
          this.manageGaps();
          return
        }
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
    });
  }
  reset(){
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
  //calculate the total price
  calculateTotal() {
    this.totalCost = Object.keys(this.techStackForm.controls)
      .filter((key) => key.endsWith('_price'))
      .map((key) => Number(this.techStackForm.controls[key].value) || 0)
      .reduce((acc, val) => acc + val, 0);
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
    this.techStackForm.get('features')?.setValue(falseTexts)
    // this.featuresArray=falseTexts
  }
  //uncheck the values
  // manageGaps(result:string){
  //   if (arrFeatures[result]) {
  //     arrFeatures[result].forEach(feature => {
  //       // Find the matching feature in other arrays and set value to false
  //       this.communicationsList.forEach(item => {
  //         if (item.text === feature) {
  //           item.value = false;
  //         }
  //       });

  //       this.operations.forEach(item => {
  //         if (item.text === feature) {
  //           item.value = false;
  //         }
  //       });
  //       this.analytics.forEach(item => {
  //         if (item.text === feature) {
  //           item.value = false;
  //         }
  //       });
  //       this.mobile.forEach(item => {
  //         if (item.text === feature) {
  //           item.value = false;
  //         }
  //       });
  //     })
  //   }
  // }
}

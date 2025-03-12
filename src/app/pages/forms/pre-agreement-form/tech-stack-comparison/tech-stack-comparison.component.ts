import { Component, inject } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs'
import { FormControl,FormBuilder,  FormGroup, FormsModule,ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {arrFeatures, verificationArrFeatures} from './arrFeatures';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatDialogModule,MatDialog } from '@angular/material/dialog';
import { SelectProviderComponent } from './select-provider/select-provider.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OnlineFormAgreementService } from '../../../../../services/online form/online-form-agreement.service';
type Pricing = { [key: string]: string };
@Component({
  selector: 'app-tech-stack-comparison',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatDialogModule,MatAutocompleteModule,MatInputModule,MatCheckboxModule,MatTabsModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './tech-stack-comparison.component.html',
  styleUrl: './tech-stack-comparison.component.scss'
})
export class TechStackComparisonComponent {
  techStackForm!:FormGroup;

  dialog=inject(MatDialog)
  onlineFormService = inject(OnlineFormAgreementService)
   communicationsList: { text: string; value: boolean }[] = [
    { text: "VoIP Phones", value: true },
    { text: "Softphone (Mobile, Web, Desktop)", value: true },
    { text: "Integrated Caller ID", value: true },
    { text: "Integrated eFax", value: true },
    { text: "Visual Voicemails", value: true },
    { text: "Missed Call Text", value: true },
    { text: "Missed Call Insights", value: true },
    { text: "1 Main Number", value: true },
    { text: "Call Recording", value: true },
    { text: "Easy Call Override", value: true },
    { text: "Text from Office #", value: true },
    { text: "All Comms Post to Patient Logs", value: true },
  ];
   operations: { text: string; value: boolean }[] = [
    { text: "Appt Reminders", value: true },
    { text: "Auto Confirmations", value: true },
    { text: "Patient Recall", value: true },
    { text: "Mass Texting", value: true },
    { text: "Reminders in Spanish", value: true },
    { text: "ASAP Lists", value: true },
    { text: "Eyewear Ready", value: true },
    { text: "Email Marketing", value: true },
    { text: "Drip Campaigns", value: true },
    { text: "Multi-location Emails", value: true },
    { text: "Real-Time Online Scheduling", value: true },
    { text: "Appts Book Directly into PMS", value: true },
    { text: "Dynamic Appt Requests", value: true },
    { text: "Bulk Appt Requests", value: true },
    { text: "Review Software", value: true },
    { text: "Filter Out Unhappy Patients", value: true },
    { text: "Respond to Reviews", value: true },
    { text: "Digital Forms", value: true },
    { text: "Forms Integrate with PMS", value: true },
    { text: "Auto-Assign Forms", value: true },
    { text: "Incomplete Form Reminders", value: true },
    { text: "2-Way Forms Sync", value: true },
    { text: "Forms PDF Posts in PMS", value: true },
    { text: "Forms Autofills Allergies", value: true },
    { text: "Forms Autofills Medical History", value: true },
    { text: "Forms Autofills Medications", value: true },
    { text: "Treatment Plans", value: true },
    { text: "All-In-One Tx Acceptance", value: true },
    { text: "Credit Card Terminal", value: true },
    { text: "Text to Pay", value: true },
    { text: "Payment Plans", value: true },
    { text: "In-House Insurance", value: true },
    { text: "Payments Post in Ledger", value: true },
    { text: "Payment Reminders", value: true },
    { text: "2-Way Patient Logs Sync", value: true },
    { text: "Internal Chat", value: true },
    { text: "Desktop Notifications", value: true },
  ];
  

  analytics: { text: string; value: boolean }[] = [
    { text: "Practice Analytics", value: true },
    { text: "Daily Huddle", value: true },
    { text: "Patient Lists", value: true },
    { text: "Bulk Requests", value: true },
    { text: "Follow Ups", value: true },
    { text: "Provider-level Metrics", value: true },
    { text: "Operatory-level Metrics", value: true },
    { text: "Multi-location Roll Up Views", value: true },
    { text: "Analytics on Mobile", value: true },
    { text: "Data Refreshes Every 5 Mins", value: true },
    { text: "Multi-Year Growth Dashboards", value: true },
    { text: "Patient Churn Reports", value: true },
    { text: "Patient Lifetime Value", value: true },
    { text: "Unscheduled Family Members", value: true },
    { text: "Collections Dashboards", value: true },
  ];
  mobile: { text: string; value: boolean }[] = [
    { text: "Take Calls on Mobile", value: true },
    { text: "Check Voicemails and eFaxes", value: true },
    { text: "IP Address & Geo Restrictions", value: true },
    { text: "Patient Texting on Mobile", value: true },
    { text: "See Schedule Anytime", value: true },
    { text: "Internal Chat on Mobile", value: true },
    { text: "Mobile Notifications", value: true },
    { text: "Take Payments on Mobile", value: true },
    { text: "Request Review on Mobile", value: true },
    { text: "Request Appts, Forms, Reviews", value: true },
    { text: "Practice Metrics on the Go", value: true },
    { text: "Morning Huddle on the Go", value: true },
  ];
  verifications:{ text: string; value: boolean }[]=[
    {text:'Full Insurance Portal Verification',value:true},
    {text:'Eligilibility PDF Attached to Patient File',value:true},
    {text:'Automate Eligilibty Summary to Patients Notes',value:true},
    {text:'Customize Treatment Codes',value:true},
    {text:'Customize Frequency of Verification',value:true},
    {text:'Automate Insurance Requests to Patients',value:true},
  ];

  constructor(private fb:FormBuilder) {
    this.techStackForm =this.fb.group({
      current_phone_proivder:[],
      patient_texting:[],
      reminder_recall:[],
      digital_froms:[],
      treatment_presentation_payment_plans:[],
      current_payement_provider:[],
      review:[],
      online_scheduling:[],
      mass_texting:[],
      mass_emailing:[],
      analytics_morning_huddle:[],
      verification_provider:[],
      current_phone_proivder_price:[],
      patient_texting_price:[],
      reminder_recall_price:[],
      digital_froms_price:[],
      treatment_presentation_payment_plans_price:[],
      current_payement_provider_price:[],
      review_price:[],
      online_scheduling_price:[],
      mass_texting_price:[],
      mass_emailing_price:[],
      analytics_morning_huddle_price:[],
      verification_provider_price:[],
      tech_stack_total_ptice:[]
    });
  }
 
  pricing:Pricing={
    "Birdeye": "250", 
    "CareCru": "500", 
    "Dear Doc": "300", 
    "Demand Force": "500",
    "Dental Symphony": "300", 
    "Dentrix Hub": "300", 
    "Doctible": "300", 
    "Enlive Forms": "300",
    "Flex Dental": "400", 
    "Kasper": "700", 
    "Legwork": "500", 
    "Lighthouse 360": "350",
    "M-Consent": "500", 
    "DI/Modento/LocalMed": "500", 
    "Nexhealth": "700",
     "Opera DDS": "300",
    "Patient Activator": "300",
     "Dentrix Patient Engage": "300",
     "Patient Viewer": "200",
    "Patient Xpress": "500",
     "Peer Logic": "400",
     "Podium": "300",
     "Practice By Numbers": "700",
    "Practice Mojo": "500",
     "RecallMax": "400",
     "Revenue Well": "500",
     "Simplifeye": "300",
    "Solution Reach": "500",
     "Swell": "200",
     "Vyne": "700",
     "Weave": "600",
     "YAPI": "400",
    "ZocDoc": "500",
     "AT&T": "200",
     "Bell": "200",
     "Comcast": "200",
     "xFinity": "200",
    "GoTo Connect": "200",
     "Intiveo": "200",
     "Mango": "150",
     "Aloha": "200",
     "Nextiva": "200",
    "Ooma": "200",
     "Optimum": "200",
     "RingCentral": "200",
     "Shaw": "200",
     "Spectrum": "200",
    "Verizon": "200",
     "8x8": "200",
     "No Texting System": "0",
     "OTHER": "",
     "Jarvis": "500",
    "EHR/PMS": "",
     "Vyne Verification": "200",
     "Zuub": "450",
     "AirPay": "400",
     "E-Assist": "3000",
    "Weave Verification": "400",
     "Practice By Numbers Verification": "250",
     "Solution Reach Verification": "400",
    "NexHealth Verification": "400",
     "Dental Intel": "400",
     "Revenue Well Verification": "400",
    "No Vendor": "0",
     "Cooper Vision": "500",
     "4PatientCare": "500",
     "ABB Analyze": "500",
    "Edge Pro": "500"
  };

  verification_providers:Pricing={
    "Vyne": "200",
    "Zuub": "450",
    "AirPay": "400",
    "E-Assist": "3000",
    "Weave": "400",
    "Practice By Numbers": "250",
    "Solution Reach": "400",
    "NexHealth": "400",
    "Dental Intel": "400",
    "Revenue Well": "400",
    "No Vendor": "0",
  }
  totalCost:number=0

  array:{ text: string; value: boolean }[][]=[];
 
  selectedValues: { [key: number]: string } = {}; // Store selected values for each dropdown
  resetValue:any

  //open the dialog and get value and price
  openSelectProvider(label:string, formControlName:string){
    const dialogRef = this.dialog.open(SelectProviderComponent, {
      minWidth: '70vw',
      maxHeight:'70vh',
      data:label
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
        this.techStackForm.get(formControlName)?.setValue(result)
        if(label=='Verification Provider'){
          let price = this.verification_providers[result];
          this.techStackForm.get(formControlName+'_price')?.setValue(price)
          console.log(price)
          this.manageGapsInVerification(result);
        }else{
          let price = this.pricing[result];
          this.techStackForm.get(formControlName+'_price')?.setValue(price)
          console.log(price)
         this.storeTheArray.push(result);
         this.manageGaps()
        }
       this.calculateTotal()
      }
    });
  }
  
  //calculate the total price
  calculateTotal() {
    this.totalCost = Object.keys(this.techStackForm.controls)
      .filter(key => key.endsWith('_price'))
      .map(key => Number(this.techStackForm.controls[key].value) || 0)
      .reduce((acc, val) => acc + val, 0);
  }

  manageGapsInVerification(result:string){
    this.verifications.forEach(res=>{
      res.value=true
    })
    if (verificationArrFeatures[result]) {
      verificationArrFeatures[result].forEach(feature => {
        this.verifications.forEach(item => {
          if (item.text === feature) {
            item.value = false;
          }
        });
      });
    }
  }
  storeTheArray:any[]=[]
  manageGaps() {
    console.log("asdasdasd")
    this.storeTheArray.forEach(data=>{
      console.log(data,"asdasdasd")
        const featuresToUncheck = arrFeatures[data] || [];
        const updateArray = (arr: { text: string; value: boolean }[]) => { // Corrected type here
          arr.forEach(item => {
            if (featuresToUncheck.includes(item.text)) {
              item.value = false;
            } else if (!item.value) {
              item.value = true;
            }
          });
        };
        updateArray(this.communicationsList);
        updateArray(this.operations);
        updateArray(this.analytics);
        updateArray(this.mobile);
      
    })
    
  
    
    
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

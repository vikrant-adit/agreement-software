import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from "../../../../header/header.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-view-agreement',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, HeaderComponent,MatFormFieldModule,MatInputModule,MatSelectModule,MatTabsModule],
  templateUrl: './view-agreement.component.html',
  styleUrl: './view-agreement.component.scss'
})
export class ViewAgreementComponent {
  count: number = 0;
  signatureNeeded!: boolean;
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      backgroundColor: 'white',
      penColor: 'black'
    });

    // Resize canvas to fit parent
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.signaturePad.clear(); // Clear pad after resizing
  }

  clearPad() {
    this.signaturePad.clear();
  }

  saveSignature() {
    if (!this.signaturePad.isEmpty()) {
      const dataUrl = this.signaturePad.toDataURL(); // Get base64 image
      console.log('Saved Signature:', dataUrl);
    } else {
      console.warn('No signature to save!');
    }
  }
  increment() {
    this.count++;
  }

  decrement() {
    if (this.count > 1) {
      this.count--;
    }
  }
  totalCost:any=0
  isAnnually: boolean = true;
  selectPhone:boolean = true
  selectTerminal:boolean=true
  toggleView(view: 'annually' | 'monthly') {
    this.isAnnually = view === 'annually';
  }
  communicationsList: { text: string; value: boolean }[] = [
    { text: 'VoIP Phones', value: true },
    { text: 'Softphone (Mobile, Web, Desktop)', value: true },
    { text: 'Integrated Caller ID', value: true },
    { text: 'Integrated eFax', value: true },
    { text: 'Visual Voicemails', value: true },
    { text: 'Missed Call Text', value: true },
    { text: 'Missed Call Insights', value: true },
    { text: '1 Main Number', value: true },
    { text: 'Call Recording', value: true },
    { text: 'Easy Call Override', value: true },
    { text: 'Text from Office #', value: true },
    { text: 'All Comms Post to Patient Logs', value: true }];

  operations: { text: string; value: boolean }[] = [
    { text: 'Appt Reminders', value: true },
    { text: 'Auto Confirmations', value: true },
    { text: 'Patient Recall', value: true },
    { text: 'Mass Texting', value: true },
    { text: 'Reminders in Spanish', value: true },
    { text: 'ASAP Lists', value: true },
    { text: 'Eyewear Ready', value: true },
    { text: 'Email Marketing', value: true },
    { text: 'Drip Campaigns', value: true },
    { text: 'Multi-location Emails', value: true },
    { text: 'Real-Time Online Scheduling', value: true },
    { text: 'Appts Book Directly into PMS', value: true },
    { text: 'Dynamic Appt Requests', value: true },
    { text: 'Bulk Appt Requests', value: true },
    { text: 'Review Software', value: true },
    { text: 'Filter Out Unhappy Patients', value: true },
    { text: 'Respond to Reviews', value: true },
    { text: 'Digital Forms', value: true },
    { text: 'Forms Integrate with PMS', value: true },
    { text: 'Auto-Assign Forms', value: true },
    { text: 'Incomplete Form Reminders', value: true },
    { text: '2-Way Forms Sync', value: true },
    { text: 'Forms PDF Posts in PMS', value: true },
    { text: 'Forms Autofills Allergies', value: true },
    { text: 'Forms Autofills Medical History', value: true },
    { text: 'Forms Autofills Medications', value: true },
    { text: 'Treatment Plans', value: true },
    { text: 'All-In-One Tx Acceptance', value: true },
    { text: 'Credit Card Terminal', value: true },
    { text: 'Text to Pay', value: true },
    { text: 'Payment Plans', value: true },
    { text: 'In-House Insurance', value: true },
    { text: 'Payments Post in Ledger', value: true },
    { text: 'Payment Reminders', value: true },
    { text: '2-Way Patient Logs Sync', value: true },
    { text: 'Internal Chat', value: true },
    { text: 'Desktop Notifications', value: true },
  ];

  analytics: { text: string; value: boolean }[] = [
    { text: 'Practice Analytics', value: true },
    { text: 'Daily Huddle', value: true },
    { text: 'Patient Lists', value: true },
    { text: 'Bulk Requests', value: true },
    { text: 'Follow Ups', value: true },
    { text: 'Provider-level Metrics', value: true },
    { text: 'Operatory-level Metrics', value: true },
    { text: 'Multi-location Roll Up Views', value: true },
    { text: 'Analytics on Mobile', value: true },
    { text: 'Data Refreshes Every 5 Mins', value: true },
    { text: 'Multi-Year Growth Dashboards', value: true },
    { text: 'Patient Churn Reports', value: true },
    { text: 'Patient Lifetime Value', value: true },
    { text: 'Unscheduled Family Members', value: true },
    { text: 'Collections Dashboards', value: true },
  ];
  mobile: { text: string; value: boolean }[] = [
    { text: 'Take Calls on Mobile', value: true },
    { text: 'Check Voicemails and eFaxes', value: true },
    { text: 'IP Address & Geo Restrictions', value: true },
    { text: 'Patient Texting on Mobile', value: true },
    { text: 'See Schedule Anytime', value: true },
    { text: 'Internal Chat on Mobile', value: true },
    { text: 'Mobile Notifications', value: true },
    { text: 'Take Payments on Mobile', value: true },
    { text: 'Request Review on Mobile', value: true },
    { text: 'Request Appts, Forms, Reviews', value: true },
    { text: 'Practice Metrics on the Go', value: true },
    { text: 'Morning Huddle on the Go', value: true },
  ];
  verifications: { text: string; value: boolean }[] = [
    { text: 'Full Insurance Portal Verification', value: true },
    { text: 'Eligilibility PDF Attached to Patient File', value: true },
    { text: 'Automate Eligilibty Summary to Patients Notes', value: true },
    { text: 'Customize Treatment Codes', value: true },
    { text: 'Customize Frequency of Verification', value: true },
    { text: 'Automate Insurance Requests to Patients', value: true },
  ];

  previewImage: string | ArrayBuffer | null = null;

  // Drag Over
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Drag Leave
  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  // Drop File
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  // File Selected
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.handleFile(target.files[0]);
    }
  }

  // Handle File
  private handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    } else {
      alert('Only image files are allowed!');
    }
  }
}

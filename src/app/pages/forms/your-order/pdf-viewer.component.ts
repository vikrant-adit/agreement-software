import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';

@Component({
  selector: 'app-pdf-viewer',
  template: `<iframe [src]="pdfUrl" width="100%" height="100%"></iframe>`,
})
export class PdfViewerComponent implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private onlineFormService: OnlineFormAgreementService,
    private sanitizer: DomSanitizer,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const agreementId = this.activeRoute.snapshot.paramMap.get('agreementId');
    this.onlineFormService.getPdf(agreementId).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }
}

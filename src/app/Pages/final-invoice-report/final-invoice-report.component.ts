import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ModalService } from '../../../core/services/modal.service';
import { FinalInvoiceReportModalComponent } from '../../../shared/components/final-invoice-report-modal/final-invoice-report-modal.component';

@Component({
  selector: 'app-final-invoice-report',
  standalone: true,
  imports: [],
  templateUrl: './final-invoice-report.component.html',
  styleUrl: './final-invoice-report.component.css'
})
export class FinalInvoiceReportComponent {
  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.openModal();
  }
  openModal() {
    this.modalService.openModal(FinalInvoiceReportModalComponent, {
      data: {},
      width: '45%',
      height: '50vh',
      position: {
        top: '80px',
      },
      maxWidth: '98vw',
      maxHeight: '98vh',
    });
  }
}

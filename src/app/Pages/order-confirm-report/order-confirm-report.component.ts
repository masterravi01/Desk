import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ModalService } from '../../../core/services/modal.service';
import { OrderConfirmReportModalComponent } from '../../../shared/components/order-confirm-report-modal/order-confirm-report-modal.component';


@Component({
  selector: 'app-order-confirm-report',
  standalone: true,
  imports: [],
  templateUrl: './order-confirm-report.component.html',
  styleUrl: './order-confirm-report.component.css'
})
export class OrderConfirmReportComponent {
  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    // this.openModal();
  }
  openModal() {
    this.modalService.openModal(OrderConfirmReportModalComponent, {
      data: {},
      width: '45%',
      height: '42vh',
      position: {
        top: '80px',
      },
      maxWidth: '98vw',
      maxHeight: '98vh',
    });
  }
}

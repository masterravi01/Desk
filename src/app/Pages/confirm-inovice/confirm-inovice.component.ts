import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ConfirmInvoiceModalComponent } from '../../../shared/components/confirm-invoice-modal/confirm-invoice-modal.component';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-confirm-inovice',
  standalone: true,
  imports: [],
  templateUrl: './confirm-inovice.component.html',
  styleUrl: './confirm-inovice.component.css',
})
export class ConfirmInoviceComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.openModal();
  }
  openModal() {
    this.modalService.openModal(ConfirmInvoiceModalComponent, {
      data: {},
      width: '100vw', // Full viewport width
      height: '100vh', // Full viewport height
      maxWidth: '98vw',
      maxHeight: '98vh',
    });
  }
}

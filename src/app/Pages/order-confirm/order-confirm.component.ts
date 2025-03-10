import { Component, OnInit } from '@angular/core';
import { OrderConfirmModalComponent } from '../../../shared/components/order-confirm-modal/order-confirm-modal.component';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-order-confirm',
  standalone: true,
  imports: [],
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.css',
})
export class OrderConfirmComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.openModal();
  }
  openModal() {
    this.modalService.openModal(OrderConfirmModalComponent, {
      data: {},
      width: '100vw', // Full viewport width
      height: '100vh', // Full viewport height
      maxWidth: '98vw',
      maxHeight: '98vh',
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BusinessMasterModalComponent } from '../../../shared/components/business-master-modal/business-master-modal.component';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-business-master',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './business-master.component.html',
  styleUrl: './business-master.component.css',
})
export class BusinessMasterComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.openModal();
  }
  openModal() {
    this.modalService.openModal(BusinessMasterModalComponent, {
      data: {},
      width: '80%',
      position: {
        top: '20px',
      },
    });
  }
}

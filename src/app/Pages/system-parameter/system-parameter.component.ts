import { Component, OnInit } from '@angular/core';

import { SystemParameterModalComponent } from '../../../shared/components/system-parameter-modal/system-parameter-modal.component';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-system-parameter',
  standalone: true,
  imports: [],
  templateUrl: './system-parameter.component.html',
  styleUrl: './system-parameter.component.css',
})
export class SystemParameterComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.openModal();
  }
  openModal() {
    this.modalService.openModal(SystemParameterModalComponent, {
      data: {},
      width: '80%',
      position: {
        top: '20px',
      },
    });
  }
}

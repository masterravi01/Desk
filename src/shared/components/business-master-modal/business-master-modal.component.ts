import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NewCustomerComponent } from '../new-customer/new-customer.component';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-business-master-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: './business-master-modal.component.html',
  styleUrl: './business-master-modal.component.css',
})
export class BusinessMasterModalComponent {
  readonly dialogRef = inject(MatDialogRef<BusinessMasterModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  displayedColumns: string[] = ['name', 'email', 'phone'];
  customers = [
    { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  ];
  instructions = [
    { id: '1', value: 'this is base instructions' },
    { id: '2', value: 'this is base instructions' },
    { id: '4', value: 'this is base instructions' },
    { id: '5', value: 'this is base instructions' },
    { id: '9', value: 'this is base instructions' },
  ];
  containers = [
    {
      id: '4',
      name: 'Box 201',
      type: 'Full Size',
      width: '124',
      height: '200',
      weight: '300',
      length: '100',
    },
    {
      id: '4',
      name: 'Box 201',
      type: 'Full Size',
      width: '124',
      height: '200',
      weight: '300',
      length: '100',
    },
    {
      id: '4',
      name: 'Box 201',
      type: 'Full Size',
      width: '124',
      height: '200',
      weight: '300',
      length: '100',
    },
    {
      id: '4',
      name: 'Box 201',
      type: 'Full Size',
      width: '124',
      height: '200',
      weight: '300',
      length: '100',
    },
  ];

  currency = [
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
    {
      id: '4',
      name: 'US Dollar',
      char: '$',
      country: 'USA',
    },
  ];
  bottomNote = [
    { id: '1', value: 'this is base bottom note !' },
    { id: '2', value: 'this is base bottom note !' },
    { id: '4', value: 'this is base bottom note !' },
    { id: '5', value: 'this is base bottom note !' },
    { id: '9', value: 'this is base bottom note !' },
  ];
  constructor(private modalService: ModalService) {}
  onCancel(): void {
    this.dialogRef.close(false); // Return false on cancel
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Return true on confirm
  }
  openCustomerModal() {
    this.modalService.openModal(NewCustomerComponent, {
      width: '80%',
      height: '90%',
    });
  }
}

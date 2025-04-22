import { Component, EventEmitter, inject, Output } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalService } from '../../../core/services/modal.service';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableComponent } from '../table/table.component';

@UntilDestroy()
@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    TableComponent,
  ],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.css',
})
export class SelectCustomerComponent {
  readonly dialogRef = inject(MatDialogRef<SelectCustomerComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  customers = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'name',
    'phone',
    'email',
    'contactPerson',
    'designation',
    'otherPhone',
    'url',
    'fax',
    'remark',
    'address',
    'city',
    'state',
    'zip',
    'country',
    'buyerAddress',
    'buyerCity',
    'buyerState',
    'buyerZipcode',
    'buyerCountry',
    'bankName',
    'bankBranch',
    'bankCity',
    'bankAddress',
    'bankState',
    'bankZip',
    'bankCountry',
  ];

  constructor(
    private modalService: ModalService,
    private masterService: MasterService
  ) {}
  ngOnInit() {
    this.loadCustomers();
  }
  loadCustomers() {
    this.masterService
      .invoke('getAllCustomers')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.customers = new MatTableDataSource<any>(data);
      });
  }
  selectCustomer(row: any) {
    console.log(row);
    this.dialogRef.close({
      customerId: row.id,
      customerName: row.name,
      customerAddress: row.address,
      customerCity: row.city,
      customerZip: row.zip,
      customerState: row.state,
      customerCountry: row.country,
      buyerAddress: row.buyerAddress,
      buyerCity: row.buyerCity,
      buyerZip: row.buyerZipcode,
      buyerState: row.buyerState,
      buyerCountry: row.buyerCountry,
      bankName: row.bankName,
      bankBranch: row.bankBranch,
      bankCity: row.bankCity,
      bankAddress: row.bankAddress,
      email: row.email,
      phone: row.phone,
    });
  }
  onCancel(): void {
    this.dialogRef.close(false); // Return false on cancel
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Return true on confirm
  }
}

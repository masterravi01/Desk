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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { NewCustomerComponent } from '../new-customer/new-customer.component';
import { ModalService } from '../../../core/services/modal.service';
import { ContainerModalComponent } from '../container-modal/container-modal.component';
import { NewCurrencyModalComponent } from '../new-currency-modal/new-currency-modal.component';
import { SingleParamenterComponent } from '../single-paramenter/single-paramenter.component';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.css',
})
export class SelectCustomerComponent {
  readonly dialogRef = inject(MatDialogRef<SelectCustomerComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  customers = [];
  displayedColumns: string[] = [
    'Name',
    'Phone',
    'Email',
    'ContactPerson',
    'Designation',
    'OtherPhone',
    'URL',
    'Fax',
    'Remark',
    'Address',
    'City',
    'State',
    'Zip',
    'Country',
    'Buyer Address',
    'Buyer City',
    'Buyer State',
    'Buyer Zipcode',
    'Buyer Country',
    'Bank Name',
    'Bank Branch',
    'Bank City',
    'Bank Address',
    'Bank State',
    'Bank Zip',
    'Bank Country',
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
        this.customers = data;
      });
  }
  selectCustomer(row: any) {
    console.log(row);
    this.dialogRef.close({
      customerId: row.ID,
      customerName: row.Name,
      customerAddress: row.Address,
      customerCity: row.City,
      customerZip: row.Zip,
      customerState: row.State,
      customerCountry: row.Country,
      billingAddress: row.BuyerAddress,
      billingCity: row.BuyerCity,
      billingZip: row.BuyerZipcode,
      billingState: row.BuyerState,
      billingCountry: row.BuyerCountry,
      bankName: row.BnkName,
      bankBranch: row.BnkBranch,
      bankCity: row.BnkCity,
      bankAddress: row.BnkAddress,
      email: row.Email,
      phone: row.Phone,
    });
  }
  onCancel(): void {
    this.dialogRef.close(false); // Return false on cancel
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Return true on confirm
  }
}

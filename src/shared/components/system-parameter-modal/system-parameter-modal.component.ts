import { Component, inject, OnDestroy } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MasterService } from '../../../core/services/master.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-system-parameter-modal',
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
    MatFormFieldModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './system-parameter-modal.component.html',
  styleUrl: './system-parameter-modal.component.css',
})
export class SystemParameterModalComponent implements OnDestroy {
  readonly dialogRef = inject(MatDialogRef<SystemParameterModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  displayedColumns: string[] = ['name', 'email', 'phone'];
  companyForm!: FormGroup;
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
  private subscriptions: Subscription = new Subscription();

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) {
    this.companyForm = this.fb.group({
      companyCode: [''], // Matches companyCode
      companyName: [''], // Matches companyName
      entryDate: [''], // Matches entryDate
      currencyCode: [''], // Matches currencyCode
      createdBy: [''], // Matches createdBy
      remarks: [''], // Matches remarks
      isCurrentCompany: [0], // Matches isCurrentCompany

      // Company Address
      companyAddressLine1: [''], // Matches companyAddressLine1
      companyAddressLine2: [''], // Matches companyAddressLine2
      companyCity: [''], // Matches companyCity
      companyPostalCode: [''], // Matches companyPostalCode
      companyCountry: [''], // Matches companyCountry
      companyState: [''], // Matches companyState

      // Bank Details
      bankName: [''], // Matches bankName
      bankAddressLine1: [''], // Matches bankAddressLine1
      bankAddressLine2: [''], // Matches bankAddressLine2
      bankCity: [''], // Matches bankCity
      bankPostalCode: [''], // Matches bankPostalCode
      bankCountry: [''], // Matches bankCountry
      bankState: [''], // Matches bankState
      swiftCode: [''], // Matches swiftCode
      accountNumber: [''], // Matches accountNumber
      additionalNumber: [''], // Matches additionalNumber
      importExportCode: [''], // Matches importExportCode
      taxIdentificationNumber: [''], // Matches taxIdentificationNumber
    });
    // const sub = this.masterService.invoke('getCompany', 1).subscribe((data) => {
    //   console.log(data);
    // });

    // this.subscriptions.add(sub);
  }
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

  openCurrencyModal() {
    this.modalService.openModal(NewCurrencyModalComponent, {
      width: '50%',
      height: '90%',
      position: {
        top: '40px',
      },
    });
  }
  onSave() {
    console.log(this.companyForm.value);
    const sub = this.masterService
      .invoke('addCompany', this.companyForm.value)
      .subscribe((data) => {
        console.log(data);
      });
    this.subscriptions.add(sub);

    this.dialogRef.close(this.companyForm.value);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }
}

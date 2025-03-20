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
import { ModalService } from '../../../core/services/modal.service';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CurrencyPipe, DatePipe } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-select-invoice',
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
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './select-invoice.component.html',
  styleUrl: './select-invoice.component.css',
})
export class SelectInvoiceComponent {
  readonly dialogRef = inject(MatDialogRef<SelectInvoiceComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  invoices = [];

  displayedColumns: string[] = [
    'invoiceId',
    'customerOrderNo',
    'invoiceDate',
    'invoiceSerial',
    'invoicePiNo',
    'customerId',
    'finalInvoice',
    'customerName',
    'status',
    'totalAmount',
    'netAmount',
  ];

  constructor(
    private modalService: ModalService,
    private masterService: MasterService
  ) { }

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.masterService
      .invoke('getAllMasterInvoices', this.data?.final ? false : true)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.invoices = data;
      });
  }

  selectInvoice(row: any) {
    console.log(row);
    this.dialogRef.close({
      invoiceId: row.invoiceId,
      customerOrderNo: row.customerOrderNo,
      invoiceDate: row.invoiceDate,
      invoiceSerial: row.invoiceSerial,
      invoicePiNo: row.invoicePiNo,
      finalInvoice: row.finalInvoice,
      customerId: row.customerId,
      customerName: row.customerName,
      status: row.status,
      totalAmount: row.totalAmount,
      netAmount: row.netAmount,
    });
  }

  onCancel(): void {
    this.dialogRef.close(false); // Return false on cancel
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Return true on confirm
  }
}

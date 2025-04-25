import {
  Component,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalService } from '../../../core/services/modal.service';
import { MasterService } from '../../../core/services/master.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SelectInvoiceComponent } from '../select-invoice/select-invoice.component';

@UntilDestroy()

@Component({
  selector: 'app-order-confirm-report-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatTableModule,
    MatTabsModule,
    MatDividerModule
  ],
  templateUrl: './order-confirm-report-modal.component.html',
  styleUrl: './order-confirm-report-modal.component.css'
})
export class OrderConfirmReportModalComponent {
  readonly dialogRef = inject(MatDialogRef<OrderConfirmReportModalComponent>);
  orderForm!: FormGroup;
  reportType: string = 'ms-word';

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.orderForm = this.fb.group({
      customerId: [''],
      customerName: [''],
      invoiceId: [''],
      invoicePiNo: [''],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  openSelectModal() {
    this.modalService
      .openModal(SelectInvoiceComponent, {
        data: { final: false },
        width: '80%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.invoiceId) {
          console.log(result);
          this.initForm();
          this.orderForm.patchValue(result);
          console.log(this.orderForm.value);
        }
      });
  }


  generateDocument(country?: any) {
    let body = {
      ...this.orderForm.value,
      format: this.reportType,
      country
    };
    console.log(body);

    this.masterService
      .invoke('generateOrderConfirmation', body)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
      });
  }

}

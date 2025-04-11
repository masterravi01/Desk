import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalService } from '../../../core/services/modal.service';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  TitleCasePipe,
} from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CamelCaseToTitlePipe } from '../../pipes/camel-case-to-title.pipe';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

@UntilDestroy()
@Component({
  selector: 'app-select-invoice',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatTableModule,
    MatTabsModule,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    MatFormFieldModule,
    CamelCaseToTitlePipe,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './select-invoice.component.html',
  styleUrl: './select-invoice.component.css',
})
export class SelectInvoiceComponent implements OnInit, AfterViewInit {
  readonly dialogRef = inject(MatDialogRef<SelectInvoiceComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  invoices!: MatTableDataSource<any>;
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
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private modalService: ModalService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.loadInvoices();
  }
  ngAfterViewInit() {
    if (this.invoices) {
      this.invoices.sort = this.sort;
      this.invoices.paginator = this.paginator;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoices'] && this.invoices) {
      this.setupSortingAccessor();
      this.invoices.sort = this.sort;
      this.invoices.paginator = this.paginator;
    }
  }
  setupSortingAccessor() {
    if (this.invoices) {
      this.invoices.sortingDataAccessor = (item, property) => {
        const value = item[property];
        if (value == null) return '';
        if (typeof value === 'string') return value.toLowerCase();
        if (value instanceof Date) return value.getTime();
        if (typeof value === 'boolean') return value ? 1 : 0;
        return value;
      };
    }
  }
  loadInvoices() {
    this.invoices = new MatTableDataSource<any>([]);
    this.invoices.filterPredicate = (data, filter) => {
      const dataStr = Object.keys(data)
        .map((key) => this.getNestedValue(data, key))
        .join(' ')
        .toLowerCase();

      return dataStr.includes(filter.trim().toLowerCase());
    };
    this.masterService
      .invoke('getAllMasterInvoices', this.data?.final)
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.invoices.data = data;
      });
  }
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.invoices.filter = filterValue;

    if (this.invoices.paginator) {
      this.invoices.paginator.firstPage();
    }
  }
  onCancel(): void {
    this.dialogRef.close(false); // Return false on cancel
  }

  onConfirm(): void {
    this.dialogRef.close(true); // Return true on confirm
  }
}

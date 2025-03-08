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
import { ContainerModalComponent } from '../container-modal/container-modal.component';
import { NewCurrencyModalComponent } from '../new-currency-modal/new-currency-modal.component';
import { SingleParamenterComponent } from '../single-paramenter/single-paramenter.component';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
  instructions = [];
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

  currency = [];
  bottomNote = [];

  constructor(
    private modalService: ModalService,
    private masterService: MasterService
  ) { }

  onTabChange(event: any) {
    let tab = event.tab.textLabel || "Customer";
    if (tab == "Customer") this.loadCustomers();
    if (tab == "Bottom Note") this.loadBottomNote();
    if (tab == "Currency") this.loadCurrency();
    if (tab == "Instruction") this.loadInstruction();

  }

  loadCustomers() {

  }

  loadBottomNote() {
    this.masterService
      .invoke('getAllBottomNote')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.bottomNote = data;
      });
  }

  loadInstruction() {
    this.masterService
      .invoke('getAllInstruction')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        this.instructions = data;
      });
  }

  loadCurrency() {
    this.masterService
      .invoke('getAllCurrencies')
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        console.log(data);
        this.currency = data;
      });
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
  openContainerModal() {
    this.modalService.openModal(ContainerModalComponent, {
      width: '50%',
      height: '90%',
      position: {
        top: '40px',
      },
    });
  }

  openCurrencyModal(data?: any) {
    this.modalService
      .openModal(NewCurrencyModalComponent, {
        width: '50%',
        minHeight: '300px',
        position: { top: '40px' },
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadCurrency();
      });
  }

  openBottomNoteModal(note?: any) {
    const dialogRef = this.modalService.openModal(SingleParamenterComponent, {
      width: '50%',
      height: '300px',
      position: { top: '40px' },
      data: {
        title: note ? 'Edit Bottom Note' : 'New Bottom Note',
        parameter: 'Bottom Note',
        info: note ? {
          id: note.BID,
          value: note.BottomNote
        } : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.delete) {
          console.log('Deleting Bottom Note:', result);
          this.masterService
            .invoke('deleteBottomNote', result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadBottomNote();
            });
        } else {
          let action = note ? 'updateBottomNote' : 'addBottomNote';
          console.log('Bottom Note Saved:', result);
          this.masterService
            .invoke(action, result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadBottomNote();
            });
        }
      }
    });
  }


  openInstructionModal(instruction?: any) {
    const dialogRef = this.modalService.openModal(SingleParamenterComponent, {
      width: '50%',
      height: '300px',
      position: { top: '40px' },
      data: {
        title: instruction ? 'Edit Instruction' : 'New Instruction',
        parameter: 'Instruction',
        info: instruction ? {
          id: instruction.BID,
          value: instruction.Instruction
        } : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.delete) {
          console.log('Deleting Instruction:', result);
          this.masterService
            .invoke('deleteInstruction', result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadInstruction();
            });
        } else {
          let action = instruction ? 'updateInstruction' : 'addInstruction';
          console.log('Instruction Saved:', result);
          this.masterService
            .invoke(action, result)
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.loadInstruction();
            });
        }
      }
    });
  }
}

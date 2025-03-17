import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ModalService } from '../../../core/services/modal.service';
import { MasterService } from '../../../core/services/master.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-select-instruction',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatDialogTitle],
  templateUrl: './select-instruction.component.html',
  styleUrl: './select-instruction.component.css',
})
export class SelectInstructionComponent {
  readonly dialogRef = inject(MatDialogRef<SelectInstructionComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  Instructions: any[] = [];
  displayedColumns: string[] = ['BID', 'Instruction'];

  constructor(
    private modalService: ModalService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.loadInstructions();
  }

  loadInstructions() {
    this.masterService
      .invoke('getAllInstruction')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.Instructions = data || []; // Ensure fallback to empty array
        },
        error: (error) => {
          console.error('Error fetching instructions:', error);
          this.Instructions = [];
        },
      });
  }

  selectInstruction(row: any) {
    console.log(row);
    this.dialogRef.close({
      instructionId: row.BID,
      invoiceInstruction: row.Instruction,
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

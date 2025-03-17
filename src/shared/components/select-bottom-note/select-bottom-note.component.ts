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
  selector: 'app-select-bottom-note',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatDialogTitle],
  templateUrl: './select-bottom-note.component.html',
  styleUrl: './select-bottom-note.component.css',
})
export class SelectBottomNoteComponent {
  readonly dialogRef = inject(MatDialogRef<SelectBottomNoteComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  BottomNotes: any[] = [];
  displayedColumns: string[] = ['bottomNoteId', 'bottomNote'];

  constructor(
    private modalService: ModalService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.loadBottomNote();
  }

  loadBottomNote() {
    this.masterService
      .invoke('getAllBottomNote')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.BottomNotes = data || []; // Ensure fallback to empty array
        },
        error: (error) => {
          console.error('Error fetching BottomNotes:', error);
          this.BottomNotes = [];
        },
      });
  }

  selectBottomNote(row: any) {
    console.log(row);
    this.dialogRef.close({
      bottomNoteId: row.bottomNoteId,
      bottomNote: row.bottomNote,
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

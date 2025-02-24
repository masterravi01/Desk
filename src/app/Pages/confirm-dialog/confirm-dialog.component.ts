import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
    ) { }

    onCancel(): void {
        this.dialogRef.close(false); // Return false on cancel
    }

    onConfirm(): void {
        this.dialogRef.close(true); // Return true on confirm
    }
}

import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private dialog = inject(MatDialog);

  openModal<T, D = any, R = any>(
    component: ComponentType<any>,
    options?: D
  ): MatDialogRef<T, R> {
    return this.dialog.open(component, {
      width: '500px', // Default width (adjust as needed)
      disableClose: true, // Prevent closing on click outside
      ...options,
    });
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}

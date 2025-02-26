import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User, UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { DocumentGeneratorService } from '../../services/document-generator.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService, private dialog: MatDialog, private documentService: DocumentGeneratorService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    const sub = this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
    this.subscriptions.add(sub);
  }

  deleteUser(userId: number) {
    console.log(`User with ID ${userId} deleted`);
    const sub = this.userService.deleteUser(userId).subscribe(() => {
      this.fetchUsers();
    });
    this.subscriptions.add(sub);
  }

  confirmDelete(userId: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this user?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }
  downloadWord() {
    this.documentService.generateWordFile();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { User, UserService } from '../../services/user.service';
import { MatDialog, } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
  deleteUser(userId: number) {
    console.log(`User with ID ${userId} deleted`);
    this.userService.deleteUser(userId).subscribe(() => {
      this.fetchUsers();
    });
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
}

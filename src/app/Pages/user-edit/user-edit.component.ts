import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  user: User = { name: '', email: '' };
  userId: number | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    const sub = this.userService.getUsers().subscribe((users) => {
      this.user = users.find((u) => u.id === this.userId) || { name: '', email: '' };
    });

    this.subscriptions.add(sub);
  }

  updateUser() {
    if (this.userId) {
      const sub = this.userService.updateUser(this.user).subscribe(() => {
        this.router.navigate(['/']);
      });

      this.subscriptions.add(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }
}

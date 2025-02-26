import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  user: User = { name: '', email: '' };

  constructor(private userService: UserService, private router: Router) { }

  async createUser() {
    await this.userService.addUser(this.user)
    this.router.navigate(['/']);
  }
}

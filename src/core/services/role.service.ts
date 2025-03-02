import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roles = ['admin', 'user', 'guest'];

  getRoles() {
    return this.roles;
  }

  addRole(role: string) {
    this.roles.push(role);
  }

  removeRole(role: string) {
    this.roles = this.roles.filter((r) => r !== role);
  }
}

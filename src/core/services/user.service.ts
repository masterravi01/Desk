import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private crudService: CrudService) {}

  getUserProfile(userId: any) {
    return this.crudService.get(`/users/${userId}`);
  }

  updateUserProfile(userId: string, data: any) {
    return this.crudService.put(`/users/${userId}`, data);
  }
}

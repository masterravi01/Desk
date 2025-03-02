import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  IApiBaseActions,
  IApiBaseResponse,
  ParamsType,
} from '../models/Interfaces/IApiBaseAction.interface';
import { RESPONSE_MESSAGES } from '../constants/response-messages.constants';

@Injectable({
  providedIn: 'root',
})
export class MasterService implements IApiBaseActions {
  constructor(public httpClient: HttpClient) {}

  Get(url: string, params?: ParamsType) {
    return this.httpClient
      .get<IApiBaseResponse>(url, { params: this.createParams(params) })
      .pipe(
        tap((response) => this.HandleResponse(response)),
        catchError(this.handleError)
      );
  }

  GetAll(url: string, params?: ParamsType) {
    return this.httpClient
      .get<IApiBaseResponse>(url, { params: this.createParams(params) })
      .pipe(
        tap((response) => this.HandleResponse(response)),
        catchError(this.handleError)
      );
  }

  Post(url: string, data: any, params?: ParamsType) {
    return this.httpClient
      .post<IApiBaseResponse>(url, data, { params: this.createParams(params) })
      .pipe(
        tap((response) => this.HandleResponse(response)),
        catchError(this.handleError)
      );
  }

  Put(url: string, data: any, params?: ParamsType) {
    return this.httpClient
      .put<IApiBaseResponse>(url, data, { params: this.createParams(params) })
      .pipe(
        tap((response) => this.HandleResponse(response)),
        catchError(this.handleError)
      );
  }

  Delete(url: string, data: any, params?: ParamsType) {
    return this.httpClient
      .delete<IApiBaseResponse>(url, { params: this.createParams(params) })
      .pipe(
        tap((response) => this.HandleResponse(response)),
        catchError(this.handleError)
      );
  }

  private createParams(params?: ParamsType): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.append(key, value);
      });
    }
    return httpParams;
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => error);
  }

  private HandleResponse(response: any) {
    if (response.Status === 500) {
      alert(RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
    }
  }
}

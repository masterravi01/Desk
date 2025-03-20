import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MasterService } from './master.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDetailsService {
  private searchSubject = new Subject<{
    materialGrade: string;
    customerId: string;
  }>();

  constructor(private masterService: MasterService) {}

  searchInvoiceDetails(
    materialGrade: string,
    customerId: string
  ): Observable<any> {
    return this.masterService.invoke('getInvoiceDetails', {
      materialGrade,
      customerId,
    });
  }

  setSearchParams(params: { materialGrade: string; customerId: string }) {
    this.searchSubject.next(params);
  }

  getSearchResults() {
    return this.searchSubject.pipe(
      debounceTime(500), // 500ms debounce time
      distinctUntilChanged(
        (prev, curr) =>
          prev.materialGrade === curr.materialGrade &&
          prev.customerId === curr.customerId
      ),
      switchMap((params) =>
        this.searchInvoiceDetails(params.materialGrade, params.customerId)
      )
    );
  }
}

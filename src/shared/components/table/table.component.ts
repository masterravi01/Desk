import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CamelCaseToTitlePipe } from '../../pipes/camel-case-to-title.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    TitleCasePipe,
    CamelCaseToTitlePipe,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() displayedColumns: string[] = [];
  @Output() rowClick = new EventEmitter<any>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tableHeaders: any = {
    BID: 'ID',
    id: 'ID',
    bottomNoteId: 'ID',
  };

  ngOnInit() {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<any>([]);
    }

    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = Object.keys(data)
        .map((key) => this.getNestedValue(data, key))
        .join(' ')
        .toLowerCase();

      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource'] && this.dataSource) {
      this.setupSortingAccessor();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  setupSortingAccessor() {
    if (this.dataSource) {
      this.dataSource.sortingDataAccessor = (item, property) => {
        const value = item[property];
        if (value == null) return '';
        if (typeof value === 'string') return value.toLowerCase();
        if (value instanceof Date) return value.getTime();
        if (typeof value === 'boolean') return value ? 1 : 0;
        return value;
      };
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(
    value: any[],
    sortBy: string,
    order: 'asc' | 'desc' = 'asc'
  ): any[] {
    if (!value || !sortBy) return value;
    return value.sort((a, b) => {
      const A = a[sortBy];
      const B = b[sortBy];
      if (A < B) return order === 'asc' ? -1 : 1;
      if (A > B) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

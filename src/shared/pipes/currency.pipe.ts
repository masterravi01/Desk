import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, currencySymbol: string = '$'): string {
    if (value == null) return '';
    return `${currencySymbol}${value.toFixed(2)}`;
  }
}

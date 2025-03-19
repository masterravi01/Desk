import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToTitle',
  standalone: true,
})
export class CamelCaseToTitlePipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    // Insert space before capital letters and capitalize the first letter
    return value
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, (str: string) => str.toUpperCase()) // Capitalize the first letter
      .trim(); // Trim any extra spaces
  }
}

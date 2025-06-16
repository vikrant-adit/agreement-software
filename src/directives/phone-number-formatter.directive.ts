import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneNumberFormatter]',
  standalone:true
})
export class PhoneNumberFormatterDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const cleaned = value.replace(/\D+/g, ''); // Remove non-numeric characters
    const formatted = cleaned.replace(
      /^(\d{0,3})(\d{0,3})(\d{0,4}).*/,
      (match, p1, p2, p3) => {
        let result = '';
        if (p1) result += `(${p1}`;
        if (p2) result += `) ${p2}`;
        if (p3) result += `-${p3}`;
        return result;
      }
    );
    this.ngControl.control?.setValue(formatted, { emitEvent: false });
  }
}
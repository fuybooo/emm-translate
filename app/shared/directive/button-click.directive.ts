import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({selector: '[appButtonClick]'})
export class ButtonClickDirective {
  @Input() disableTime = 2000;
  @HostListener('click') onClick() {
    this.elementRef.nativeElement.disabled = true;
    setTimeout(() => {
      this.elementRef.nativeElement.disabled = false;
    }, this.disableTime);
  }
  constructor(private elementRef: ElementRef) {}
}

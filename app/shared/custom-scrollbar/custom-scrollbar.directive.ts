import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
declare let $: any;

/**
 * 滚动条
 */
@Directive({
  selector: '[appCustomScrollbar]'
})
export class CustomScrollbarDirective implements AfterViewInit, OnDestroy {
  defaultOptions: any = {
    axis: 'y',
    theme: 'minimal-dark',
    autoDraggerLength: true,
    scrollInertia: 100
  };
  @Input() options: any;
  @Output()
  onViewInit = new EventEmitter();
  private scrollbarInstance: any;
  constructor(private elementRef: ElementRef) {
  }
  ngAfterViewInit() {
    this.options = Object.assign(this.defaultOptions, this.options);
    this.createScrollbar();
  }
  createScrollbar() {
    this.scrollbarInstance = $(this.elementRef.nativeElement).mCustomScrollbar(this.options);
    this.onViewInit.emit(this.scrollbarInstance);
  }
  ngOnDestroy() {
    // TODO 使用销毁函数会导致一些意外的错误 2017-12-15
    // if (this.scrollbarInstance) {
    //   this.scrollbarInstance.mCustomScrollbar("destroy");
    // }
  }
  getScrollbarInstance() {
    return this.scrollbarInstance;
  }
}

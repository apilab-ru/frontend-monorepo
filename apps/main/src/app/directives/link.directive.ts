import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appLink]',
})
export class LinkDirective implements OnChanges, AfterViewInit {
  @Input() appLink: string;
  @Output() linkClick = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const link = this.elementRef.nativeElement.querySelector('a');
    if (!link) {
      return;
    }

    link.href = this.appLink;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const link = this.elementRef.nativeElement.querySelector('a')!;

      link.onclick = (event) => {
        event.preventDefault();
        this.linkClick.emit();
      };

      if (this.appLink) {
        link.href = this.appLink;
      }
    })
  }

}

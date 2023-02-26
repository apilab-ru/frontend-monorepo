import { Directive, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Directive({
  standalone: true,
  selector: '[filecabLayoutTopSlot]',
})
export class LayoutTopSlotDirective implements OnInit, OnDestroy {
  @Input() appLayoutTopSlot: TemplateRef<any>;

  constructor(
    private layoutService: LayoutService,
    private elementRef: TemplateRef<HTMLElement>,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.layoutService.setSubMenuTemplate(this.elementRef);
    })
  }

  ngOnDestroy(): void {
    this.layoutService.setSubMenuTemplate(null);
  }

}

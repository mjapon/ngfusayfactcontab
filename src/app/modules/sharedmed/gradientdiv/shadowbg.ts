import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appShadowBg]'
})
export class GradientShadowBgDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.renderer.removeClass(this.el.nativeElement, 'shadow-sm');
        this.renderer.addClass(this.el.nativeElement, 'shadow-lg');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.renderer.removeClass(this.el.nativeElement, 'shadow-lg');
        this.renderer.addClass(this.el.nativeElement, 'shadow-sm');
    }

}

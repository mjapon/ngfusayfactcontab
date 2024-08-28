import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appAnimIco]'
})
export class AnimIcoDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.renderer.removeClass(this.el.nativeElement, 'fa-bounce');
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.renderer.addClass(this.el.nativeElement, 'fa-bounce');
    }

}

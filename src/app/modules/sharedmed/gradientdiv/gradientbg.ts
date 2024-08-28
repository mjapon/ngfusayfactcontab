import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appGradientBg]'
})
export class GradientBgDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.renderer.removeStyle(this.el.nativeElement, 'background');
        this.renderer.addClass(this.el.nativeElement, 'btnmenuout');
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.el.nativeElement.style.background =
            `radial-gradient(circle at ${x}px ${y}px, #9f0158, #000000)`;
    }

}

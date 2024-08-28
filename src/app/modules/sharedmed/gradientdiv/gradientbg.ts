import {ContentChildren, Directive, ElementRef, HostListener, QueryList, Renderer2, ViewChild} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appGradientBg]'
})
export class GradientBgDirective {

    @ContentChildren('thespan', { read: ElementRef, descendants:true }) spans: QueryList<ElementRef>;


    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.renderer.removeStyle(this.el.nativeElement, 'background');
        this.renderer.addClass(this.el.nativeElement, 'btnmenuout');
        if (this.spans && this.spans.first){
            this.renderer.removeClass(this.spans.get(0).nativeElement, 'fa-bounce');
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (this.spans && this.spans.first){
            this.renderer.addClass(this.spans.get(0).nativeElement, 'fa-bounce');
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.el.nativeElement.style.background =
            `radial-gradient(circle at ${x}px ${y}px, #D81F5E, #9C2164)`;
    }

}

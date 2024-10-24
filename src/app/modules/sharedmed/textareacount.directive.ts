import {Directive, ElementRef, HostListener, Input, Renderer2, OnInit} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appCharacterCount]'
})
export class CharacterCountDirective implements OnInit {
    @Input() maxlength: number;
    private counterElement: HTMLElement;

    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        this.createCounterElement();
        this.updateCounter();
    }

    @HostListener('input') onInput() {
        this.updateCounter();
    }

    private createCounterElement() {
        this.counterElement = this.renderer.createElement('div');
        this.renderer.setAttribute(this.counterElement, 'class', 'div-textarea-count');
        this.renderer.appendChild(this.el.nativeElement.parentElement, this.counterElement);
    }

    private updateCounter() {
        const currentLength = this.el.nativeElement.value.length;
        this.renderer.setProperty(this.counterElement, 'textContent', `${currentLength}/${this.maxlength}`);

        if (currentLength >= this.maxlength) {
            this.renderer.setAttribute(this.counterElement, 'class', 'div-textarea-count-max');
        } else {
            this.renderer.setAttribute(this.counterElement, 'class', 'div-textarea-count');
        }
    }
}

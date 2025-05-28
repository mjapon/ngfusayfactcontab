import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';

declare var bootstrap: any;

@Directive({
    selector: '[appBsTooltip]',
    standalone: true
})
export class BsTooltipDirective implements OnInit, OnDestroy {
    @Input('appBsTooltip') tooltipText = '';
    @Input() tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
    @Input() tooltipTrigger = 'hover focus';
    @Input() tooltipDelay = '100';
    @Input() tooltipHtml = false;
    @Input() tooltipAnimation = true;

    private tooltipInstance: any;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        this.initializeTooltip();
    }

    ngOnDestroy() {
        this.destroyTooltip();
    }

    private initializeTooltip() {
        if (!this.tooltipText) {
            return;
        }

        // Configurar atributos de Bootstrap para el tooltip
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', 'tooltip');
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-title', this.tooltipText);
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-placement', this.tooltipPlacement);
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-trigger', this.tooltipTrigger);

        const delay = parseInt(this.tooltipDelay, 10);
        if (delay > 0) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-delay', delay.toString());
        }

        if (this.tooltipHtml) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-html', 'true');
        }

        if (!this.tooltipAnimation) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-animation', 'false');
        }

        // Inicializar el tooltip de Bootstrap
        this.tooltipInstance = new bootstrap.Tooltip(this.elementRef.nativeElement, {
            title: this.tooltipText,
            placement: this.tooltipPlacement,
            trigger: this.tooltipTrigger,
            delay,
            html: this.tooltipHtml,
            animation: this.tooltipAnimation
        });

        const element = this.elementRef.nativeElement;
        this.renderer.listen(element, 'mouseleave', () => {
            if (this.tooltipInstance && this.isVisible()) {
                this.tooltipInstance.hide();
            }
        });
    }

    isVisible(): boolean {
        if (!this.tooltipInstance) {
            return false;
        }
        const tooltipElement = document.querySelector('.tooltip.show');
        return !!tooltipElement;
    }

    private destroyTooltip() {
        if (this.tooltipInstance) {
            this.tooltipInstance.dispose();
            this.tooltipInstance = null;
        }
    }
}

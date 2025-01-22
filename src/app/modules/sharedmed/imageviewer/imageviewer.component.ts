import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild
} from '@angular/core';

// import {document} from 'ngx-bootstrap/utils';


@Component({
    selector: 'app-imageviewer',
    templateUrl: './imageviewer.component.html',
    styleUrls: ['./imageviewer.component.scss']
})
export class ImageviewerComponent implements AfterViewInit {

    @Input() images: Array<string> = [];

    @Input()
    index = 0;

    @Input()
    display = false;
    @Output() displayChange = new EventEmitter<boolean>();

    private scale = 1;

    private zoomFactor = 0.1;

    public fullscreen = false;

    public style: any = {transform: '', msTransform: '', oTransform: '', webkitTransform: ''};

    loading = false;

    private MAX_ZOOM = 1.8;
    private MIN_ZOMM = 0.4;

    @ViewChild('imgElement') imgElement!: ElementRef;
    offsetX = 0;
    offsetY = 0;
    startOffsetX = null;
    startOffsetY = null;
    isDragging = false;
    isSetOffset = false;

    rotation = 0;

    ngAfterViewInit(): void {
        this.isSetOffset = false;
    }

    // Método que se ejecuta al presionar el mouse (mousedown)
    onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        const img = this.imgElement.nativeElement;
        this.offsetX = event.clientX - img.offsetLeft;
        this.offsetY = event.clientY - img.offsetTop;
        this.style.cursor = 'grabbing';

        if (!this.isSetOffset) {
            this.startOffsetX = img.offsetLeft;
            this.startOffsetY = img.offsetTop;
            this.isSetOffset = true;
        }
        // Agregar listener para prevenir el comportamiento por defecto del navegador
        document.addEventListener('dragstart', this.preventDefaultBehavior);
    }

    // Método que se ejecuta al mover el mouse (mousemove)
    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.isDragging) {
            this.style.left = (event.clientX - this.offsetX) + 'px';
            this.style.top = (event.clientY - this.offsetY) + 'px';
        }
    }

    // Método que se ejecuta al soltar el mouse (mouseup)
    @HostListener('document:mouseup')
    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.style.cursor = 'grab';
            document.removeEventListener('dragstart', this.preventDefaultBehavior);
        }
    }

    // Función para evitar el comportamiento por defecto del navegador
    preventDefaultBehavior(event: Event) {
        event.preventDefault();
    }

    zoomIn() {
        if (this.scale <= this.MAX_ZOOM) {
            this.scale = this.scale * (1 + this.zoomFactor);
            console.log('zoomIn->Escala es:', this.scale);
            this.updateStyle();
        }
    }

    zoomOut() {
        if (this.scale > this.MIN_ZOMM) {
            this.scale = this.scale / (1 + this.zoomFactor);
            console.log('zoomOut->Escala es:', this.scale);
            this.updateStyle();
        }
    }

    rotateClockwise() {
        this.rotation += 90;
        this.updateStyle();
    }

    rotateCounterClockwise() {
        this.rotation -= 90;
        this.updateStyle();
    }

    private updateStyle() {
        this.style.transform = `rotate(${this.rotation}deg) scale(${this.scale})`;
        this.style.msTransform = this.style.transform;
        this.style.webkitTransform = this.style.transform;
        this.style.oTransform = this.style.transform;

        console.log('Se ejecutó update style');
    }

    reset() {
        this.scale = 1;
        this.rotation = 0;
        if (this.startOffsetX !== null) {
            this.style.left = (this.startOffsetX) + 'px';
        }
        if (this.startOffsetY !== null) {
            this.style.top = (this.startOffsetY) + 'px';
        }
        // this.translateX = 0;
        // this.translateY = 0;
        this.updateStyle();
    }

    toggleFullscreen() {
        this.fullscreen = !this.fullscreen;
        if (!this.fullscreen) {
            this.reset();
        }
    }

    @HostListener('window:keyup.ArrowRight', ['$event'])
    nextImage(event) {
        if (this.index < this.images.length - 1) {
            this.loading = true;
            this.index++;
            this.reset();
        }
    }

    @HostListener('window:keyup.ArrowLeft', ['$event'])
    prevImage(event) {
        if (this.index > 0) {
            this.loading = true;
            this.index--;
            this.reset();
        }
    }

    close() {
        this.display = false;
        this.reset();
        this.displayChange.emit(false);
    }

}

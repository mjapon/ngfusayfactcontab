import {DomSanitizer} from '@angular/platform-browser';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-marklabel',
    template: '<div  class="mlabel" [innerHTML]="content"></div>',
    standalone: true,
    styleUrls: ['./marklabel.component.scss']
})
export class MarklabelComponent implements OnChanges, OnInit {
    @Input() searchTerm = '';
    @Input() label: string = null;

    content: any;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        if (this.label) {
            this.content = this.label;
            this.marc();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.catalogue && changes.catalogue.currentValue) {
            this.content = this.label;
        }
        if (changes.searchTerm) {
            this.marc();
        }
    }

    getFilters(items) {
        return items.map((item, index) => index === 0 ? `^${item}|\\s+${item}` : `\\s+${item}`)
            .join('|');
    }

    marc() {
        const filterlengt = this.searchTerm.trim().length;
        if (filterlengt > 0) {
            let palabras = this.getFilters(this.searchTerm.split(/\s+/));

            if (filterlengt <= 4) {
                const iniciales = this.getFilters(this.searchTerm.split(''));
                if (iniciales) {
                    palabras = `${palabras}|${iniciales}`;
                }
            }
            const regex = new RegExp(palabras, 'gi');
            const text = this.label;
            const newText = text.replace(regex, (match: string) => `<span style="background-color: yellow">${match}</span>`);
            this.content = this.sanitizer.bypassSecurityTrustHtml(
                newText
            );
        }

    }

}

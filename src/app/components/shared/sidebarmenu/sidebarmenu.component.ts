import {Component, HostListener, OnInit} from '@angular/core';
import {FautService} from '../../../services/faut.service';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-sidebarmenu',
    styles: [
            `.fondo {
            width: 100%;
            background: #1C75BC;
            color: white;
            height: 100%;
        }

        .textsm {
            font-size: 11px !important;
        }

        .menumavil {
            padding: 10px 5px;
            border-bottom: 1px solid white;
        }

        .menumavil:hover {
            color: #1C75BC;
            background: white;
        }

        .menuitemmavil {
            background: #1C75BC;
            color: white;
        }

        .menuitemmavil:hover {
            background: #1D76BB;
        }

        .menupopup {
            position: fixed;
            z-index: 1010;
            width: 18rem;
            height: 100%;
            display: none;
        }
        `],
    template: `
        <div class="card menupopup" id="popupmenumj" *ngIf="isShowPopupMenu" [style]="popupstyle">
            <ul class="list-group list-group-flush">
                <li class="list-group-item hand menuitemmavil" *ngFor="let mi of menuItems"
                    (click)="gotostate(mi, $event)">
                    <i [ngClass]="mi.icon"></i><span>{{mi.label}}</span></li>
            </ul>
        </div>

        <div>
            <div class="text-center hand border shadow pt-2 pb-2" (click)="gotohome()" title="Inicio">
                <img src="/assets/imgs/logomavilsm.png" alt="Mavil">
                <span class="textsm ml-1">Mavil</span>
            </div>
        </div>

        <div class="fondo border shadow" id="globalsidebarmenu">
            <ng-container *ngFor="let mi of menuApp; let i=index ">
                <div class="menumavil noselect hand d-flex flex-column text-center" [title]="mi.label"
                     (click)="showPopup($event, mi)" (contextmenu)="showPopup($event, mi)"
                     id="mjdivmenu_{{i}}">
                    <i [ngClass]="mi.cicon" id="mjiconmenu_{{i}}"></i>
                    <span class="textsm" id="mjtextmenu_{{i}}">{{mi.label}}</span>
                </div>
            </ng-container>
        </div>
    `
})
export class SidebarmenuComponent implements OnInit {

    menuApp: Array<any>;
    menuItems: MenuItem[];
    isShowPopupMenu: boolean;
    mousestate: number;
    popupstyle: any;


    constructor(private fautService: FautService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        const menuApp = this.fautService.getMenuApp();
        if (menuApp) {
            this.menuApp = menuApp;
        }

        this.fautService.source.subscribe(msg => {
            if (msg === 'updateSecciones') {

            } else if (msg === 'loadmenu') {
                const menu = this.fautService.getMenuApp();
                if (menu) {
                    this.menuApp = menu;
                }
            }
        });
        this.isShowPopupMenu = false;
        this.mousestate = 0;
        this.popupstyle = {};
        this.isShowPopupMenu = true;
    }


    showPopup($event: MouseEvent, mi: any) {
        if (mi.items.length === 1) {
            this.gotostate(mi.items[0], $event);
        } else {
            const miheight = 36 * mi.items.length;
            $event.preventDefault();
            this.isShowPopupMenu = true;
            this.menuItems = mi.items;
            const offset = $($event.target).offset();
            offset.top += 20;
            offset.left += 1;
            this.mousestate = 1;
            this.popupstyle = {
                top: `${offset.top}px`,
                left: `${offset.left}px`,
                display: 'inline',
                height: `${miheight}px`
            };
        }
    }

    gotostate(mi: any, $event: Event) {
        this.popupstyle.display = 'none';
        this.isShowPopupMenu = false;
        if (mi.routerLink) {
            this.router.navigate(mi.routerLink);
        }
    }

    gotohome() {
        this.router.navigate(['lghome']);
    }

    @HostListener('document:click', ['$event.target'])
    clickedOut(target) {
        let hide = true;
        if (target.id) {
            const theid = target.id;
            const re = /^mjdivmenu_|mjiconmenu_|mjtextmenu_/;
            hide = !re.test(theid);
        }
        if (hide) {
            this.isShowPopupMenu = false;
            this.popupstyle.display = 'none';
        }
    }

    @HostListener('window:keyup', ['$event'])
    scape(ev) {
        if (this.popupstyle.display !== 'none' && ev.code === 'Escape') {
            this.isShowPopupMenu = false;
            this.popupstyle.display = 'none';
        }
    }
}

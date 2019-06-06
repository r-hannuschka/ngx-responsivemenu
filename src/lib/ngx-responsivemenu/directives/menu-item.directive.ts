import { Directive, ElementRef, AfterViewInit, HostBinding, Input, ViewContainerRef, Renderer2 } from "@angular/core";

@Directive( {
    selector: "[ngxResponsiveMenuItem]"
} )
export class MenuItemDirective implements AfterViewInit {

    private domElRef: HTMLElement;

    @Input()
    public visible = true;

    @HostBinding( "class.responsive-menu--item" )
    public className = true;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    ngAfterViewInit() {
        this.domElRef = this.el.nativeElement;
    }

    public addTo( parent: HTMLElement, before: HTMLElement = null ) {
        if (before) {
            this.renderer.insertBefore(parent, this.el.nativeElement, before);
            return;
        }
        this.renderer.appendChild(parent, this.el.nativeElement);
    }

    public remove() {
        const root: HTMLElement = this.renderer.parentNode( this.el.nativeElement );
        this.renderer.removeChild( root, this.el.nativeElement );
    }

    public get nativeElement(): HTMLElement {
        return this.domElRef;
    }

    public get bounds(): DOMRect {
        return this.domElRef.getBoundingClientRect() as DOMRect;
    }
}

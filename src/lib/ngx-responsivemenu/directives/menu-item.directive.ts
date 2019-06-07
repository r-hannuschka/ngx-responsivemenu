import { Directive, ElementRef, HostBinding, Input, Renderer2 } from "@angular/core";

@Directive( {
    selector: "[ngxResponsiveMenuItem]"
} )
export class MenuItemDirective  {

    @Input()
    public visible = true;

    @HostBinding( "class.responsive-menu--item" )
    public className = true;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

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
}

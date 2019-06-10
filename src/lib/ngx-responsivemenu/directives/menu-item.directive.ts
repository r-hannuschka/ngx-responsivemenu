import { Directive, ElementRef, HostBinding, Input, Renderer2 } from "@angular/core";

/**
 * registers item as responsive menu item, all other content will not rendered
 *
 * @example
 *
 * <ngx-responsivemenu>
 *     <button type="button" ngxResponsiveMenuItem>Button 1</button>
 *     <button type="button" ngxResponsiveMenuItem>Button 2</button>
 *     <button type="button" ngxResponsiveMenuItem>Button 3</button>
 *     <!-- this button will not rendered anymore since ngxResponsiveMenuItem is missing -->
 *     <button type="button">Not rendering</button>
 * </ngx-responsivemenu>
 */
@Directive( {
    selector: "[ngxResponsiveMenuItem]"
} )
export class MenuItemDirective  {

    /**
     * if set to false menu item will allways rendered to overflow
     * default false
     */
    @Input()
    public visible = true;

    @HostBinding( "class.responsive-menu--item" )
    public className = true;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    /**
     * add item to parent element
     *
     * @example
     *
     * const parent: ElementRef = this.el;
     * const item: MenuItemDirective = this.menuItem;
     * item.addTo(this.el.nativeElement);
     */
    public addTo( parent: HTMLElement, before: HTMLElement = null ) {
        if (before) {
            this.renderer.insertBefore(parent, this.el.nativeElement, before);
            return;
        }
        this.renderer.appendChild(parent, this.el.nativeElement);
    }

    /**
     * remove item from parent children
     *
     * @example
     *
     * const item: MenuItemDirective = this.menuItem;
     * item.remove();
     */
    public remove() {
        const root: HTMLElement = this.renderer.parentNode( this.el.nativeElement );
        this.renderer.removeChild( root, this.el.nativeElement );
    }
}

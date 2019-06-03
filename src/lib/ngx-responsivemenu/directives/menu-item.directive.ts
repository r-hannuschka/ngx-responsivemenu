import { Directive, ElementRef, AfterViewInit, HostBinding, Input } from "@angular/core";

@Directive( {
    selector: "[ngxResponsiveMenuItem]"
} )
export class MenuItemDirective implements AfterViewInit {

    private domElRef: HTMLElement;

    @Input()
    public visible = true;

    @HostBinding( "class" )
    public className = "responsive-menu--item";

    constructor(
        private el: ElementRef
    ) { }

    ngAfterViewInit() {
        this.domElRef = this.el.nativeElement;
    }

    public get nativeElement(): HTMLElement {
        return this.domElRef;
    }

    public get bounds(): DOMRect {
        return this.domElRef.getBoundingClientRect() as DOMRect;
    }

    public get width(): number {
        const width = this.bounds.width;
        const style = getComputedStyle( this.domElRef );

        const marginLeft = parseInt( style.getPropertyValue( "margin-left" ), 10 );
        const marginRight = parseInt( style.getPropertyValue( "margin-right" ), 10 );

        return width + marginLeft + marginRight;
    }
}

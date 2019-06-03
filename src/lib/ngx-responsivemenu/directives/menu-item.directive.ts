import { Directive, ElementRef, AfterViewInit, HostBinding, Input } from "@angular/core";

@Directive( {
    selector: "[ngxResponsiveMenuItem]"
} )
export class MenuItemDirective implements AfterViewInit {

    private domElRef: HTMLElement;

    @Input()
    public visible = true;

    @HostBinding("class.responsive-menu--item")
    public className = true;

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

}

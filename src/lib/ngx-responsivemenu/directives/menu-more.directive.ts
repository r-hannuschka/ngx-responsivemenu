import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy, Renderer2, HostBinding, Input } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { OverflowControl } from "../provider/overflow.control";

export enum BtnAlign {
    LEFT = "left",
    RIGHT = "right"
}

/**
 * more button which automatically registers on click event an show overflow if required
 *
 * @example
 *
 * <ngx-responsivemenu>
 *     ...
 *     <button ngxResponsiveMenuMore [OPTIONS...]></button>
 * </ngx-responsivemenu>
 */
@Directive( {
    selector: "[ngxResponsiveMenuMore]"
} )
export class MenuItemMoreDirective implements AfterViewInit, OnDestroy {

    private click$: Subscription;

    /**
     * add host css class <b>more</b>
     */
    @HostBinding("class.more")
    public className = true;

    /** set position of button */
    @Input()
    public align: BtnAlign = BtnAlign.RIGHT;

    constructor(
        private overflowCtrl: OverflowControl,
        private renderer: Renderer2,
        private el: ElementRef,
    ) {
    }

    public ngAfterViewInit() {
        this.click$ = fromEvent(this.el.nativeElement, "click")
            .subscribe(() => this.openOverflow());
    }

    /**
     * return native element from more button
     */
    public get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }

    /**
     * display button if soft is true button has css property visibilty: hidden
     */
    public show(soft = false) {
        this.setVisible(soft);
        this.setDisplay();
    }

    /**
     * hide button (display none)
     */
    public hide() {
        this.setVisible();
        this.setDisplay(true);
    }

    /**
     * destroys button
     */
    public ngOnDestroy() {
        this.click$.unsubscribe();
    }

    private setVisible(hidden = false) {
        this.renderer.setStyle(this.el.nativeElement, "visibility", hidden ? "hidden" : null);
    }

    private setDisplay(hidden = false) {
        this.renderer.setStyle(this.el.nativeElement, "display", hidden ? "none" : null);
    }

    /**
     * get current width of button includes margin
     */
    public get width(): number {

        const width = this.el.nativeElement.getBoundingClientRect().width;
        const style = getComputedStyle( this.el.nativeElement );

        const marginLeft  = parseInt(style.getPropertyValue("margin-left") , 10);
        const marginRight = parseInt(style.getPropertyValue("margin-right"), 10);

        return width + marginLeft + marginRight;
    }

    /**
     * if we click on the button we want to open the overlay
     */
    private openOverflow() {
        this.overflowCtrl.isOpen() ? this.overflowCtrl.close() : this.overflowCtrl.open();
    }
}

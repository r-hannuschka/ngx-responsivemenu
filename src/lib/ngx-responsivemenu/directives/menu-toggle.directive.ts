import { Directive, ElementRef, AfterViewInit, OnDestroy, Renderer2, HostBinding } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { OverflowControl } from "../provider/overflow.control";
import { takeUntil } from "rxjs/operators";

/**
 * toggle button which automatically registers on click event an show overflow if required
 *
 * @example
 *
 * <ngx-responsivemenu>
 *     ...
 *     <button ngxResponsiveMenuToggle>Custom Toggle Button</button>
 * </ngx-responsivemenu>
 */
@Directive( {
    selector: "[ngxResponsiveMenuToggle]"
} )
export class MenuToggleDirective implements AfterViewInit, OnDestroy {

    private isDestroyed: Subject<boolean>;

    /**
     * add host css class <b>more</b>
     */
    @HostBinding("class.more")
    public className = true;

    constructor(
        private overflowCtrl: OverflowControl,
        private renderer: Renderer2,
        private el: ElementRef,
    ) {
        this.isDestroyed = new Subject();
    }

    public ngAfterViewInit() {
        fromEvent(this.el.nativeElement, "click")
            .pipe(takeUntil(this.isDestroyed))
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
        this.isDestroyed.next(true);
        this.isDestroyed.complete();
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

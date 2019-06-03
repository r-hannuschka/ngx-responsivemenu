import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewContainerRef, Renderer2, HostBinding } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { MenuItemDirective } from "./menu-item.directive";
import { OverflowControl } from "../provider/overflow.control";

@Directive( {
    selector: "[ngxResponsiveMenuMore]"
} )
export class MenuItemMoreDirective extends MenuItemDirective implements AfterViewInit, OnDestroy {

    private click$: Subscription;

    @HostBinding("class.more")
    public className = true;

    constructor(
        private overflowCtrl: OverflowControl,
        private renderer: Renderer2,
        el: ElementRef,
    ) {
        super(el);
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.click$ = fromEvent(this.nativeElement, "click")
            .subscribe(() => this.openOverflow());
    }

    public show(soft = false) {
        this.setVisible(soft);
        this.setDisplay();
    }

    public hide() {
        this.setVisible();
        this.setDisplay(true);
    }

    public ngOnDestroy() {
        this.click$.unsubscribe();
    }

    private setVisible(hidden = false) {
        this.renderer.setStyle(this.nativeElement, "visibility", hidden ? "hidden" : null);
    }

    private setDisplay(hidden = false) {
        this.renderer.setStyle(this.nativeElement, "display", hidden ? "none" : null);
    }

    public get width(): number {

        const width = this.bounds.width;
        const style = getComputedStyle( this.nativeElement );

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

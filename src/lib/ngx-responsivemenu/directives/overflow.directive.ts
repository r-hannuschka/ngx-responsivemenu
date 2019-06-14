import { Directive, OnInit, OnDestroy, Output, EventEmitter, Renderer2, ElementRef } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, filter, tap } from "rxjs/operators";
import { OverflowControl } from "../provider/overflow.control";
import { MenuItemDirective } from "./menu-item.directive";
import { AsyncEvent } from "../provider/async-event";

/**
 * renders overflow content if overflow items exists
 *
 * @example
 *
 * <div class="menu">
 *   <!-- append option [customOverflow]=true so default overflow container will not rendered anymore -->
 *   <ngx-responsivemenu [customOverflow]="true">
 *     <button ngxResponsiveMenuItem *ngFor="let btn of buttons"></button>
 *   </ngx-responsivemenu>
 * </div>
 *
 * <div class="sidebar">
 *   <!-- overflow content will rendered here -->
 *   <ngx-responsivemenu-overflow [...EVENTS]></ngx-responsivemenu-overflow>
 * </div>
 */
@Directive( {
    selector: "ngx-responsivemenu-overflow"
})
export class OverflowContentDirective implements OnInit, OnDestroy {

    /**
     * overflow container render hook before content will be applied.
     * Emits AsyncEvent which should notfied with $event.done() after
     * all operations are completed
     */
    @Output()
    public beforeRender: EventEmitter<AsyncEvent> = new EventEmitter();

    /**
     * overflow container render hook after content has been applied.
     */
    @Output()
    public afterRender: EventEmitter<void> = new EventEmitter();

    /**
     * overflow container render hook before content will be removed.
     * Emits AsyncEvent which should notfied with $event.done() after
     * all operations are completed
     */
    @Output()
    public beforeRemove: EventEmitter<AsyncEvent> = new EventEmitter();

    /**
     * overflow container render hook after content has been removed.
     */
    @Output()
    public afterRemove: EventEmitter<void> = new EventEmitter();

    private isDestroyed: Subject<boolean>;

    constructor(
        private el: ElementRef,
        private overflowCtrl: OverflowControl,
        private renderer: Renderer2,
    ) {
        this.isDestroyed = new Subject();
    }

    public ngOnDestroy() {
        this.isDestroyed.next(true);
        this.isDestroyed.complete();
    }

    public ngOnInit() {
        if (this.overflowCtrl.isOpen()) {
            this.renderContent(this.overflowCtrl.data.items);
        }

        this.registerShowEvent();
        this.registerHideEvent();
    }

    /**
     * subscribe to overflowctrl show observeable
     * only renders content if items exists
     */
    private registerShowEvent() {
        this.overflowCtrl.show.pipe(
            takeUntil(this.isDestroyed),
            filter((items) => items.length > 0),
        ).subscribe((items) => this.renderContent(items));
    }

    /**
     * subscribe to overflowctrl hide observeable
     * remove content from directive
     */
    private registerHideEvent() {
        this.overflowCtrl.hide
            .pipe(takeUntil(this.isDestroyed))
            .subscribe((items) => this.removeContent(items));
    }

    /**
     * render nodes into host view, calls beforeRender and afterRender hooks
     */
    private async renderContent(nodes: MenuItemDirective[]) {

        this.renderer.setStyle(this.el.nativeElement, "display", null);
        if (this.beforeRender.observers.length) {
            const event = new AsyncEvent();
            this.beforeRender.emit(event);
            await event.completed;
        }
        nodes.forEach((item) => item.addTo(this.el.nativeElement));
        this.afterRender.emit();
    }

    /**
     * remove nodes from host view, calls beforeRemove, afterRemove
     */
    private async removeContent(nodes: MenuItemDirective[]) {
        if (this.beforeRemove.observers.length) {
            const event = new AsyncEvent();
            this.beforeRemove.emit(event);
            await event.completed;
        }

        nodes.forEach((item) => item.remove());

        this.afterRemove.emit();
        this.renderer.setStyle(this.el.nativeElement, "display", "none");
    }
}

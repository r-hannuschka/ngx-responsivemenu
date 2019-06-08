import { Directive, ViewContainerRef, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { OverflowControl } from "../provider/overflow.control";
import { MenuItemDirective } from "./menu-item.directive";
import { AsyncEvent } from "../provider/async-event";

@Directive( {
    selector: "ngx-responsivemenu-content",
} )
export class OverflowContentDirective implements OnInit, OnDestroy {

    @Output()
    public beforeRender: EventEmitter<AsyncEvent> = new EventEmitter();

    @Output()
    public afterRender: EventEmitter<void> = new EventEmitter();

    @Output()
    public beforeRemove: EventEmitter<AsyncEvent> = new EventEmitter();

    @Output()
    public afterRemove: EventEmitter<void> = new EventEmitter();

    private isDestroyed: Subject<boolean>;

    constructor(
        private viewRef: ViewContainerRef,
        private overflowCtrl: OverflowControl
    ) {
        this.isDestroyed = new Subject();
    }

    public get view(): ViewContainerRef {
        return this.viewRef;
    }

    public ngOnDestroy() {
        this.isDestroyed.next(true);
        this.isDestroyed.complete();
    }

    public ngOnInit() {

        this.overflowCtrl.show
            .pipe(
                takeUntil(this.isDestroyed),
                filter((items) => items.length > 0),
            ).subscribe((items) => this.renderContent(items));

        this.overflowCtrl.hide
            .pipe(
                takeUntil(this.isDestroyed),
            ).subscribe((items) => this.removeContent(items));
    }

    /**
     * render nodes into host view calls beforeRendered and afterRender hooks
     * will call beforeRender and afterRender hooks
     */
    private async renderContent(nodes: MenuItemDirective[]) {

        if (this.beforeRender.observers.length) {
            const event = new AsyncEvent();
            this.beforeRender.emit(event);
            await event.completed;
        }

        nodes.forEach((item) => item.addTo(this.viewRef.element.nativeElement));
        this.afterRender.emit();
    }

    /**
     * remove content from overflow container, will call beforeRemove and afterRemove hooks
     */
    private async removeContent(nodes: MenuItemDirective[]) {

        if (this.beforeRemove.observers.length) {
            const event = new AsyncEvent();
            this.beforeRemove.emit(event);
            await event.completed;
        }

        nodes.forEach((item) => item.remove());
        this.afterRemove.emit();
    }
}

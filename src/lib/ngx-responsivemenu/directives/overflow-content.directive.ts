import { Directive, ViewContainerRef, OnInit, OnDestroy, Input } from "@angular/core";
import { Subject, of, Observable } from "rxjs";
import { takeUntil, filter, mergeMap, switchMap } from "rxjs/operators";
import { OverflowControl } from "../provider/overflow.control";
import { MenuItemDirective } from "./menu-item.directive";

@Directive( {
    selector: "ngx-responsivemenu-content",
} )
export class OverflowContentDirective implements OnInit, OnDestroy {

    private isDestroyed: Subject<boolean>;

    private renderHooks = {
        afterRemoved: this.noopHook,
        afterRender: this.noopHook,
        beforeRemoved: this.noopHook,
        beforeRender: this.noopHook,
    };

    constructor(
        private viewRef: ViewContainerRef,
        private overflowCtrl: OverflowControl
    ) {
        this.isDestroyed = new Subject();
    }

    /**
     * append hook on before content gets rendered into content
     */
    @Input()
    public set beforeRender( hookFn: () => Observable<void> ) {
        this.renderHooks.beforeRender = hookFn;
    }

    /**
     * append hook after content gets rendered into content
     */
    @Input()
    public set afterRender( hookFn: () => Observable<void> ) {
        this.renderHooks.afterRender = hookFn;
    }

    /**
     * append hook before content gets removed
     */
    @Input()
    public set beforeRemoved( hookFn: () => Observable<void> ) {
        this.renderHooks.beforeRemoved = hookFn;
    }

    /**
     * append hook after content gets removed
     */
    @Input()
    public set afterRemoved( hookFn: () => Observable<void> ) {
        this.renderHooks.afterRemoved = hookFn;
    }

    public get view(): ViewContainerRef {
        return this.viewRef;
    }

    ngOnDestroy() {
        this.isDestroyed.next(true);
        this.isDestroyed.complete();
    }

    ngOnInit() {
        this.overflowCtrl.show
            .pipe(
                takeUntil(this.isDestroyed),
                filter((items) => items.length > 0),
                switchMap((items) => this.renderContent(items))
            ).subscribe();

        this.overflowCtrl.hide
            .pipe( takeUntil(this.isDestroyed))
            .subscribe((items) => this.removeContent(items));
    }

    /**
     * no operation hook, does nothing but exists (like me)
     */
    private noopHook(): Observable<void> {
        return of( null );
    }

    /**
     * render nodes into host view calls beforeRendered and afterRender hooks
     */
    private renderContent( nodes: MenuItemDirective[] ): Observable<void> {
        return this.renderHooks.beforeRender().pipe(
            switchMap(() => of(nodes.map((item) => item.addTo(this.viewRef.element.nativeElement)))),
            switchMap(() => this.renderHooks.afterRender())
        );
    }

    private removeContent(nodes: MenuItemDirective[]) {
        nodes.forEach(item => {
            item.remove();
        });
    }
}

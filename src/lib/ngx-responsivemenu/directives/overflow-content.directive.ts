import { Directive, ViewContainerRef, Renderer2, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { startWith, takeUntil, filter, tap } from "rxjs/operators";
import { OverflowControl } from "../provider/overflow.control";
import { MenuItemDirective } from "./menu-item.directive";

@Directive({
    selector: "ngx-responsivemenu-content",
})
export class OverflowContentDirective implements OnInit, OnDestroy {

    private isDestroyed: Subject<boolean>;

    constructor(
        private renderer: Renderer2,
        private viewRef: ViewContainerRef,
        private overflowCtrl: OverflowControl
    ) {
        this.isDestroyed = new Subject();
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
                startWith(this.overflowCtrl.data.items),
            )
            .subscribe((items) => this.renderContent(items));
    }

    /** render nodes into host view */
    private renderContent(nodes: MenuItemDirective[]) {
        nodes.forEach(item => {
            this.renderer.appendChild(this.viewRef.element.nativeElement, item.nativeElement);
        });
    }
}

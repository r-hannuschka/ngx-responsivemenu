import { Directive, ViewContainerRef, Renderer2, OnInit } from "@angular/core";
import { OverflowControl } from "../provider/overflow.control";
import { MenuItemDirective } from "./menu-item.directive";

@Directive({
    selector: "ngx-responsivemenu-content",
})
export class OverflowContentDirective implements OnInit {

    constructor(
        private renderer: Renderer2,
        private viewRef: ViewContainerRef,
        private overflowCtrl: OverflowControl
    ) {}

    public get view(): ViewContainerRef {
        return this.viewRef;
    }

    ngOnInit() {
        /** this will render multiple times, not that i want i think */
        this.renderContent(this.overflowCtrl.data.items);
    }

    private renderContent(nodes: MenuItemDirective[]) {

        /** @todo clear before we render new items */
        nodes.forEach(item => {
            this.renderer.appendChild(this.viewRef.element.nativeElement, item.nativeElement);
        });
    }
}

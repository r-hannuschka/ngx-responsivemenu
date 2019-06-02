import { Directive, ViewContainerRef, AfterViewInit, Input, Renderer2, OnInit } from "@angular/core";
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
        const el = this.viewRef.element.nativeElement;

        /** render initial */
        this.renderContent(this.overflowCtrl.data.items);

        this.overflowCtrl.show$.subscribe((items) => {
            this.renderContent(items);
        });
    }

    private renderContent(nodes: MenuItemDirective[]) {
        nodes.forEach(item => {
            this.renderer.appendChild(this.viewRef.element.nativeElement, item.nativeElement);
        });
    }
}

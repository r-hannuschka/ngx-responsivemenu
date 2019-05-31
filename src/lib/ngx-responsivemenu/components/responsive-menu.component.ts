import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    Input,
    OnDestroy,
    QueryList,
    Renderer2,
    ViewChild,
} from "@angular/core";

import { MenuItemDirective } from "../directives/menu-item.directive";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: "ngx-responsivemenu",
    templateUrl: "responsive-menu.component.html",
    styleUrls: ["./responsive-menu.component.scss"]
})
export class ResponsiveMenuComponent implements AfterViewInit, AfterContentInit, OnDestroy {

    @ContentChildren(MenuItemDirective)
    public menuItems: QueryList<MenuItemDirective>;

    @Input()
    public showMax = -1;

    /** true if we handle overflow */
    public isOverflow = false;

    public showOverflow = false;

    @ViewChild("buttonWrapper", {read: ElementRef, static: true})
    private buttonBar: ElementRef;

    @ViewChild("moreBtn", {read: MenuItemDirective, static: true})
    private moreBtn: MenuItemDirective;

    @ViewChild("overflowContent", {read: ElementRef, static: true})
    private overflowContent: ElementRef;

    private isDestroyed$: Subject<boolean> = new Subject();

    /** max width of button bar */
    private maxWidth: number;

    /**
     * possible overflow items, which fits into button bar but not with more button
     * but since the next button could be the last button and be smaller then overflow button
     * which could results into that all buttons fits into the bar we only have to mark this button
     * for an overflow button
     */
    private possibleOverflowItems: MenuItemDirective[] = [];

    /** reserved width which we will need to show more button */
    private reservedWidth: number;

    /** used width from all buttons, more button not included */
    private usedWidth: number;

    constructor(
        private renderer: Renderer2
    ) {}

    public ngOnDestroy() {
        this.isDestroyed$.next(true);
    }

    public ngAfterContentInit() {
        this.menuItems.changes
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(() => this.update());
    }

    /**
     * view has been initialized and rendered to dom
     */
    public ngAfterViewInit() {
        this.render();
    }

    public toggleOverflow() {
        this.showOverflow = !this.showOverflow;
    }

    /**
     * update view, this will remove all
     * contents and rerender buttons
     */
    public update() {
        this.render();
    }

    /**
     * remove old items from view so we ensure we have a clean tree
     */
    private clearView(parent: ElementRef, keep?: ElementRef) {
        Array.from(parent.nativeElement.childNodes)
            .forEach((child) => {
                if (!keep || keep.nativeElement !== child) {
                    this.renderer.removeChild(parent.nativeElement, child);
                }
            });
    }

    /**
     * render buttons to button menubar, if they not fits anymore or
     * max show count is reached put them directly to the overflow container
     */
    private render() {
        this.initRenderProcess();
        const items = this.menuItems.toArray().reverse();

        for (let index = items.length - 1, count = 0; index > -1; index-- , count++) {
            const item = items[index];

            let isOverflow = this.isOverflow;
            isOverflow = isOverflow || this.showMax > -1 && count >= this.showMax;
            this.isOverflow = isOverflow;

            let renderParent = isOverflow ? this.overflowContent.nativeElement : this.buttonBar.nativeElement;

            if (!isOverflow) {
                this.renderer.appendChild(this.buttonBar.nativeElement, item.nativeElement);
                if (this.validateSize(item)) {
                    continue;
                }
                renderParent = this.overflowContent.nativeElement;
                this.isOverflow = true;
            }
            this.renderer.appendChild(renderParent, item.nativeElement);
        }

        this.finalizeRenderProcess();
    }

    /**
     * initialize render process
     * clean up all views, get dimensions from elements
     */
    private initRenderProcess() {
        this.isOverflow = false;

        this.clearView(this.overflowContent);
        this.clearView(this.buttonBar, this.moreBtn);

        this.renderer.setStyle(this.moreBtn.nativeElement, "display", "block");
        this.renderer.setStyle(this.moreBtn.nativeElement, "visibility", "hidden");

        this.reservedWidth = this.moreBtn.width;

        /** @todo should exclude border / padding (inner width) */
        this.maxWidth      = this.buttonBar.nativeElement.getBoundingClientRect().width;
        this.usedWidth     = 0;
    }

    /**
     * finalize render process if we have possible overflow items
     * remove them from button bar and add them to overflow
     */
    private finalizeRenderProcess() {
        if (this.isOverflow) {
            this.possibleOverflowItems.forEach((item) => {
                this.renderer.insertBefore(
                    this.overflowContent.nativeElement,
                    item.nativeElement,
                    this.overflowContent.nativeElement.firstChild
                );
            });
            this.renderer.setStyle(this.moreBtn.nativeElement, "visibility", "visible");
        } else {
            this.renderer.setStyle(this.moreBtn.nativeElement, "display", "none");
        }
        this.possibleOverflowItems = [];
    }

    /**
     * validate rendered item fits into button container
     */
    private validateSize(item: MenuItemDirective, isLast = false): boolean {
        this.usedWidth = this.usedWidth + item.width;

        if (this.usedWidth > this.maxWidth) {
            return false;
        }

        if (!isLast && this.usedWidth + this.reservedWidth > this.maxWidth) {
            this.possibleOverflowItems.push(item);
        }
        return true;
    }
}

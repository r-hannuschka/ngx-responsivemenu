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
    TemplateRef,
    ViewContainerRef,
    Host,
} from "@angular/core";

import { MenuItemDirective } from "../directives/menu-item.directive";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { OverflowControl } from "../provider/overflow.control";

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

    @ViewChild("overflowTemplate", {read: TemplateRef, static: true})
    @Input()
    public overflowTemplate: TemplateRef<any>;

    @ViewChild("overflowContainer", {read: ViewContainerRef, static: true})
    @Input()
    public overflowContainer;

    @ViewChild("buttonWrapper", {read: ElementRef, static: true})
    private buttonBar: ElementRef;

    @ViewChild("moreBtn", {read: MenuItemDirective, static: true})
    private moreBtn: MenuItemDirective;

    private overflowItems: MenuItemDirective[] = [];

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
        @Host() private overflowCtrl: OverflowControl,
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
        this.overflowCtrl.data.host     = this.overflowContainer;
        this.overflowCtrl.data.template = this.overflowTemplate;
        this.render();
    }

    public toggleOverflow() {
        this.overflowCtrl.isOpen() ? this.overflowCtrl.close() : this.overflowCtrl.open();
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
        let isOverflow = false;

        for (let index = items.length - 1, count = 0; index > -1; index-- , count++) {
            const item = items[index];
            isOverflow = isOverflow || this.showMax > -1 && count >= this.showMax;

            if (!isOverflow) {
                this.addItem(item);
                if (this.validateSize(item)) {
                    continue;
                }
                this.removeItem(item);
                isOverflow = true;
            }
            this.overflowItems.push(item);
        }
        this.finalizeRenderProcess();
    }

    /**
     * initialize render process
     * clean up all views, get dimensions from elements
     */
    private initRenderProcess() {
        this.overflowItems = [];

        this.renderer.setStyle(this.moreBtn.nativeElement, "display", "block");
        this.renderer.setStyle(this.moreBtn.nativeElement, "visibility", "hidden");

        this.reservedWidth = this.moreBtn.width;

        /*
        this.clearView(this.overflowContent);
        this.clearView(this.buttonBar, this.moreBtn);

        /** @todo should exclude border / padding (inner width) */
        this.maxWidth  = this.buttonBar.nativeElement.getBoundingClientRect().width;
        this.usedWidth = 0;
    }

    /**
     * finalize render process if we have possible overflow items
     * remove them from button bar and add them to overflow
     */
    private finalizeRenderProcess() {

        if (this.overflowItems.length) {
            /** remove possible overflow items now */
            this.possibleOverflowItems.forEach((item) => {
                this.removeItem(item);
            });

            this.overflowCtrl.data.items = [...this.possibleOverflowItems, ...this.overflowItems];
            this.renderer.setStyle(this.moreBtn.nativeElement, "visibility", "visible");
        } else {
            this.renderer.setStyle(this.moreBtn.nativeElement, "display", "none");
        }

        this.possibleOverflowItems = [];
        this.overflowItems = [];
    }

    /** add new item to button bar */
    private addItem(item: MenuItemDirective) {
        this.renderer.appendChild(this.buttonBar.nativeElement, item.nativeElement);
    }

    /** remove item from button bar */
    private removeItem(item: MenuItemDirective) {
        this.renderer.removeChild(this.buttonBar.nativeElement, item.nativeElement);
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

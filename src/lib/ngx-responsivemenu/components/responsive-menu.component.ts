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
    ContentChild,
    ChangeDetectorRef,
    Output,
    EventEmitter,
} from "@angular/core";

import { MenuItemDirective } from "../directives/menu-item.directive";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { OverflowControl } from "../provider/overflow.control";
import { MenuToggleDirective } from "../directives/menu-toggle.directive";

export enum BtnAlign {
    LEFT = "left",
    RIGHT = "right"
}

@Component( {
    selector: "ngx-responsivemenu",
    templateUrl: "responsive-menu.component.html",
    styleUrls: ["./responsive-menu.component.scss"]
} )
export class ResponsiveMenuComponent implements AfterViewInit, AfterContentInit, OnDestroy {

    public isCustomButton = false;

    @ContentChildren( MenuItemDirective )
    public menuItems: QueryList<MenuItemDirective>;

    /**
     * set maximal amount of items which could rendered into button pane
     * all other items will automatically add to overflow container
     */
    @Input()
    public showMax = -1;

    /**
     * if false overflow content should rendered on own defined
     * place and not into default overflow container.
     */
    @Input()
    public renderOverflow = true;

    /**
     * if true toggle button will allways be visible even if content
     * fits into button pane
     */
    @Input()
    public set forceOverflow(forced: boolean) {
        this.isForcedOverflow = forced;
        this.overflowCtrl.forceOverflow = forced;
    }

    /**
     * set position of toggle btn, possible values are left or right
     */
    @Input()
    public alignToggle: BtnAlign = BtnAlign.RIGHT;

    @Output()
    rendered: EventEmitter<void> = new EventEmitter();

    /**
     * static: false wait until change detection loop has been finished in this case
     * button el will not rendered to dom if a custom button is given but we have to wait
     * until change detection finished before we get it
     */
    @ViewChild(MenuToggleDirective, {read: MenuToggleDirective, static: false})
    protected set defaultMoreBtn( btn: MenuToggleDirective ) {
        if ( !this.moreBtn ) {
            this.moreBtn = btn;
        }
    }

    /**
     * check if custom button is defined so we dont need to render default more button
     */
    @ContentChild(MenuToggleDirective, {read: MenuToggleDirective, static: true})
    protected set customMoreButton( btn: MenuToggleDirective ) {
        this.isCustomButton = Boolean( btn );
        if (btn) {
            this.moreBtn = btn;
        }
    }

    @ViewChild( "buttonPane", { read: ElementRef, static: true } )
    private buttonPane: ElementRef;

    @ViewChild( "tmpButtonPane", { read: ElementRef, static: true } )
    private tmpButtonPane: ElementRef;

    private isForcedOverflow = false;

    private isDestroyed$: Subject<boolean> = new Subject();

    /** more button */
    private moreBtn: MenuToggleDirective;

    /**
     * possible overflow items, which fits into button bar but not with more button
     * but since the next button could be the last button and be smaller then overflow button
     * which could results into that all buttons fits into the bar we only have to mark this button
     * for an overflow button
     */
    private possibleOverflowItems: MenuItemDirective[] = [];

    private overflowItems: MenuItemDirective[] = [];

    /** max width of button bar */
    private maxWidth: number;

    /** reserved width which we will need to show more button */
    private reservedWidth: number;

    public constructor(
        private overflowCtrl: OverflowControl,
        private renderer: Renderer2,
        private hostEl: ElementRef,
        private changeDetector: ChangeDetectorRef
    ) {
    }

    public ngOnDestroy() {
        this.isDestroyed$.next( true );
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
        if (this.isCustomButton) {
            this.renderer.appendChild( this.buttonPane.nativeElement, this.moreBtn.nativeElement );
        }
        this.render();
    }

    /**
     * update view, this will remove all
     * contents and rerender buttons
     */
    public update(width?: number) {
        this.render(width);
        this.overflowCtrl.update();
    }

    /**
     * remove old items from view so we ensure we have a clean tree
     */
    private clearView() {
        this.menuItems.forEach((menuItem: MenuItemDirective) => {
            menuItem.remove();
        });
        this.changeDetector.detectChanges();
    }

    /**
     * render buttons to button menubar, if they not fits anymore or
     * max show count is reached put them directly to the overflow container
     */
    private render(width?: number) {
        this.initRenderProcess();
        this.maxWidth = width || this.hostEl.nativeElement.getBoundingClientRect().width;

        const items = this.prepareMenuItems();
        let isOverflow = false;

        for ( let index = 0, count = 0, ln = items.length; index < ln; index++ , count++ ) {
            const item = items[index];
            isOverflow = isOverflow || this.showMax > -1 && count >= this.showMax;

            if ( !isOverflow ) {
                item.addTo(this.tmpButtonPane.nativeElement);
                if (this.validateSize(item)) {
                    continue;
                }
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
        this.clearView();

        this.overflowItems = [];
        this.possibleOverflowItems = [];
        this.overflowCtrl.data.items = [];

        this.moreBtn.show(true);
        this.reservedWidth = this.moreBtn.width;
        this.moreBtn.hide();
    }

    /**
     * finialize render process, enable more button if an overflow exists
     */
    private finalizeRenderProcess() {

        const overflowData = this.finalizeMenuItems();
        this.overflowCtrl.data.items =  overflowData;

        this.isForcedOverflow || overflowData.length ? this.moreBtn.show() : this.moreBtn.hide();

        this.possibleOverflowItems = [];
        this.overflowItems = [];
        this.changeDetector.detectChanges();
        this.rendered.emit();
    }

    /**
     * prepare menu items, filter out items which should be hidden by default
     * and put them to overflow
     */
    private prepareMenuItems(): MenuItemDirective[] {
        return this.menuItems.reduce<MenuItemDirective[]>((itemCollection, menuItem) => {
            menuItem.visible
                ? itemCollection.push( menuItem )
                : this.overflowItems.push( menuItem );

            return itemCollection;
        }, []);
    }

    /**
     * finalize menu buttons after render process finished
     * buttons which are in overflow will removed from dom and pushed to overflow array
     * all others will added to buttonPane
     */
    private finalizeMenuItems(): MenuItemDirective[] {

        const items = this.overflowItems.length
            ? this.possibleOverflowItems.concat(this.overflowItems)
            : [];

        return this.menuItems.toArray().reduce((overflowItems, item) => {
            // remove all items so they are not rendered anymore
            item.remove();
            if (!items.length || items.indexOf(item) === -1) {
                this.alignToggle === BtnAlign.LEFT
                    ? item.addTo(this.buttonPane.nativeElement)
                    : item.addTo(this.buttonPane.nativeElement, this.moreBtn.nativeElement);
                return overflowItems;
            }

            /** push item to overflow */
            overflowItems.push(item);
            return overflowItems;
        }, []);
    }

    /**
     * validate rendered item fits into button container
     */
    private validateSize( item: MenuItemDirective ): boolean {
        const usedSize = parseInt(this.tmpButtonPane.nativeElement.offsetWidth, 10);

        /** item fits together with more button */
        if (usedSize + this.reservedWidth <= this.maxWidth) {
            return true;
        }

        /**
         * menu item dosent fit into pane with toggle button
         * but since this could be the last item, or the next item
         * which come is smaller as the toggle button we push this
         * into possible overflow items, unless toggle button should shown
         * allways
         */
        if ( usedSize <= this.maxWidth && !this.isForcedOverflow) {
            this.possibleOverflowItems.push( item );
            return true;
        }

        /**
         * item dont fits anymore this is an overflow
         */
        return false;
    }
}

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

/**
 * possible toggle button alignments
 */
export enum BtnAlign {
    LEFT = "left",
    RIGHT = "right"
}

/**
 * Responsive menu component, all items which are passed should be from type
 * ResponsiveMenuItem or ResponsiveMenuToggle. All other items will never rendered
 * into dom
 *
 * @example
 * <ngx-responsivemenu>
 *     <button type="button" ngxResponsiveMenuItem ...>Btn</button>
 * </ngx-responsivemenu>
 */
@Component( {
    selector: "ngx-responsivemenu",
    templateUrl: "responsive-menu.component.html",
    styleUrls: ["./responsive-menu.component.scss"]
} )
export class ResponsiveMenuComponent implements AfterViewInit, AfterContentInit, OnDestroy {

    /**
     * if true default toggle button will not rendered anymore, will be set if a custom item
     * has been added to content from type MenuToggleDirective
     *
     * @internal
     * @example
     * <ngx-responsivemenu>
     *     ...
     *     <button type="button" ngxResponsiveMenuToggle>Button</div>
     * </ngx-responsivemenu>
     */
    public isCustomButton = false;

    /**
     * Get querylist for all content items from type MenuItemDirective.
     * Will also subscribe to querylist to get notified something changes so we can
     * rerender menu
     */
    @ContentChildren(MenuItemDirective)
    public menuItems: QueryList<MenuItemDirective>;

    /**
     * set maximal amount of items which could rendered into button pane
     * all other items will automatically add to overflow container
     */
    @Input()
    public showMax = -1;

    /**
     * if true content will not rendered longer in default container for overflow
     * content and should rendered in a custom overflow container.
     *
     * @example
     *
     * <ngx-responsive-menu [customOverflow]="true">
     *   <button type="button" ngxResponsiveMenuItem class="btn btn-sm btn-secondary" *ngFor="let item of items">{{label}}</button>
     * </ngx-responsive-menu>
     *
     * <div class="superAwesomeOverflow">
     *    <!-- overflow will rendered here now -->
     *    <ngx-responsivemenu-overflow></ngx-responsivemenu-overflow>
     * </div>
     */
    @Input()
    public customOverflow = false;

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
     * add a class for the button pane as example for bootstrap btn-group
     *
     * @example
     *
     * <ngx-responsive-menu [classBtnPane]="'btn-group'">
     *   <button type="button" ngxResponsiveMenuItem class="btn btn-sm btn-secondary" *ngFor="let item of items">{{label}}</button>
     * </ngx-responsive-menu>
     */
    @Input()
    public classBtnPane: string;

    /**
     * set position of toggle btn, possible values are left or right
     */
    @Input()
    public alignToggle: BtnAlign = BtnAlign.RIGHT;

    /**
     * emits if responsive menu has been completed rendering process
     */
    @Output()
    rendered: EventEmitter<void> = new EventEmitter();

    /**
     * static: false wait until change detection loop has been finished in this case
     * button el will not rendered to dom if a custom button is given but we have to wait
     * until change detection finished before we get it
     */
    @ViewChild(MenuToggleDirective, {read: MenuToggleDirective, static: false})
    protected set defaultToggleBtn( btn: MenuToggleDirective ) {
        if ( !this.toggleBtn ) {
            this.toggleBtn = btn;
        }
    }

    /**
     * check if custom button is defined so we dont need to render default more button
     */
    @ContentChild(MenuToggleDirective, {read: MenuToggleDirective, static: true})
    protected set customToggleButton( btn: MenuToggleDirective ) {
        this.isCustomButton = Boolean( btn );
        if (btn) {
            this.toggleBtn = btn;
        }
    }

    /**
     * button pane where items will be rendered if they fits into
     */
    @ViewChild( "buttonPane", { read: ElementRef, static: true } )
    private buttonPane: ElementRef;

    /**
     * temporary button pane where buttons will be rendered on render process
     * to avoid visualization errors
     */
    @ViewChild( "tmpButtonPane", { read: ElementRef, static: true } )
    private tmpButtonPane: ElementRef;

    /**
     * if true toggle button will allways included to button pane and be visible
     */
    private isForcedOverflow = false;

    /**
     * emits true if component gets destroyed
     */
    private isDestroyed$: Subject<boolean> = new Subject();

    /**
     * toggle button to show / close overflow
     */
    private toggleBtn: MenuToggleDirective;

    /**
     * possible overflow items, which fits into button bar but not with more button
     * but since the next button could be the last button and be smaller then overflow button
     * which could results into that all buttons fits into the bar we only have to mark this button
     * for an overflow button
     */
    private possibleOverflowItems: MenuItemDirective[] = [];

    /**
     * all overflow items which exists
     */
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

    /** @inheritdoc */
    public ngOnDestroy() {
        this.isDestroyed$.next( true );
    }

    /** @inheritdoc */
    public ngAfterContentInit() {
        this.menuItems.changes
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(() => this.update());
    }

    /** @inheritdoc */
    public ngAfterViewInit() {
        if (this.isCustomButton) {
            this.renderer.appendChild( this.buttonPane.nativeElement, this.toggleBtn.nativeElement );
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
        this.maxWidth = width || this.calcHostWidth();

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

        this.toggleBtn.show(true);
        this.reservedWidth = this.toggleBtn.width;
        this.toggleBtn.hide();
    }

    /**
     * finialize render process, enable more button if an overflow exists
     */
    private finalizeRenderProcess() {

        const overflowData = this.finalizeMenuItems();
        this.overflowCtrl.data.items =  overflowData;

        this.isForcedOverflow || overflowData.length ? this.toggleBtn.show() : this.toggleBtn.hide();

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
                    : item.addTo(this.buttonPane.nativeElement, this.toggleBtn.nativeElement);
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

    /**
     * calculate inner width from host element
     */
    private calcHostWidth(): number {
        const hostNode: HTMLElement = this.hostEl.nativeElement;
        const hostStyle = getComputedStyle(hostNode);

        let width = Math.floor(hostNode.getBoundingClientRect().width);

        /** @todo check better solution to not calculate this every time */
        width += parseInt(hostStyle.getPropertyValue("border-left-width"), 10);
        width += parseInt(hostStyle.getPropertyValue("border-right-width"), 10);
        width += parseInt(hostStyle.getPropertyValue("padding-right"), 10);
        width += parseInt(hostStyle.getPropertyValue("padding-left"), 10);

        return width;
    }
}

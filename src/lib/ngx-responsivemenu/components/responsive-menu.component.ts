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
    ContentChild,
} from "@angular/core";

import { MenuItemDirective } from "../directives/menu-item.directive";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { OverflowControl } from "../provider/overflow.control";
import { MenuItemMoreDirective } from "../directives/menu-more.directive";

@Component( {
    selector: "ngx-responsivemenu",
    templateUrl: "responsive-menu.component.html",
    styleUrls: ["./responsive-menu.component.scss"]
} )
export class ResponsiveMenuComponent implements AfterViewInit, AfterContentInit, OnDestroy {

    public isCustomButton = false;

    @ContentChildren( MenuItemDirective )
    public menuItems: QueryList<MenuItemDirective>;

    @Input()
    public showMax = -1;

    @ViewChild( "overflowTemplate", { read: TemplateRef, static: true } )
    @Input()
    public overflowTemplate: TemplateRef<any>;

    @ViewChild( "overflowContainer", { read: ViewContainerRef, static: true } )
    @Input()
    public overflowContainer;

    /**
     * static: false wait until change detection loop has been finished in this case
     * button el will not rendered to dom if a custom button is given but we have to wait
     * until change detection finished before we get it
     */
    @ViewChild( MenuItemMoreDirective, { read: MenuItemMoreDirective, static: false } )
    public set defaultMoreBtn( btn: MenuItemMoreDirective ) {
        if ( !this.moreBtn ) {
            this.moreBtn = btn;
        }
    }

    /**
     * check if custom button is defined so we dont need to render default more button
     */
    @ContentChild( MenuItemMoreDirective, { read: MenuItemMoreDirective, static: true } )
    public set customMoreButton( btn: MenuItemMoreDirective ) {
        this.isCustomButton = Boolean( btn );
        this.moreBtn = btn;
    }

    @ViewChild( "menuPane", { read: ElementRef, static: true } )
    private menuPane: ElementRef;

    @ViewChild( "buttonPane", { read: ElementRef, static: true } )
    private buttonPane: ElementRef;

    private isDestroyed$: Subject<boolean> = new Subject();

    /** more button */
    private moreBtn: MenuItemMoreDirective;

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
        private renderer: Renderer2
    ) { }

    public ngOnDestroy() {
        this.isDestroyed$.next( true );
    }

    public ngAfterContentInit() {
        this.menuItems.changes
            .pipe( takeUntil( this.isDestroyed$ ) )
            .subscribe( () => this.update() );
    }

    /**
     * view has been initialized and rendered to dom
     */
    public ngAfterViewInit() {
        this.addItem( this.moreBtn );
        this.overflowCtrl.data.host = this.overflowContainer;
        this.overflowCtrl.data.template = this.overflowTemplate;
        this.render();
    }

    /**
     * update view, this will remove all
     * contents and rerender buttons
     */
    public update() {
        this.render();
        this.overflowCtrl.update();
    }

    /**
     * remove old items from view so we ensure we have a clean tree
     */
    private clearView( parent: ElementRef, keep?: ElementRef ) {
        Array.from( parent.nativeElement.childNodes )
            .forEach( ( child ) => {
                if ( !keep || keep.nativeElement !== child ) {
                    this.renderer.removeChild( parent.nativeElement, child );
                }
            } );
    }

    /**
     * render buttons to button menubar, if they not fits anymore or
     * max show count is reached put them directly to the overflow container
     */
    private render() {
        this.initRenderProcess();

        const items = this.prepareMenuItems();
        let isOverflow = false;

        for ( let index = 0, count = 0, ln = items.length; index < ln; index++ , count++ ) {
            const item = items[index];
            isOverflow = isOverflow || this.showMax > -1 && count >= this.showMax;

            if ( !isOverflow ) {
                this.addItem( item );
                if ( this.validateSize( item ) ) {
                    continue;
                }
                this.removeItem( item );
                isOverflow = true;
            }
            this.overflowItems.push( item );
        }
        this.finalizeRenderProcess();
    }

    /**
     * initialize render process
     * clean up all views, get dimensions from elements
     */
    private initRenderProcess() {
        this.overflowItems = [];
        this.possibleOverflowItems = [];
        this.overflowCtrl.data.items = [];

        this.clearView( this.buttonPane, this.moreBtn );

        this.moreBtn.show( true );
        this.reservedWidth = this.moreBtn.width;
        this.moreBtn.hide();

        this.maxWidth = this.menuPane.nativeElement.getBoundingClientRect().width;
    }

    /**
     * finalize render process if we have possible overflow items
     * remove them from button bar and add them to overflow
     */
    private finalizeRenderProcess() {
        if ( this.overflowItems.length ) {
            /** remove possible overflow items now */
            this.possibleOverflowItems.forEach( ( item ) => {
                this.removeItem( item );
            } );
            this.moreBtn.show();
            this.overflowCtrl.data.items = this.mergeMenuItems();
        } else {
            this.moreBtn.hide();
        }

        this.possibleOverflowItems = [];
        this.overflowItems = [];
    }

    /** add new item to button bar */
    private addItem( item: MenuItemDirective ) {
        this.renderer.appendChild( this.buttonPane.nativeElement, item.nativeElement );
    }

    /** remove item from button bar */
    private removeItem( item: MenuItemDirective ) {
        this.renderer.removeChild( this.buttonPane.nativeElement, item.nativeElement );
    }

    /**
     * prepare menu items, filter out items which should be hidden by default
     * and put them to overflow
     */
    private prepareMenuItems(): MenuItemDirective[] {
        const items = this.menuItems.toArray();
        return items.reduce<MenuItemDirective[]>((itemCollection, menuItem) => {
            menuItem.visible
                ? itemCollection.push( menuItem )
                : this.overflowItems.push( menuItem );

            return itemCollection;
        }, []);
    }

    /**
     * merge buttons since they displayed in incorret order
     * buttons which are defined as visible: false will allways rendered
     * to overflow, but this will change the order of buttons now
     */
    private mergeMenuItems(): MenuItemDirective[] {
        if ( !this.overflowItems.length ) {
            return this.possibleOverflowItems;
        }
        const items = [...this.possibleOverflowItems, ...this.overflowItems];
        return this.menuItems.toArray().filter((item) => {
            return items.indexOf( item ) > -1;
        });
    }

    /**
     * validate rendered item fits into button container
     */
    private validateSize( item: MenuItemDirective ): boolean {
        const usedSize = parseInt( this.buttonPane.nativeElement.offsetWidth, 10 );

        /** item fits together with more button */
        if ( usedSize + this.reservedWidth <= this.maxWidth ) {
            return true;
        }

        /**
         * item dont fits together with more btn but into view
         * if this is the last button he could stay in button pane
         */
        if ( usedSize <= this.maxWidth ) {
            console.log( item.nativeElement );
            this.possibleOverflowItems.push( item );
            return true;
        }

        /**
         * item dont fits anymore this is an overflow
         */
        return false;
    }
}

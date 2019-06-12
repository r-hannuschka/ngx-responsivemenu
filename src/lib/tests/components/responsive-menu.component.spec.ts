// unit tests comes here
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { Component, DebugElement, Input, Renderer2, Type, ViewChild, TemplateRef } from "@angular/core";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, ResponsiveMenuComponent, MenuItemDirective, MenuToggleDirective } from "lib/public-api";
import { OverflowControl } from "lib/ngx-responsivemenu/provider/overflow.control";
import { BtnAlign } from "lib/ngx-responsivemenu/components/responsive-menu.component";

@Component({
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class='menu-wrapper' *ngIf="!customToggle">
            <ngx-responsivemenu [alignToggle]="toggleAlign" [showMax]="showMaxCount">
                <div ngxResponsiveMenuItem [visible]="!item.hidden" *ngFor="let item of items" class="menu-item">{{item.label}}</div>
            </ngx-responsivemenu>
        </div>

        <div class='menu-wrapper' *ngIf="customToggle">
            <ngx-responsivemenu [alignToggle]="toggleAlign" [showMax]="showMaxCount">
                <div ngxResponsiveMenuItem [visible]="!item.hidden" *ngFor="let item of items" class="menu-item">{{item.label}}</div>
                <div ngxResponsiveMenuToggle>Custom Toggle Btn</div>
            </ngx-responsivemenu>
        </div>
    `
})
class WrapperComponent {
    public items: any[] = [];

    public toggleAlign: BtnAlign = BtnAlign.RIGHT;

    public showMaxCount = -1;

    public customToggle = false;

    public isCustomOverflowTemplate = false;

    @ViewChild("customOverflowTemplate", {read: TemplateRef, static: true})
    public overflowTemplate: TemplateRef<any>;

    @Input()
    public set itemCount( count: number ) {
        const items = Array.from(Array.from({length: count}), (v, index) => {
            return {
                label: `Item #${ index }`,
                hidden: false
            };
        });

        this.items = this.items.concat(items);
    }

    public set hiddenItemCount( count: number ) {
        const items = Array.from( Array.from( { length: count } ), ( v, index ) => {
            return {
                label: `Item #${ index }`,
                hidden: true
            };
        });
        this.items = this.items.concat(items);
    }

    @Input()
    public set buttonAlign( align: BtnAlign ) {
        this.toggleAlign = align;
    }
}

describe( "Responsive Menu Component", () => {

    let fixture: ComponentFixture<WrapperComponent>;
    let wrapperComponent: WrapperComponent;
    let menuComponent: DebugElement;
    let menuComponentInstance: ResponsiveMenuComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [WrapperComponent],
            providers: [Renderer2]
        }).compileComponents();
    }));

    beforeEach(async(async () => {
        fixture = TestBed.createComponent( WrapperComponent );
        wrapperComponent = fixture.componentInstance;
        fixture.detectChanges();
        menuComponent = fixture.debugElement.query(By.directive(ResponsiveMenuComponent));
        menuComponentInstance = menuComponent.componentInstance;
        fixture.detectChanges();
    }));

    it( "should render 3 items", () => {
        wrapperComponent.itemCount = 3;
        fixture.detectChanges();

        const renderedItems = fixture.debugElement.queryAll( By.css( ".menu-item" ) );
        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );

        expect( renderedItems.length ).toBe(3);
        expect( toggleBtn.styles.display ).toBe( "none" );
    } );

    /**
     * testing the limit, 4 items should be added, what makes 200px and fits into parent container
     */
    it( "should render 4 items", () => {
        wrapperComponent.itemCount = 4;
        fixture.detectChanges();

        const renderedItems = fixture.debugElement.queryAll( By.css( ".menu-item" ) );
        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );
        expect( renderedItems.length ).toBe( 4 );
        expect( toggleBtn.styles.display ).toBe( "none" );
    });

    /**
     * tests menu will update if we add new items after this has been rendered
     * before
     */
    it( "should update if items change", () => {
        wrapperComponent.itemCount = 2;
        fixture.detectChanges();

        // create spy on
        const spy = spyOn(menuComponentInstance, "update");

        // add one item
        wrapperComponent.itemCount = 1;
        fixture.detectChanges();

        const menuItems = fixture.debugElement.queryAll( By.directive( MenuItemDirective ) );

        expect(spy).toHaveBeenCalled();
        expect(menuItems.length).toBe(3);
    });

    it( "should render 3 items, and add 4 to overflow", inject( [OverflowControl], ( overflowCtrl ) => {
        /** mock OverflowControl.data */
        const overflowDataModel: any = {};
        spyOnProperty( overflowCtrl, "data", "get" ).and.returnValue( overflowDataModel );

        /**
         * maxWidth: 200px
         * btnWidth: 50px
         * toggleBtnWidth: ~25px
         * count: 7
         *
         * expect:
         *    3 in button pane inclusive toggle
         *    4 in overflow
         */
        wrapperComponent.itemCount = 7;
        fixture.detectChanges();

        const renderedItems = fixture.debugElement.queryAll( By.css( ".menu-item" ) );
        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );

        expect( renderedItems.length ).toBe( 3 );
        expect( overflowDataModel.items.length ).toBe( 4 );
        /** turns to default display mode, means inline style is display: null */
        expect( toggleBtn.styles.display ).toBeNull();
    } ) );

    /**
     * by default toggle button should be rendered on the right side
     */
    it( "should render toggle button by default right", () => {
        wrapperComponent.itemCount = 7;
        fixture.detectChanges();

        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );
        const menuItems = toggleBtn.parent.children;
        expect( menuItems.reverse()[0].nativeElement ).toBe( toggleBtn.nativeElement );
    } );

    /**
     * test toggle button will be align to the left side
     */
    it( "should render toggle button on the left side", () => {
        wrapperComponent.buttonAlign = BtnAlign.LEFT;
        wrapperComponent.itemCount = 7;
        fixture.detectChanges();

        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );
        const menuItems = toggleBtn.parent.children;
        expect( menuItems[0].nativeElement ).toBe( toggleBtn.nativeElement );
    } );

    /**
     * update menu after host component has been resized
     */
    it("should update menu depends on parent width", () => {
        const menuWrapper = fixture.debugElement.query( By.css( ".menu-wrapper" ) );
        const responsiveMenu: ResponsiveMenuComponent =
            fixture.debugElement.query(By.directive(ResponsiveMenuComponent)).componentInstance;

        const renderer = fixture.componentRef.injector.get<Renderer2>( Renderer2 as Type<Renderer2> );
        wrapperComponent.buttonAlign = BtnAlign.LEFT;
        wrapperComponent.itemCount = 7;
        fixture.detectChanges();

        // set width to 600px -> fits 12 items so we could not have any overflow anymore
        renderer.setStyle( menuWrapper.nativeElement, "width", "600px" );
        responsiveMenu.update();

        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );
        const menuItems = fixture.debugElement.queryAll( By.directive( MenuItemDirective ) );

        expect( toggleBtn.styles.display ).toBe( "none" );
        expect( menuItems.length ).toBe( 7 );
    });

    /**
     * update menu if we pass width manually, this means not that the parent has been resized
     * really
     */
    it( "should update menu depends given width", () => {
        const responsiveMenu: ResponsiveMenuComponent =
            fixture.debugElement.query( By.directive( ResponsiveMenuComponent ) ).componentInstance;

        wrapperComponent.buttonAlign = BtnAlign.LEFT;
        wrapperComponent.itemCount = 7;
        fixture.detectChanges();

        // set width to 600px -> fits 12 items so we could not have any overflow anymore
        responsiveMenu.update( 600 );

        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );
        const menuItems = fixture.debugElement.queryAll( By.directive( MenuItemDirective ) );

        expect( toggleBtn.styles.display ).toBe( "none" );
        expect( menuItems.length ).toBe( 7 );
    });

    it( "should show 2 items in menu pane, and 2 in overflow", inject( [OverflowControl], (overflowCtrl ) => {
        /** mock OverflowControl.data */
        const overflowDataModel: any = {};
        spyOnProperty( overflowCtrl, "data", "get" ).and.returnValue( overflowDataModel );

        wrapperComponent.buttonAlign = BtnAlign.LEFT;
        wrapperComponent.itemCount = 2;
        wrapperComponent.hiddenItemCount = 2;

        fixture.detectChanges();

        const toggleBtn = fixture.debugElement.query( By.directive( MenuToggleDirective ) );
        const menuItems = fixture.debugElement.queryAll( By.directive( MenuItemDirective ) );

        expect(toggleBtn.styles.display ).toBeNull();
        expect(menuItems.length).toBe(2);
        expect(overflowDataModel.items.length).toBe(2);
    }));

    /**
     * testing custom button for toggle
     */
    it( "should add custom toggle button", () => {

        wrapperComponent.customToggle = true;
        wrapperComponent.itemCount = 6;
        fixture.detectChanges();

        const toggleBtn = fixture.debugElement.queryAll(By.directive(MenuToggleDirective));
        expect(toggleBtn.length).toBe(1);
        expect(toggleBtn[0].nativeElement.textContent).toBe("Custom Toggle Btn");
    });
});

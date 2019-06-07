// unit tests comes here
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { Component, DebugElement, OnInit, Input, DebugNode } from "@angular/core";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, ResponsiveMenuComponent } from "lib/public-api";
import { OverflowControl } from "lib/ngx-responsivemenu/provider/overflow.control";
import { BtnAlign } from "lib/ngx-responsivemenu/components/responsive-menu.component";
import { MenuItemMoreDirective } from "lib/ngx-responsivemenu/directives/menu-more.directive";

@Component({
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class='menu-wrapper'>
            <ngx-responsivemenu [alignToggle]="toggleAlign">
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item">{{item}}</div>
            </ngx-responsivemenu>
        </div>
    `
})
class WrapperComponent {
    public items: string[];

    public toggleAlign: BtnAlign = BtnAlign.RIGHT;

    @Input()
    public set itemCount( count: number ) {
        this.items = Array.from( Array.from( { length: count } ), ( v, index ) => `Item #${ index }` );
    }

    @Input()
    public set buttonAlign(align: BtnAlign) {
        this.toggleAlign = align;
    }
}

describe("Responsive Menu Component", () => {

    let fixture: ComponentFixture<WrapperComponent>;
    let wrapperComponent: WrapperComponent;
    let menuComponent: DebugElement;
    let menuComponentInstance: ResponsiveMenuComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [WrapperComponent]
        }).compileComponents();
    }));

    beforeEach(async(async () => {
        fixture = TestBed.createComponent( WrapperComponent );
        wrapperComponent = fixture.componentInstance;
        menuComponent = fixture.debugElement.query( By.directive( ResponsiveMenuComponent ) );
        menuComponentInstance = menuComponent.componentInstance;
    }));

    it("should render 3 items", () => {
        wrapperComponent.itemCount = 3;
        fixture.detectChanges();

        const renderedItems = fixture.debugElement.queryAll( By.css( ".menu-item" ) );
        expect(renderedItems.length).toBe(3);
    });

    it("should render 4 items", () => {
        wrapperComponent.itemCount = 4;
        fixture.detectChanges();

        const renderedItems = fixture.debugElement.queryAll( By.css( ".menu-item" ) );
        expect( renderedItems.length ).toBe( 4 );
    });

    it("should render 3 items, and add 4 to overflow", inject([OverflowControl], (overflowCtrl) => {
        /** mock OverflowControl.data */
        const overflowDataModel: any = {};
        spyOnProperty( overflowCtrl, "data", "get" ).and.returnValue(overflowDataModel);

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

        const renderedItems = fixture.debugElement.queryAll(By.css(".menu-item"));
        expect(renderedItems.length).toBe(3);
        expect(overflowDataModel.items.length).toBe(4);
    }));

    it("should render toggle button by default right", inject([OverflowControl], (overflowCtrl) => {
        wrapperComponent.itemCount = 7;
        fixture.detectChanges();

        const toggleBtn = fixture.debugElement.query(By.directive(MenuItemMoreDirective));
        const menuItems = toggleBtn.parent.children;
        expect(menuItems.reverse()[0].nativeElement).toBe(toggleBtn.nativeElement);
    }));

    it("should render toggle button on the right side", inject([OverflowControl], (overflowCtrl) => {
        wrapperComponent.buttonAlign = BtnAlign.LEFT;
        wrapperComponent.itemCount = 7;
        fixture.detectChanges();

        const toggleBtn = fixture.debugElement.query(By.directive(MenuItemMoreDirective));
        const menuItems = toggleBtn.parent.children;
        expect(menuItems[0].nativeElement).toBe(toggleBtn.nativeElement);
    }));
});

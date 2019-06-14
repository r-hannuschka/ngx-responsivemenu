// unit tests comes here
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, OverflowControl, MenuItemDirective, ResponsiveMenuComponent, MenuToggleDirective } from "lib/public-api";
import { By } from "@angular/platform-browser";

interface Button {
    label: string;
    visible: boolean;
}

@Component( {
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class="menu-wrapper" *ngIf="!customToggle">
            <ngx-responsivemenu>
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item" [visible]="item.visible">{{item.label}}</div>
            </ngx-responsivemenu>
        </div>

        <div *ngIf="customToggle">
            <ngx-responsivemenu>
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item" [visible]="item.visible">{{item.label}}</div>
                <div ngxResponsiveMenuToggle>Custom Toggle Btn</div>
            </ngx-responsivemenu>
        </div>
    `
} )
class RenderingComponent {

    public items: Button[] = [];

    public customToggle = false;

    public set itemCount(count: number) {
        this.items = Array.from(Array.from({length: count}), (v, index) => {
            return {
                label: `Item #${index}`,
                visible: true
            };
        });
    }

    public addButton(visible = true) {
        this.items.push({
            label: `Button #${this.items.length}`,
            visible
        });
    }
}

describe( "Responsive Menu Component", () => {

    let fixture: ComponentFixture<RenderingComponent>;
    let renderingComponent: RenderingComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [RenderingComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RenderingComponent);
        renderingComponent = fixture.componentInstance;
    });

    describe("Rendering: base", () => {

        it("should render 4 items", () => {
            renderingComponent.itemCount = 4;
            fixture.detectChanges();
            const renderedItems = fixture.debugElement.queryAll(By.css(".menu-item"));
            expect(renderedItems.length).toBe(4);
        });

        /**
         * testing rendering with more items as would fit
         */
        it("should render 3 items, and add 4 to overflow", inject([OverflowControl], ( overflowCtrl ) => {
            /** mock OverflowControl.data */
            const overflowDataModel: any = {};
            spyOnProperty( overflowCtrl, "data", "get" ).and.returnValue( overflowDataModel );

            renderingComponent.itemCount = 7;
            fixture.detectChanges();

            const renderedItems = fixture.debugElement.queryAll(By.css(".menu-item"));
            expect(renderedItems.length).toBe(3);
            expect(overflowDataModel.items.length).toBe(4);
        }));

        /**
         * testing buttons should allways in overflow, so we set visible for menuItem
         * to false so this item will not rendered anymore into overflow
         */
        it("should show 2 items in menu pane, and 2 in overflow", inject( [OverflowControl], (overflowCtrl ) => {
            /** mock OverflowControl.data */
            const overflowDataModel: any = {};
            spyOnProperty( overflowCtrl, "data", "get" ).and.returnValue( overflowDataModel );

            renderingComponent.itemCount = 2;
            renderingComponent.addButton(false);
            renderingComponent.addButton(false);

            fixture.detectChanges();

            const menuItems = fixture.debugElement.queryAll(By.directive(MenuItemDirective));

            expect(menuItems.length).toBe(2);
            expect(overflowDataModel.items.length).toBe(2);
        }));

    });

    describe("Rendering: update", () => {

        /**
         * tests menu will update if we add new items after this has been rendered
         * before
         */
        it("should update if items change", () => {
            renderingComponent.itemCount = 2;
            fixture.detectChanges();

            const menuComponent = fixture.debugElement.query(By.directive(ResponsiveMenuComponent));
            const menuComponentInstance = menuComponent.componentInstance;

            const spy = spyOn(menuComponentInstance, "update");

            // add one item
            renderingComponent.addButton();
            fixture.detectChanges();

            const menuItems = fixture.debugElement.queryAll(By.directive(MenuItemDirective));
            expect(spy).toHaveBeenCalled();
            expect(menuItems.length).toBe(3);
        });

        /**
         * update menu if we pass width manually, this means not that the parent has been resized
         * really
         */
        it( "should force repaint if width changes", () => {
            renderingComponent.itemCount = 7;
            fixture.detectChanges();

            const menuComponent = fixture.debugElement.query(By.directive(ResponsiveMenuComponent));
            const menuComponentInstance = menuComponent.componentInstance;

            // set width to 600px -> fits 12 items so we could not have any overflow anymore
            menuComponentInstance.update(600);

            const toggleBtn = fixture.debugElement.query(By.directive(MenuToggleDirective));
            const menuItems = fixture.debugElement.queryAll(By.directive(MenuItemDirective));

            expect(toggleBtn.styles.display).toBe("none");
            expect(menuItems.length ).toBe(7);
        });
    });

    describe("Rendering: custom btn", () => {
        let menuComponentInstance: ResponsiveMenuComponent;

        /**
         * testing custom button for toggle
         */
        it( "should add custom toggle button", () => {
            renderingComponent.customToggle = true;
            renderingComponent.itemCount = 6;
            fixture.detectChanges();

            const menuComponent = fixture.debugElement.query(By.directive(ResponsiveMenuComponent));
            menuComponentInstance = menuComponent.componentInstance;

            const toggleBtn = fixture.debugElement.queryAll(By.directive(MenuToggleDirective));
            expect(toggleBtn[0].nativeElement.textContent).toBe("Custom Toggle Btn");
        });
    });
});

// unit tests comes here
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { Component, Renderer2, OnInit, Input } from "@angular/core";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, OverflowControl } from "lib/public-api";
import { MenuItemDirective } from "lib/public-api";

@Component( {
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class='menu-wrapper'>
            <ngx-responsivemenu [showMax]="showMax">
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item">{{item.label}}</div>
            </ngx-responsivemenu>
        </div>
    `
} )
class ShowMaxComponent implements OnInit {

    public items: string[] = [];

    public showMax = 1;

    public ngOnInit() {
        this.items = Array.from( Array.from({length: 4} ), ( v, index ) => `Item #${ index }`);
    }

    public updateItemCount(count: number) {
        this.items = Array.from( Array.from({length: count} ), ( v, index ) => `Item #${ index }`);
    }
}

describe( "Responsive Menu Component", () => {

    let fixture: ComponentFixture<ShowMaxComponent>;
    let showMaxComponent: ShowMaxComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [ShowMaxComponent],
            providers: [Renderer2]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowMaxComponent);
        showMaxComponent = fixture.componentInstance;
    });

    describe("Input: showMax", () => {

        it("should render 0 items", () => {
            showMaxComponent.showMax = 0;
            fixture.detectChanges();
            const renderedItems = fixture.debugElement.queryAll(By.css(".menu-item"));
            expect(renderedItems.length).toEqual(0);
        });

        it("should render 2 items", () => {
            showMaxComponent.showMax = 2;
            fixture.detectChanges();
            const renderedItems = fixture.debugElement.queryAll(By.css(".menu-item"));
            expect(renderedItems.length).toEqual(2);
        });

        it("should have 2 items in overflow with showMax: 2", inject([OverflowControl], (overflowCtrl) => {
            const overflowDataModel: any = {};
            spyOnProperty(overflowCtrl, "data", "get").and.returnValue( overflowDataModel );

            showMaxComponent.showMax = 2;
            fixture.detectChanges();

            expect(overflowDataModel.items.length).toBe(2);
        }));

        it("should have 4 items rendered and 0 to overflow, showMax: -1", inject([OverflowControl], (overflowCtrl) => {

            const overflowDataModel: any = {};
            spyOnProperty(overflowCtrl, "data", "get").and.returnValue(overflowDataModel);

            showMaxComponent.showMax = -1;

            fixture.detectChanges();
            const renderedItems = fixture.debugElement.queryAll(By.directive(MenuItemDirective));

            // should be has length of 4
            expect(renderedItems.length).toEqual(4);
            expect(overflowDataModel.items.length).toBe(0);
        }));
    });
});

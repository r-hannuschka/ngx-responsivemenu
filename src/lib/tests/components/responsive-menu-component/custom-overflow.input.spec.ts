// unit tests comes here
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { Component, Renderer2, OnInit } from "@angular/core";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, OverflowControl } from "lib/public-api";

@Component( {
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class='menu-wrapper'>
            <ngx-responsivemenu [customOverflow]="customOverflow">
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item">{{item.label}}</div>
            </ngx-responsivemenu>
        </div>
    `
} )
class CustomOverflowComponent implements OnInit {

    public items: string[] = [];

    public customOverflow = false;

    public ngOnInit() {
        this.items = Array.from( Array.from({length: 4} ), ( v, index ) => `Item #${ index }`);
    }
}

describe( "Responsive Menu Component", () => {

    let fixture: ComponentFixture<CustomOverflowComponent>;
    let showMaxComponent: CustomOverflowComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [CustomOverflowComponent],
            providers: [Renderer2]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomOverflowComponent);
        showMaxComponent = fixture.componentInstance;
    });

    describe("Input: CustomOverflow", () => {
        it("should not render default overflow", inject([OverflowControl], (overflowCtrl) => {
            showMaxComponent.customOverflow = true;
            fixture.detectChanges();

            const overflow = fixture.debugElement.query(By.css(".overflow"));
            expect(overflow).toBeNull();
        }));
    });
});

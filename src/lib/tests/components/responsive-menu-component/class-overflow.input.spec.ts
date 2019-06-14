// unit tests comes here
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { Component, Renderer2, OnInit } from "@angular/core";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, OverflowControl } from "lib/public-api";
import { OverflowContentDirective } from "lib/ngx-responsivemenu/directives/overflow.directive";

@Component( {
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class='menu-wrapper'>
            <ngx-responsivemenu [classOverflow]="cssClass">
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item">{{item.label}}</div>
            </ngx-responsivemenu>
        </div>
    `
} )
class ClassOverflowComponent implements OnInit {

    public items: string[] = [];

    public cssClass: any = "";

    public ngOnInit() {
        this.items = Array.from( Array.from({length: 4} ), ( v, index ) => `Item #${ index }`);
    }
}

describe( "Responsive Menu Component", () => {

    let fixture: ComponentFixture<ClassOverflowComponent>;
    let showMaxComponent: ClassOverflowComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [ClassOverflowComponent],
            providers: [Renderer2]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassOverflowComponent);
        showMaxComponent = fixture.componentInstance;
    });

    describe("Input: ClassOverflow", () => {
        it("should add class to overflow container", () => {
            showMaxComponent.cssClass = "my-overflow";
            fixture.detectChanges();

            const overflowDirective = fixture.debugElement.query(By.directive(OverflowContentDirective));
            expect(overflowDirective.classes["my-overflow"]).toBeDefined();
        });
    });
});

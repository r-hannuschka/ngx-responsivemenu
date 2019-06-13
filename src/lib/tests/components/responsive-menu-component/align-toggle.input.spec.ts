
// unit tests comes here
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, MenuToggleDirective } from "lib/public-api";
import { BtnAlign } from "lib/ngx-responsivemenu/components/responsive-menu.component";
import { By } from "@angular/platform-browser";

@Component( {
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class='menu-wrapper'>
            <ngx-responsivemenu [alignToggle]="align">
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item">{{item.label}}</div>
            </ngx-responsivemenu>
        </div>
    `
} )
class AlignToggleComponent implements OnInit {

    public items: string[] = [];

    public align: BtnAlign;

    public ngOnInit() {
        this.items = Array.from(Array.from({length: 10}), (v, index) => `Item #${ index }`);
    }
}

describe( "Responsive Menu Component", () => {

    let fixture: ComponentFixture<AlignToggleComponent>;
    let alignToggleComponent: AlignToggleComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [AlignToggleComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlignToggleComponent);
        alignToggleComponent = fixture.componentInstance;
    });

    describe("Input: alignToggle", () => {

        it("should render toggle button default on right side", () => {
            fixture.detectChanges();

            const toggleBtn  = fixture.debugElement.query(By.directive(MenuToggleDirective));
            const allButtons = toggleBtn.parent.children;

            expect(allButtons.slice(-1)[0]).toBe(toggleBtn);
        });

        it("should render toggle button on left side", () => {
            alignToggleComponent.align = BtnAlign.LEFT;
            fixture.detectChanges();

            const toggleBtn  = fixture.debugElement.query(By.directive(MenuToggleDirective));
            const allButtons = toggleBtn.parent.children;

            expect(allButtons[0]).toBe(toggleBtn);
        });
    });
});

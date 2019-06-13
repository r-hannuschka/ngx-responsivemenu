
// unit tests comes here
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResponsiveMenuModule, MenuToggleDirective, OverflowContentDirective } from "lib/public-api";
import { By } from "@angular/platform-browser";

@Component({
    styles: [`
        .menu-wrapper { width: 200px; }
        .menu-item { width: 50px; }
    `],
    template: `
        <div class='menu-wrapper'>
            <ngx-responsivemenu [forceOverflow]="forceOverflow">
                <div ngxResponsiveMenuItem *ngFor="let item of items" class="menu-item">{{item.label}}</div>
            </ngx-responsivemenu>
        </div>
    `
})
class ForceOverflowComponent implements OnInit {

    public items: string[] = [];

    public forceOverflow = true;

    public ngOnInit() {
        this.items = Array.from(Array.from({length: 1}), (v, index) => `Item #${ index }`);
    }
}

describe( "Responsive Menu Component", () => {

    let fixture: ComponentFixture<ForceOverflowComponent>;
    let forceOverflowComponent: ForceOverflowComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                ResponsiveMenuModule
            ],
            declarations: [ForceOverflowComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForceOverflowComponent);
        forceOverflowComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe("Input: forceOverflow", () => {

        it("overflow button should be allways visible", () => {
            const toggleBtn = fixture.debugElement.query(By.directive(MenuToggleDirective));
            expect(toggleBtn.styles.display).toBeNull();
        });

        it("overflow should be rendered, even if no overflow exists", () => {
            const toggleBtn = fixture.debugElement.query(By.directive(MenuToggleDirective));
            toggleBtn.triggerEventHandler("click", null);

            const overflowContainer = fixture.debugElement.query(By.directive(OverflowContentDirective));
            expect(overflowContainer).toBeDefined();
        });
    });
});


// unit tests comes here
import { ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";
import { MenuToggleDirective, OverflowControl } from "lib/public-api";

@Component({
    template: `<button type="button" ngxResponsiveMenuToggle>Toggle</button>`
})
class ToggleButtonComponent {
    @ViewChild(MenuToggleDirective, {read: ElementRef, static: true})
    public toggleDirective: ElementRef;
}

describe("MenuToggleDirective", () => {

    let fixture: ComponentFixture<ToggleButtonComponent>;
    let toggleButtonComponent: ToggleButtonComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule
            ],
            declarations: [ToggleButtonComponent, MenuToggleDirective],
            providers: [ OverflowControl ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ToggleButtonComponent);
        toggleButtonComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(inject([OverflowControl], (ctrl) => {
        ctrl.close();
    }));

    it("should contain toggleBtn", () => {
        expect(toggleButtonComponent.toggleDirective).toBeDefined();
    });

    it("should call open on click", inject([OverflowControl], (ctrl: OverflowControl) => {
        const btn = fixture.debugElement.query(By.css("button"));
        const spy = spyOn(ctrl, "open");

        /** triggerEventHandler was not working, work arround dispatch own event */
        const event = new Event("click");
        (btn.nativeElement as HTMLElement).dispatchEvent(event);

        expect(spy).toHaveBeenCalled();
    }));

    it("should call close if allready open", inject([OverflowControl], (ctrl: OverflowControl) => {
        const btn = fixture.debugElement.query(By.css("button"));

        /** provide some data to overflow control */
        spyOnProperty(ctrl, "data").and.returnValue({items: [1, 2, 3, 4]});
        const spy = spyOn(ctrl, "close").and.callThrough();

        /**
         * triggerEventHandler was not working, work arround dispatch own event
         * trigger twice to open / close
         */
        const event = new Event("click");
        (btn.nativeElement as HTMLElement).dispatchEvent(event);
        (btn.nativeElement as HTMLElement).dispatchEvent(event);

        expect(spy).toHaveBeenCalled();
    }));
});

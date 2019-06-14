import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";
import { MenuItemDirective, OverflowModel } from "lib/public-api";

@Component({
    template: `<div ngxResponsiveMenuItem></div>`
})
export class MenuItemComponent { }

describe("Model: OverflowModel", () => {

    const model = new OverflowModel();
    let fixture: ComponentFixture<MenuItemComponent>;
    let items;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MenuItemDirective, MenuItemComponent],
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuItemComponent);
        fixture.detectChanges();

        items = fixture.debugElement
            .queryAll(By.directive(MenuItemDirective))
            .map((item) => item.componentInstance);
    });

    it("should set items", () => {
        model.items = items;
        expect(model.items).toEqual(items);
    });

    it("should have overflow", () => {
        model.items = items;
        expect(model.isOverflow()).toBeTruthy();
    });
});

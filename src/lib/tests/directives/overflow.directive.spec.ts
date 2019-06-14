import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";
import { AsyncEvent, MenuItemDirective, OverflowContentDirective, OverflowControl } from "lib/public-api";
import { Subject, of } from "rxjs";
import { delay, tap, switchMap, take } from "rxjs/operators";

@Component({
    template: `
        <div ngxResponsiveMenuItem></div>
        <ngx-responsivemenu-overflow></ngx-responsivemenu-overflow>
    `
})
export class MenuItemComponent { }

class FakeOverflowControl {

    public show$: Subject<MenuItemComponent[]> = new Subject();

    public hide$: Subject<MenuItemComponent[]> = new Subject();

    public open = false;

    public items = [];

    public get show() {
        return this.show$.asObservable();
    }

    public get hide() {
        return this.hide$.asObservable();
    }

    public get data() {
        return { items: this.items };
    }

    public isOpen() {
        return this.open;
    }
}

describe("Directive: OverflowContentDirective", () => {

    let fixture: ComponentFixture<MenuItemComponent>;
    let ctrl: FakeOverflowControl;
    let overflowDirective: OverflowContentDirective;
    let menuItem: MenuItemDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                MenuItemDirective,
                MenuItemComponent,
                OverflowContentDirective
            ],
            providers: [{
                provide: OverflowControl,
                useClass: FakeOverflowControl
            }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuItemComponent);

        /** get overflow directive */
        overflowDirective = fixture.debugElement
            .query(By.directive(OverflowContentDirective))
            .injector.get(OverflowContentDirective);

        /** get menuitem directive */
        menuItem = fixture.debugElement
            .query(By.directive(MenuItemDirective))
            .injector.get(MenuItemDirective);

        ctrl = TestBed.get(OverflowControl);
        ctrl.items = [menuItem];
    });

    it("should use FakeOverflowControl", () => {
        expect(TestBed.get(OverflowControl) instanceof FakeOverflowControl).toBeTruthy();
    });

    it("should render overflow directly if allready open", () => {
        /** overflow should be open */
        ctrl.open = true;

        const overflowEl = fixture.debugElement.query(By.directive(OverflowContentDirective));
        const menuItemEl = fixture.debugElement.query(By.directive(MenuItemDirective));

        /** detect changes this will trigger onInit now */
        fixture.detectChanges();

        const children = overflowEl.children;
        expect(children).toContain(menuItemEl);
    });

    it("should render overflow if ctrl emits show", (done) => {
        const spy = spyOn(menuItem, "addTo").and.callFake(() => null);
        ctrl.items = [menuItem];

        fixture.detectChanges();

        overflowDirective.afterRender.pipe(take(1))
        .subscribe(() => {
            expect(spy).toHaveBeenCalled();
            done();
        });

        /** pass items */
        ctrl.show$.next(ctrl.items);
    });

    it("should render overflow after async operations are done", (done) => {
        const spy = spyOn(menuItem, "addTo").and.callFake(() => null);
        ctrl.items = [menuItem];

        fixture.detectChanges();

        /** delay stream by 50ms to simulate async operation */
        const delayStream = of(0).pipe(delay(50));

        overflowDirective.beforeRender.pipe(
            take(1),
            switchMap((event: AsyncEvent) => delayStream.pipe(tap(() => event.done()))),
            switchMap(() => overflowDirective.afterRender),
        ).subscribe(() => {
            expect(spy).toHaveBeenCalled();
            done();
        });

        /** pass items */
        ctrl.show$.next(ctrl.items);
    });
});

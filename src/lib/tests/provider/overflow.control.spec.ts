import { TestBed, inject } from "@angular/core/testing";
import { OverflowControl } from "lib/public-api";
import { tap } from "rxjs/operators";

describe( "Provider: OverflowControl", () => {
    let overflowCtrl: OverflowControl;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                OverflowControl
            ]
        });
    });

    beforeEach(inject([OverflowControl], (ctrl: OverflowControl) => {
        overflowCtrl = ctrl;
    }));

    describe("overflow exists", () => {

        beforeEach(() => {
            spyOnProperty(overflowCtrl, "data").and.returnValue({
                items: [1, 2, 3, 4, 5]
            });
        });

        it("should emit open", () => {
            overflowCtrl.show.subscribe((items: any[]) => {
                expect(items).toEqual([1, 2, 3, 4, 5]);
            });
            overflowCtrl.open();
        });

        it("should not emit open, if allready open", () => {
            const openSpy = jasmine.createSpy("neverCalled");
            overflowCtrl.show.pipe(tap(() => openSpy())).subscribe();
            overflowCtrl.open();
            overflowCtrl.open();
            expect(openSpy).toHaveBeenCalledTimes(1);
        });

        it("should be open", () => {
            overflowCtrl.open();
            expect(overflowCtrl.isOpen()).toBeTruthy();
        });
    });

    describe("no overflow exists", () => {

        it("should not emit open, if no overflow exists", () => {
            const neverCalledSpy = jasmine.createSpy("neverCalled");
            overflowCtrl.show.pipe(tap(() => neverCalledSpy())).subscribe();
            overflowCtrl.open();
            expect(neverCalledSpy).not.toHaveBeenCalled();
        });

        it("should not emit close, since this was never rendered", () => {
            const neverCalledSpy = jasmine.createSpy("neverCalled");
            overflowCtrl.hide.pipe(tap(() => neverCalledSpy())).subscribe();
            overflowCtrl.open();
            overflowCtrl.close();
            expect(neverCalledSpy).not.toHaveBeenCalled();
        });

        it("should emit open, if on forced overflow", () => {
            const forcedSpy = jasmine.createSpy("forced");
            overflowCtrl.forceOverflow = true;
            overflowCtrl.show.pipe(tap(() => forcedSpy())).subscribe();
            overflowCtrl.open();
            expect(forcedSpy).toHaveBeenCalled();
        });

    });

    describe("update data", () => {
        let dataMock;

        beforeEach(() => {
            dataMock = Object.create({
                _items: [1, 2, 3],
                set items(items: number[]) {
                    this._items = items;
                },
                get items(): number[] {
                    return this._items;
                }
            });
            spyOnProperty(overflowCtrl, "data").and.returnValue(dataMock);
        });

        it("it should close overflow if items where removed", () => {
            const updateSpy = jasmine.createSpy("update");
            overflowCtrl.open();

            /** clear data on mock */
            dataMock.items = [];
            overflowCtrl.hide.pipe(tap(() => updateSpy())).subscribe();
            overflowCtrl.update();
            expect(updateSpy).toHaveBeenCalled();
        });

        it("should not close on update on forcedOverflow", () => {
            const updateSpy = jasmine.createSpy("update");
            overflowCtrl.forceOverflow = true;
            overflowCtrl.open();

            /** clear data on mock */
            dataMock.items = [];
            overflowCtrl.hide.pipe(tap(() => updateSpy())).subscribe();
            overflowCtrl.update();
            expect(updateSpy).not.toHaveBeenCalled();
        });
    });
});

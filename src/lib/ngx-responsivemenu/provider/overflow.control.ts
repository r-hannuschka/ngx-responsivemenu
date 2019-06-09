import { OverflowModel } from "../model/overflow.model";
import { Injectable } from "@angular/core";
import { MenuItemDirective } from "../directives/menu-item.directive";
import { Observable, Subject } from "rxjs";

@Injectable()
export class OverflowControl {

    private rendered = false;

    private overflowModel: OverflowModel<any>;

    private show$: Subject<MenuItemDirective[]> = new Subject();

    private hide$: Subject<MenuItemDirective[]> = new Subject();

    private forced: boolean;

    public set forceOverflow(forced: boolean) {
        this.forced = forced;
    }

    public get show(): Observable<MenuItemDirective[]> {
        return this.show$.asObservable();
    }

    public get hide(): Observable<MenuItemDirective[]> {
        return this.hide$.asObservable();
    }

    public constructor() {
        this.overflowModel = new OverflowModel();
    }

    public get data(): OverflowModel<any> {
        return this.overflowModel;
    }

    public isOpen(): boolean {
        return this.rendered;
    }

    public update() {
        if (this.rendered) {
            this.overflowModel.items.length === 0 && !this.forced
                ? this.close()
                : this.show$.next(this.overflowModel.items);
        }
    }

    public open() {
        if (!this.rendered && (this.forced || this.overflowModel.items.length)) {
            this.rendered = true;
            this.show$.next(this.overflowModel.items);
        }
    }

    public close() {
        if (this.rendered) {
            this.rendered = false;
            this.hide$.next(this.overflowModel.items);
        }
    }
}

import { OverflowModel } from "../model/overflow.model";
import { Injectable } from "@angular/core";
import { MenuItemDirective } from "../directives/menu-item.directive";
import { Subject, Observable } from "rxjs";

@Injectable()
export class OverflowControl {

    private rendered = false;

    private overflowModel: OverflowModel<any>;

    private show$: Subject<MenuItemDirective[]> = new Subject();

    private hide$: Subject<void> = new Subject();

    public get show(): Observable<MenuItemDirective[]> {
        return this.show$.asObservable();
    }

    public get hide(): Observable<void> {
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

    public open() {
        if (!this.rendered && this.overflowModel.items.length) {
            this.overflowModel.host.createEmbeddedView(this.overflowModel.template);
            this.rendered = true;
            this.show$.next(this.overflowModel.items);
        }
    }

    public close() {
        if (this.rendered) {
            this.rendered = false;
            this.overflowModel.host.clear();
            this.hide$.next();
        }
    }
}

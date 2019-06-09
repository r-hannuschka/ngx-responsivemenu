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

    /**
     * set force overflow, if set to true this will allways emits show
     * for overflow conainer even if no overflow items exits.
     *
     * default is set to false
     */
    public set forceOverflow(forced: boolean) {
        this.forced = forced;
    }

    /**
     * returns oberservable to get notified overflow should be shown
     */
    public get show(): Observable<MenuItemDirective[]> {
        return this.show$.asObservable();
    }

    /**
     * returns oberservable to get notified overflow should be hide
     */
    public get hide(): Observable<MenuItemDirective[]> {
        return this.hide$.asObservable();
    }

    public constructor() {
        this.overflowModel = new OverflowModel();
    }

    /**
     * returns overflow data model
     */
    public get data(): OverflowModel<any> {
        return this.overflowModel;
    }

    /**
     * retursn true if overflow container is rendered
     */
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

    /**
     * show overflow content
     */
    public open() {
        if (!this.rendered && (this.forced || this.overflowModel.items.length)) {
            this.rendered = true;
            this.show$.next(this.overflowModel.items);
        }
    }

    /**
     * close overflow content
     */
    public close() {
        if (this.rendered) {
            this.rendered = false;
            this.hide$.next(this.overflowModel.items);
        }
    }
}

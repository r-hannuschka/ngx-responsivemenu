import { OverflowModel } from "../model/overflow.model";
import { Injectable } from "@angular/core";
import { MenuItemDirective } from "../directives/menu-item.directive";
import { Observable, Subject } from "rxjs";

/**
 * overflow control to open / close overflow.
 *
 * Every ResponsiveMenu will use this shared service. If you want display multiple
 * responsive menu components u should provide an own OverflowControl service in dependcy injection tree.
 * In this case both components got his own OverflowControl and dont affect each other.
 *
 * @example
 *
 * Component({
 *     selector: "app-sub1-component",
 *     templateUrl: "sub_1.component.html",
 *     styleUrls: ["./sub_1.component.scss"],
 *     viewProviders: [OverflowControl]
 * })
 * export class SubComponent1 implements AfterViewInit, AfterContentInit, OnDestroy {
 *     ...
 * }
 *
 * Component({
 *     selector: "app-sub2-component",
 *     templateUrl: "sub_2.component.html",
 *     styleUrls: ["./sub_2.component.scss"],
 *     viewProviders: [OverflowControl]
 * })
 * export class SubComponent2 implements AfterViewInit, AfterContentInit, OnDestroy {
 *     ...
 * }
 */
@Injectable()
export class OverflowControl {

    private rendered = false;

    /**
     * data model
     */
    private overflowModel: OverflowModel;

    /**
     * notify all observers if overflow should be rendered
     * but only if overflow items exists
     */
    private show$: Subject<MenuItemDirective[]> = new Subject();

    /**
     * notify all observers if overflow should be removed
     */
    private hide$: Subject<MenuItemDirective[]> = new Subject();

    /**
     * if true show$ will allways notify oberservers even if no
     * items exists
     */
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
    public get data(): OverflowModel {
        return this.overflowModel;
    }

    /**
     * retursn true if overflow container is rendered
     */
    public isOpen(): boolean {
        return this.rendered;
    }

    /**
     * update overflow visibility, if no overflow items exists it will
     * close overflow automatically, unless overflow is forced
     */
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

import { OverflowModel } from "../model/overflow.model";
import { Injectable } from "@angular/core";
import { MenuItemDirective } from "../directives/menu-item.directive";
import { Subject } from "rxjs";

@Injectable()
export class OverflowControl {

    private rendered = false;

    private overflowModel: OverflowModel<any>;

    public show$: Subject<MenuItemDirective[]> = new Subject();

    public hide$: Subject<void> = new Subject();

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
        if (!this.rendered) {
            this.overflowModel.host.createEmbeddedView( this.overflowModel.template );
            this.rendered = true;
        }
        this.show$.next(this.overflowModel.items);
    }

    public close() {

        if ( this.rendered ) {
            // this would completly remove that element wtf ...
            // this.overflowModel.host.createEmbeddedView( this.overflowModel.template );
            this.hide$.next();
            this.rendered = false;
        }
    }
}

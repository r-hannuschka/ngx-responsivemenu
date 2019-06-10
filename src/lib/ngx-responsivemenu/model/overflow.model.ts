import { MenuItemDirective } from "../directives/menu-item.directive";

/**
 * holds informations which are used from overflow control
 */
export class OverflowModel {

    /**
     * hold all overflow items
     */
    private overflowItems: MenuItemDirective[] = [];

    /**
     * set items which should rendered to overflow
     */
    public set items(items: MenuItemDirective[]) {
        this.overflowItems = items;
    }

    /**
     * get items which should rendered to overflow
     */
    public get items(): MenuItemDirective[] {
        return this.overflowItems;
    }

    /**
     * returns true if overflow is not empty
     */
    public isOverflow() {
        return this.items.length > 0;
    }
}

import { ViewContainerRef, TemplateRef, InjectionToken } from "@angular/core";
import { MenuItemDirective } from "../directives/menu-item.directive";

export class OverflowModel<T> {

    private overflowHost: ViewContainerRef;

    private overflowTemplate: TemplateRef<T>;

    private overflowItems: MenuItemDirective[] = [];

    public set host(host: ViewContainerRef) {
        this.overflowHost = host;
    }

    public get host(): ViewContainerRef {
        return this.overflowHost;
    }

    public set template(template: TemplateRef<T>) {
        this.overflowTemplate = template;
    }

    public get template(): TemplateRef<T> {
        return this.overflowTemplate;
    }

    public set items(items: MenuItemDirective[]) {
        this.overflowItems = items;
    }

    public get items(): MenuItemDirective[] {
        return this.overflowItems;
    }

    public isOverflow() {
        return this.items.length > 0;
    }
}

export const OVERFLOW_MODEL = new InjectionToken("Overflow Model");

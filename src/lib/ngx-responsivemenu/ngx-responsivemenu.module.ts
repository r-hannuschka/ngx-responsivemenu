import { NgModule } from "@angular/core";
import { MenuItemDirective } from "./directives/menu-item.directive";
import { ResponsiveMenuComponent } from "./components/responsive-menu.component";
import { CommonModule } from "@angular/common";
import { OverflowContentDirective } from "./directives/overflow.directive";
import { OverflowControl } from "./provider/overflow.control";
import { MenuToggleDirective } from "./directives/menu-toggle.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        MenuItemDirective,
        MenuToggleDirective,
        OverflowContentDirective,
        ResponsiveMenuComponent,
    ],
    providers: [ OverflowControl ],
    declarations: [
        MenuItemDirective,
        MenuToggleDirective,
        OverflowContentDirective,
        ResponsiveMenuComponent,
    ]
})
export class ResponsiveMenuModule {
}

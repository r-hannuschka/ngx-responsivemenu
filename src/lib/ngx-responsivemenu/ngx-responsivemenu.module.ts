import { NgModule } from "@angular/core";
import { MenuItemDirective } from "./directives/menu-item.directive";
import { ResponsiveMenuComponent } from "./components/responsive-menu.component";
import { CommonModule } from "@angular/common";
import { OverflowContentDirective } from "./directives/overflow-content.directive";
import { OverflowControl } from "./provider/overflow.control";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        MenuItemDirective,
        OverflowContentDirective,
        ResponsiveMenuComponent,
    ],
    providers: [
        OverflowControl
    ],
    declarations: [
        MenuItemDirective,
        OverflowContentDirective,
        ResponsiveMenuComponent,
    ]
})
export class ResponsiveMenuModule {
}

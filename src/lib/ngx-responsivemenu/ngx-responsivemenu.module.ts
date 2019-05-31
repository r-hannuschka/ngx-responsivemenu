import { NgModule } from "@angular/core";
import { MenuItemDirective } from "./directives/menu-item.directive";
import { ResponsiveMenuComponent } from "./components/responsive-menu.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        MenuItemDirective,
        ResponsiveMenuComponent
    ],
    providers: [],
    declarations: [
        MenuItemDirective,
        ResponsiveMenuComponent
    ]
})
export class ResponsiveMenuModule {
}

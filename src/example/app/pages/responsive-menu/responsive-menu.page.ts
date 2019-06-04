import { NgModule } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material";
import { ResponsiveMenuModule } from "lib/public-api";
import { MainComponent } from "./components/main.component";
import { SimpleExampleComponent } from "./components/simple/simple.component";
import { ShowMaxExampleComponent } from "./components/show-max/showmax.component";
import { HighlightModule } from "ngx-highlightjs";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: "responsive-menu",
                component: MainComponent
            }
        ]),
        ResponsiveMenuModule,
        HighlightModule,
        NoopAnimationsModule,
        MatTabsModule
    ],
    exports: [
        ResponsiveMenuModule,
        RouterModule
    ],
    declarations: [
        MainComponent,
        SimpleExampleComponent,
        ShowMaxExampleComponent
    ],
    providers: [],
})
export class ResponsiveMenuPage {
}

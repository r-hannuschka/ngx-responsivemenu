/** modules */
import { NgModule } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material";
import { ResizableModule } from "angular-resizable-element";
import { ResponsiveMenuModule } from "lib/public-api";
import { HighlightModule } from "ngx-highlightjs";

/** components */
import { MainComponent } from "./components/main.component";
import { ExampleTileComponent } from "./components/tile/tile.component";
import { DynamicExampleComponent } from "./components/dynamic/dynamic.component";
import { SimpleExampleComponent } from "./components/simple/simple.component";
import { ShowMaxExampleComponent } from "./components/show-max/showmax.component";
import { AlignMoreExampleComponent } from "./components/align-more/align-more.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: "examples",
                component: MainComponent
            }
        ]),
        ResponsiveMenuModule,
        HighlightModule,
        NoopAnimationsModule,
        MatTabsModule,
        ResizableModule
    ],
    exports: [
        ResponsiveMenuModule,
        RouterModule
    ],
    declarations: [
        MainComponent,
        ExampleTileComponent,
        AlignMoreExampleComponent,
        DynamicExampleComponent,
        SimpleExampleComponent,
        ShowMaxExampleComponent,
    ],
    providers: [],
})
export class ExamplePage {
}
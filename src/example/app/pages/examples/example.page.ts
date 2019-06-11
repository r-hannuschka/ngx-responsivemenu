/** modules */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material";
import { ResizableModule } from "angular-resizable-element";
import { HighlightModule } from "ngx-highlightjs";
import { ResponsiveMenuModule } from "lib/public-api";

/** components */
import { MainComponent } from "./components/main.component";
import { ExampleTileComponent } from "./components/tile/tile.component";
import { DynamicExampleComponent } from "./components/dynamic/dynamic.component";
import { SimpleExampleComponent } from "./components/simple/simple.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ShowMaxExampleComponent } from "./components/show-max/showmax.component";
import { AlignMoreExampleComponent } from "./components/align-more/align-more.component";
import { CustomToggleExampleComponent } from "./components/custom-toggle/custom-toggle.component";
import { ComplexItemExampleComponent } from "./components/complex-item/complex-item.component";
import { ForceOverflowExampleComponent } from "./components/force-overflow/force-overflow.component";
import { CustomOverflowExampleComponent } from "./components/custom-overflow/custom-overflow.component";
import { AsyncOperationsPart1Component } from "./components/async-operations-part1/async-operations-part1";
import { AsyncOperationsPart2Component } from "./components/async-operations-part2/async-operations-part2";

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
        MatTabsModule,
        ResizableModule,
        BrowserAnimationsModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        MainComponent,
        ExampleTileComponent,
        AlignMoreExampleComponent,
        DynamicExampleComponent,
        SimpleExampleComponent,
        ShowMaxExampleComponent,
        CustomOverflowExampleComponent,
        CustomToggleExampleComponent,
        ComplexItemExampleComponent,
        ForceOverflowExampleComponent,
        AsyncOperationsPart1Component,
        AsyncOperationsPart2Component
    ],
    providers: [],
})
export class ExamplePage {
}

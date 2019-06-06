import { NgModule } from "@angular/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material";
import { ResizableModule, ResizeHandleDirective } from "angular-resizable-element";
import { ResponsiveMenuModule } from "lib/public-api";
import { MainComponent } from "./components/main.component";
import { SimpleExampleComponent } from "./components/simple/simple.component";
import { ShowMaxExampleComponent } from "./components/show-max/showmax.component";
import { HighlightModule } from "ngx-highlightjs";
import { ExampleTileComponent } from "./components/tile/tile.component";

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
        SimpleExampleComponent,
        ShowMaxExampleComponent
    ],
    providers: [],
})
export class ExamplePage {
}

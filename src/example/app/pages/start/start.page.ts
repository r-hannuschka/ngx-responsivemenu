/** modules */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MainComponent } from "./components/main.component";
import { MarkdownModule } from "ngx-markdown";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: "",
                component: MainComponent
            }
        ]),
        MarkdownModule,
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        MainComponent,
    ],
    providers: [],
})
export class StartPage {
}

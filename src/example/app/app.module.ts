import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { ButtonComponent } from "./components/button.component";
import { ResponsiveMenuModule } from "lib/public-api";
import { HeaderComponent } from "./components/header/header.component";
import { AbsComponent } from "./components/abs/abs.component";

@NgModule( {
    declarations: [
        AbsComponent,
        AppComponent,
        ButtonComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        ResponsiveMenuModule,
        RouterModule.forRoot( [
            {
                path: "",
                component: AbsComponent
            }
        ] ),
    ],
    bootstrap: [
        AppComponent
    ]
} )
export class AppModule {
    constructor() { }
}

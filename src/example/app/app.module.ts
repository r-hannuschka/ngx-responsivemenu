import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ResponsiveMenuModule } from "ngx-responsivemenu";

import { HighlightModule } from "ngx-highlightjs";
import xml from "highlight.js/lib/languages/xml";
import scss from "highlight.js/lib/languages/scss";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";

import { AppComponent } from "./app.component";
import { ButtonComponent } from "./components/button.component";
import { HeaderComponent } from "./components/header/header.component";
import { ExamplePage } from "./pages/examples/example.page";

/**
 * Import every language you wish to highlight here
 * NOTE: The name of each language must match the file name its imported from
 */
export function hljsLanguages() {
  return [
    {name: "typescript", func: typescript},
    {name: "javascript", func: javascript},
    {name: "scss", func: scss},
    {name: "xml", func: xml}
  ];
}

@NgModule( {
    declarations: [
        AppComponent,
        ButtonComponent,
        HeaderComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        ResponsiveMenuModule,
        ExamplePage,
        RouterModule.forRoot([]),
        HighlightModule.forRoot({
            languages: hljsLanguages
        })
    ],
    bootstrap: [
        AppComponent
    ]
} )
export class AppModule {
    constructor() { }
}

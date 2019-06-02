import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
import { ButtonComponent } from "./components/button.component";
import { ResponsiveMenuModule } from "lib/public-api";

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "ViewContainerRef"
})
export class ViewContainerRefPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        console.log(value);
        return value;
    }
}

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    ViewContainerRefPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ResponsiveMenuModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  constructor() { }
}

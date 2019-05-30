import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
import { ButtonComponent } from "./components/button.component";
import { ResponsiveMenuModule } from "./modules/responsive-menu/responsive-menu.module";

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent
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

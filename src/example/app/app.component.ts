import { Component } from "@angular/core";
import { AsyncEvent } from "ngx-responsivemenu";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {

    public showSidebar: boolean;

    /**
     * der registriert sich automatisch bei den render
     * hooks drinnen ?
     */
    public onBeforeRender(event: AsyncEvent) {
        window.setTimeout(() => event.done(), 2000);
    }
}

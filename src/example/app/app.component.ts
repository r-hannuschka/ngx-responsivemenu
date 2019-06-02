import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { OverflowControl } from "lib/public-api";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    viewProviders: [OverflowControl]
})
export class AppComponent {

    public showMore = false;

    @ViewChild("menuOverflow", { read: ViewContainerRef, static: true})
    public overflowContainer: ViewContainerRef;

    public buttons = [{
        label: "Button 1",
        overflow: true
    }, {
        label: "Button 2",
        overflow: false
    }, {
        label: "Button 3",
        overflow: false
    }, {
        label: "Button 4",
        overflow: false
    }];

    addMoarCondend() {
        const newBtn = {
            label: `Button ${this.buttons.length + 1}`,
            overflow: false
        };
        this.buttons = [...this.buttons, newBtn];
    }

    removeBtn() {
        this.buttons = [...this.buttons.slice(0, -1)];
    }
}

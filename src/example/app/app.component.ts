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
        visible: false
    }, {
        label: "Button 2",
        visible: true
    }, {
        label: "Button 3",
        visible: true
    }];

    addMoarCondend() {
        const newBtn = {
            label: `Button ${this.buttons.length + 1}`,
            visible: true
        };
        this.buttons = [...this.buttons, newBtn];
    }

    removeBtn() {
        this.buttons = [...this.buttons.slice(0, -1)];
    }
}

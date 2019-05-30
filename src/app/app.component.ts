import { Component } from "@angular/core";

@Component({
    selector: "davinci-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {

    public showMore = false;

    public buttons = [{
        label: "button 1"
    }];

    addMoarCondend() {
        const newBtn = { label: `Buddon ${this.buttons.length + 1}` };
        this.buttons = [...this.buttons, newBtn];
    }

    removeBtn() {
        this.buttons = [...this.buttons.slice(0, -1)];
    }
}

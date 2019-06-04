import { Component, Input } from "@angular/core";

@Component({
    selector: "app-button",
    templateUrl: "button.component.html"
})
export class ButtonComponent {

    @Input()
    public label: string;

    constructor() { }

    public tellMeAStory() {
        console.log("no i never will tell you any stories");
    }
}

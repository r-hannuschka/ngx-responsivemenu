import { Component, OnInit, AfterViewInit, Input } from "@angular/core";

@Component({
    selector: "davinci-button",
    templateUrl: "button.component.html"
})
export class ButtonComponent implements OnInit, AfterViewInit {

    @Input()
    public label: string;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    public tellMeAStory() {
        console.log("no i never will tell you any stories");
    }
}

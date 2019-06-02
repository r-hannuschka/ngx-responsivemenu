import { Component, OnInit, AfterViewInit, Input } from "@angular/core";

@Component({
    selector: "app-button",
    templateUrl: "button.component.html"
})
export class ButtonComponent implements OnInit, AfterViewInit {

    @Input()
    public label: string;

    constructor() { }

    ngOnInit() {
        console.log("init ????");
    }

    ngAfterViewInit() {
    }

    public tellMeAStory() {
        console.log("no i never will tell you any stories");
    }
}

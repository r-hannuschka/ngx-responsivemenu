import { Component, OnInit } from "@angular/core";
import { OverflowControl } from "lib/public-api";

@Component({
    selector: "app-examples--responsivemenu-showmax",
    templateUrl: "showmax.component.html",
    viewProviders: [OverflowControl]
})

export class ShowMaxExampleComponent implements OnInit {

    public items: string[] = [];

    constructor() { }

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 10}), (v, index) => `Item #${index}`);
    }
}

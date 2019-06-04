import { Component, OnInit } from "@angular/core";
import { OverflowControl } from "lib/public-api";

@Component({
    selector: "app-examples--responsivemenu-simple",
    templateUrl: "simple.component.html",
    viewProviders: [OverflowControl]
})

export class SimpleExampleComponent implements OnInit {

    public items: string[] = [];

    public code = `import { Component, OnInit } from "@angular/core";
import { OverflowControl } from "ngx-responsivemenu";

@Component({
    selector: "app-examples--responsivemenu-simple",
    templateUrl: "simple.component.html",
    viewProviders: [OverflowControl]
})
export class SimpleExampleComponent implements OnInit {

    public items: string[] = [];

    ngOnInit() {
        this.items = Array.from( Array.from({length: 10}), (v, index) => \`Item #$\{index\}\`);
    }
}
`;

    public html = `<ngx-responsivemenu>
    <div ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</div>
</ngx-responsivemenu>
`;

    constructor() { }

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 10}), (v, index) => `Item #${index}`);
    }
}

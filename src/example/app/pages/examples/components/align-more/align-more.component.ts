import { Component, OnInit, ViewChild } from "@angular/core";
import { ResizeEvent, ResizableDirective } from "angular-resizable-element";
import { OverflowControl, ResponsiveMenuComponent } from "ngx-responsivemenu";

@Component({
    selector: "app-alignmore-example",
    templateUrl: "align-more.component.html",
    styleUrls: ["./align-more.component.scss"],
    viewProviders: [OverflowControl]
})
export class AlignMoreExampleComponent implements OnInit {

    public style;

    public items: string[] = [];

    public exampleCode = `import { Component, OnInit } from "@angular/core";
import { OverflowControl } from "ngx-responsivemenu";

@Component({
    selector: "app-examples--responsivemenu-simple",
    templateUrl: "simple.component.html",
    viewProviders: [OverflowControl]
})
export class SimpleExampleComponent implements OnInit {

    public items: string[] = [];

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 10}), (v, index) => \`Item #$\{index\}\`);
    }
}
`;

    public exampleHtml = `<ngx-responsivemenu [alignToggle]="'left'">
    <div ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</div>
</ngx-responsivemenu>
`;

    @ViewChild(ResponsiveMenuComponent, {read: ResponsiveMenuComponent, static: true})
    private responsiveMenu: ResponsiveMenuComponent;

    @ViewChild(ResizableDirective, {read: ResizableDirective, static: true})
    private resizeDirective: ResizableDirective;

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 10}), (v, index) => `Item #${index}` );

        this.resizeDirective.resizing
            .subscribe((event: ResizeEvent) => {
                this.style = {
                    position: "static",
                    left: `${ event.rectangle.left }px`,
                    top: `${ event.rectangle.top }px`,
                    width: `${ event.rectangle.width }px`,
                    height: `${ event.rectangle.height }px`
                };
                this.responsiveMenu.update(event.rectangle.width);
            });
    }
}


import { Component, OnInit, ViewChild } from "@angular/core";
import { OverflowControl } from "lib/public-api";
import { ResizeEvent, ResizableDirective } from "angular-resizable-element";
import { ResponsiveMenuComponent } from "lib/ngx-responsivemenu/components/responsive-menu.component";

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

    public createMenuItem() {
        this.items.push(\`Item #$\{this.items.length\}\`);
    }

    public removeMenuItem() {
        this.items.pop();
    }

    ngOnInit() {
        /** create array with 3 items */
        this.items = Array.from( Array.from({length: 3}), (v, index) => \`Item #$\{index\}\`);
    }
}
`;

    public exampleHtml = `<button type="button" (click)="createMenuItem()">create menu item</button>
<button type="button" (click)="removeMenuItem()">remove menu item</button>
<ngx-responsivemenu>
    <div ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</div>
</ngx-responsivemenu>
`;

    @ViewChild(ResponsiveMenuComponent, {read: ResponsiveMenuComponent, static: true})
    private responsiveMenu: ResponsiveMenuComponent;

    @ViewChild(ResizableDirective, {read: ResizableDirective, static: true})
    private resizeDirective: ResizableDirective;

    public createMenuItem() {
        this.items.push(`Item #${this.items.length}`);
    }

    public removeMenuItem() {
        this.items.pop();
    }

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 3}), (v, index) => `Item #${index}` );

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


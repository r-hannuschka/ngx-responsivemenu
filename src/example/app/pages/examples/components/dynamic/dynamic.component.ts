import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from "@angular/core";
import { ResizeEvent, ResizableDirective, ResizeHandleDirective } from "angular-resizable-element";
import { OverflowControl, ResponsiveMenuComponent } from "lib/public-api";

@Component({
    selector: "app-dynamic-example",
    templateUrl: "dynamic.component.html",
    styleUrls: ["./dynamic.component.scss"],
    viewProviders: [OverflowControl]
})
export class DynamicExampleComponent implements OnInit, AfterViewInit {

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

    @ViewChild(ResizeHandleDirective, {read: ElementRef, static: true})
    private handle: ElementRef;

    @ViewChild(ResponsiveMenuComponent, {read: ResponsiveMenuComponent, static: true})
    private responsiveMenu: ResponsiveMenuComponent;

    @ViewChild(ResizableDirective, {read: ResizableDirective, static: true})
    private resizeDirective: ResizableDirective;

    public constructor(private renderer: Renderer2) {}

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
                this.updateHandlePosition(event.rectangle.width);
                this.responsiveMenu.update();
            });
    }

    ngAfterViewInit() {
        this.updateHandlePosition();
    }

    private updateHandlePosition(w?: number) {
        const width = w || this.resizeDirective.elm.nativeElement.offsetWidth;
        this.renderer.setStyle(this.handle.nativeElement, "left", `${width}px`);
    }
}


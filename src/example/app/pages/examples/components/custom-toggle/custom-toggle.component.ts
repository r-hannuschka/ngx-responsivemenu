import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from "@angular/core";
import { ResizeEvent, ResizableDirective, ResizeHandleDirective } from "angular-resizable-element";
import { OverflowControl, ResponsiveMenuComponent } from "ngx-responsivemenu";

@Component({
    selector: "app-customtoggle-example",
    templateUrl: "custom-toggle.component.html",
    styleUrls: ["./custom-toggle.component.scss"],
    viewProviders: [OverflowControl]
})
export class CustomToggleExampleComponent implements OnInit, AfterViewInit {

    public style;

    public items: string[] = [];

    public exampleCode = `import { Component, OnInit } from "@angular/core";
import { OverflowControl } from "ngx-responsivemenu";

@Component({
    selector: "app-customtoggle-example",
    templateUrl: "custom-toggle.component.html",
    viewProviders: [OverflowControl]
})
export class CustomToggleExampleComponent implements OnInit {

    public items: string[] = [];

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 10}), (v, index) => \`Item #$\{index\}\`);
    }
}
`;

    public exampleHtml = `<ngx-responsivemenu [classBtnPane]="'btn-group'">
    <button type="button" class="btn btn-sm btn-secondary" ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</button>
    <button class="btn btn-sm btn-secondary" ngxResponsiveMenuToggle>
        <i class="fa fa-bars"></i>
    </button>
</ngx-responsivemenu>
`;

    @ViewChild(ResizeHandleDirective, {read: ElementRef, static: true})
    private handle: ElementRef;

    @ViewChild(ResponsiveMenuComponent, {read: ResponsiveMenuComponent, static: true})
    private responsiveMenu: ResponsiveMenuComponent;

    @ViewChild(ResizableDirective, {read: ResizableDirective, static: true})
    private resizeDirective: ResizableDirective;

    public constructor(private renderer: Renderer2) {}

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from( { length: 10 } ), ( v, index ) => `Item #${ index }` );

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

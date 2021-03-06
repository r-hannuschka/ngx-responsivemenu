import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from "@angular/core";
import { ResizeEvent, ResizableDirective, ResizeHandleDirective } from "angular-resizable-element";
import { OverflowControl, ResponsiveMenuComponent } from "lib/public-api";

@Component( {
    selector: "app-showmax-example",
    templateUrl: "showmax.component.html",
    styleUrls: ["./showmax.component.scss"],
    viewProviders: [OverflowControl]
} )

export class ShowMaxExampleComponent implements OnInit, AfterViewInit {

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

    public exampleHtml = `<ngx-responsivemenu [showMax]=3>
    <div ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</div>
    </ngx-responsivemenu>
</div>
`;

    public constructor(private renderer: Renderer2) {}

    @ViewChild(ResizeHandleDirective, {read: ElementRef, static: true})
    private handle: ElementRef;

    @ViewChild( ResponsiveMenuComponent, { read: ResponsiveMenuComponent, static: true } )
    private responsiveMenu: ResponsiveMenuComponent;

    @ViewChild( ResizableDirective, { read: ResizableDirective, static: true } )
    private resizeDirective: ResizableDirective;

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from( { length: 10 } ), ( v, index ) => `Item #${ index }` );

        this.resizeDirective.resizing
            .subscribe( ( event: ResizeEvent ) => {
                this.style = {
                    position: "static",
                    left: `${ event.rectangle.left }px`,
                    top: `${ event.rectangle.top }px`,
                    width: `${ event.rectangle.width }px`,
                    height: `${ event.rectangle.height }px`
                };
                this.updateHandlePosition(event.rectangle.width);
                this.responsiveMenu.update();
            } );
    }

    ngAfterViewInit() {
        this.updateHandlePosition();
    }

    private updateHandlePosition(w?: number) {
        const width = w || this.resizeDirective.elm.nativeElement.offsetWidth;
        this.renderer.setStyle(this.handle.nativeElement, "left", `${width}px`);
    }
}


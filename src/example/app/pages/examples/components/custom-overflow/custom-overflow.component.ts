import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from "@angular/core";
import { ResizeEvent, ResizableDirective, ResizeHandleDirective } from "angular-resizable-element";
import { OverflowControl, ResponsiveMenuComponent } from "lib/public-api";
import { tap, switchMap } from "rxjs/operators";

@Component({
    selector: "app-customoverflow-example",
    templateUrl: "custom-overflow.component.html",
    styleUrls: ["./custom-overflow.component.scss"],
    viewProviders: [OverflowControl]
})
export class CustomOverflowExampleComponent implements OnInit, AfterViewInit {

    public style;

    public items: string[] = [];

    public showOverflow = false;

    public exampleCode = `import { Component, OnInit } from "@angular/core";
import { OverflowControl } from "ngx-responsivemenu";
import { tap, switchMap } from "rxjs/operators";

@Component({
    selector: "app-customtoggle-example",
    templateUrl: "custom-toggle.component.html",
    viewProviders: [OverflowControl]
})
export class CustomToggleExampleComponent implements OnInit {

    public items: string[] = [];

    public constructor(private overflowCtrl: OverflowControl) {}

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 5}), (v, index) => \`Item #$\{index\}\`);

        this.overflowCtrl.show.pipe(
            tap(() => this.showOverflow = true),
            switchMap(() => this.overflowCtrl.hide)
        ).subscribe(() => this.showOverflow = false);
    }
}
`;

    public exampleHtml = `<ngx-responsivemenu [classBtnPane]="'btn-group'" [customOverflow]="true">
    <button type="button" class="btn btn-sm btn-secondary" ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</button>
    <button class="btn btn-sm btn-secondary" ngxResponsiveMenuToggle>
        <i class="fa fa-bars"></i>
    </button>
</ngx-responsivemenu>

<div *ngIf="showOverflow">
    <strong>Menu</strong>
    <ngx-responsivemenu-overflow></ngx-responsivemenu-overflow>
</div>
`;

    @ViewChild(ResizeHandleDirective, {read: ElementRef, static: true})
    private handle: ElementRef;

    @ViewChild(ResponsiveMenuComponent, {read: ResponsiveMenuComponent, static: true})
    private responsiveMenu: ResponsiveMenuComponent;

    @ViewChild(ResizableDirective, {read: ResizableDirective, static: true})
    private resizeDirective: ResizableDirective;

    public constructor(
        private overflowCtrl: OverflowControl,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from({length: 5}), (v, index) => `Item #${index}` );

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

        this.overflowCtrl.show
            .pipe(
                tap(() => this.showOverflow = true),
                switchMap(() => this.overflowCtrl.hide)
            ).subscribe(() => this.showOverflow = false);
    }

    ngAfterViewInit() {
        this.updateHandlePosition();
    }

    private updateHandlePosition(w?: number) {
        const width = w || this.resizeDirective.elm.nativeElement.offsetWidth;
        this.renderer.setStyle(this.handle.nativeElement, "left", `${width}px`);
    }
}

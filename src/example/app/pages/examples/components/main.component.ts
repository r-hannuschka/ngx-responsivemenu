import { Component } from "@angular/core";

@Component({
    selector: "app-responsivemenu-main",
    templateUrl: "main.component.html",
    styleUrls: ["./main.component.scss"]
})

export class MainComponent {

    public page = 1;

    public exampleResize = `import { Component, OnInit, ViewChild } from "@angular/core";
import { OverflowControl, ResponsiveMenuComponent } from "ngx-responsivemenu";
import { ResizeService } from "./service/resize.service";

@Component({
    selector: "app-awesome-component",
    templateUrl: "awesome.component.html",
    styleUrls: ["./awesome.component.scss"],
    viewProviders: [OverflowControl]
})
export class MyAwesomeComponent implements OnInit {

    @ViewChild(ResponsiveMenuComponent, {read: ResponsiveMenuComponent, static: true})
    private responsiveMenu: ResponsiveMenuComponent;

    public constructor(private resizeService: ResizeService) {}

    public ngOnInit() {
        this.resizeService.change
            .subscribe(() => {
                this.responsiveMenu.update();
            });
    }

    ...
}
`;

    public goToPage(page: number) {
        this.page = page;
    }
}

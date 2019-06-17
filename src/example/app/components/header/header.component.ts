import { Component, OnInit, ViewChild } from "@angular/core";
import {PlatformLocation } from "@angular/common";
import { WindowResize } from "example/app/provider/window.resize";
import { Router } from "@angular/router";
import { ResponsiveMenuComponent } from "lib/public-api";

@Component({
    selector: "app-header",
    templateUrl: "header.component.html",
    styleUrls: ["./header.component.scss"]
})

export class HeaderComponent implements OnInit {

    public docUrl: string;

    @ViewChild(ResponsiveMenuComponent, { read: ResponsiveMenuComponent, static: false })
    private responsiveMenu: ResponsiveMenuComponent;

    public constructor(
        private router: Router,
        private resize: WindowResize,
        private platformLocation: PlatformLocation
    ) {
    }

    public buttons: any[] = [];

    ngOnInit() {

        const baseHref = this.platformLocation.getBaseHrefFromDOM();

        /** not the best solution but will work for the repo */
        this.docUrl = `${baseHref}documentation/index.html`;

        this.buttons = [{
            label: "Home",
            visible: true,
            active: true,
            route: ""
        }, {
            label: "Examples",
            visible: true,
            active: true,
            route: "examples"
        }];

        this.resize.onChange()
            .subscribe(() => {
                this.responsiveMenu.update();
            });
    }

    public goTo(route: string) {
        this.router.navigate([route]);
    }
}

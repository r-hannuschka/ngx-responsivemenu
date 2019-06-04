import { Component, OnInit, ViewChild } from "@angular/core";
import { ResponsiveMenuComponent } from "lib/ngx-responsivemenu/components/responsive-menu.component";
import { WindowResize } from "example/app/provider/window.resize";
import { Router } from "@angular/router";

@Component({
    selector: "app-header",
    templateUrl: "header.component.html",
    styleUrls: ["./header.component.scss"]
})

export class HeaderComponent implements OnInit {

    @ViewChild(ResponsiveMenuComponent, { read: ResponsiveMenuComponent, static: false })
    private responsiveMenu: ResponsiveMenuComponent;

    public constructor(
        private router: Router,
        private resize: WindowResize
    ) {}

    public buttons: any[] = [];

    ngOnInit() {

        this.buttons = [{
            label: "Responsive Menu",
            visible: true,
            active: true,
            route: "responsive-menu"
        }, {
            label: "btn 2",
            visible: true,
            active: false
        }, {
            label: "btn 3",
            visible: true,
            active: false
        }, {
            label: "btn 4",
            visible: true,
            active: false
        }, {
            label: "btn 5",
            visible: true,
            active: false
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

import { Component, AfterViewInit, ViewChild, ViewContainerRef, TemplateRef } from "@angular/core";
import { OverflowControl } from "lib/public-api";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    viewProviders: [OverflowControl]
})
export class AppComponent implements AfterViewInit {

    @ViewChild("sideBarNav", {read: ViewContainerRef, static: true})
    private sideNav: ViewContainerRef;

    @ViewChild("sideBarTpl", {read: TemplateRef, static: true})
    private sideTpl: TemplateRef<any>;

    public constructor(
        private overflowCtrl: OverflowControl) {
    }

    public ngAfterViewInit() {
        this.overflowCtrl.data.host     = this.sideNav;
        this.overflowCtrl.data.template = this.sideTpl;
    }
}

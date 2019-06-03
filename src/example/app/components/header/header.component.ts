import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-header",
    templateUrl: "header.component.html",
    styleUrls: ["./header.component.scss"]
})

export class HeaderComponent implements OnInit {

    public buttons: any[] = [];

    ngOnInit() {

        this.buttons = [{
            label: "btn 1",
            visible: true,
            active: true
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
    }

    public doSomeCoolStuff() {
        console.log("dodo");
    }
}

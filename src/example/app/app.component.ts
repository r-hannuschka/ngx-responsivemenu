import { Component, OnInit } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { AsyncEvent, OverflowControl } from "ngx-responsivemenu";
import { switchMap, tap, take } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component( {
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    animations: [
        trigger("EnterLeave", [
            state("flyIn", style({width: "250px"})),
            transition(":enter", [
                style({width: "0"}),
                animate( "0.3s 100ms ease-in" )
            ]),
            transition( ":leave", [
                animate(".3s ease-out", style({width: "0"}))
            ])
        ])
    ]
})
export class AppComponent implements OnInit {

    public showSidebar: boolean;

    public animation$: Subject<boolean> = new Subject();

    public constructor(
        private overflowCtrl: OverflowControl
    ) { }

    public ngOnInit(): void {
        this.overflowCtrl.show.pipe(
            tap(() => this.showSidebar = true),
            switchMap(() => this.overflowCtrl.hide)
        ).subscribe(() => this.showSidebar = false);
    }

    public onAfterRenderMenu() {
    }

    /**
     *
     */
    public onBeforeRemoveMenu(event: AsyncEvent) {
        this.animation$.pipe(take(1))
            .subscribe(() => event.done());
    }

    public animationDone() {
        this.animation$.next(true);
    }
}


import { Component, OnInit } from "@angular/core";
import { OverflowControl, AsyncEvent } from "ngx-responsivemenu";
import { tap, switchMap } from "rxjs/operators";
import { state, style, trigger, transition, animate } from "@angular/animations";
import { Subject } from "rxjs";

@Component({
    selector: "app-async-operations2-example",
    templateUrl: "async-operations-part2.html",
    styleUrls: ["./async-operations-part2.scss"],
    animations: [
        trigger("SlideInOut", [
            state("slide", style({ width: "200px"})),
            transition(":enter", [
                style({width: "0px"}),
                animate( "0.3s 100ms ease-in" )
            ]),
            transition( ":leave", [
                animate("4s ease-out", style({width: "0"}))
            ])
        ])
    ],
    viewProviders: [OverflowControl]
})
export class AsyncOperationsPart2Component implements OnInit {

    public style;

    public showOverflow = false;

    private animationDone$: Subject<void>;

    public sourceTs = `import { Component, OnInit } from "@angular/core";
import { OverflowControl } from "ngx-responsivemenu";
import { tap, switchMap } from "rxjs/operators";
import { state, style, trigger, transition, animate } from "@angular/animations";
import { Subject } from "rxjs";

@Component({
    selector: "app-async-operations1-example",
    templateUrl: "async-operations.html",
    styleUrls: ["./async-operations.scss"],
    animations: [
        trigger("SlideInOut", [
            state("slide", style({ width: "200px"})),
            transition(":enter", [
                style({width: "0px"}),
                animate( "0.3s 100ms ease-in" )
            ]),
            transition( ":leave", [
                animate("4s ease-out", style({width: "0"}))
            ])
        ])
    ],
    viewProviders: [OverflowControl]
})
export class AsyncOperationsPart1Component implements OnInit {

    public style;

    public showOverflow = false;

    private animationDone$: Subject<void>;

    public constructor(
        private overflowCtrl: OverflowControl
    ) {
        this.animationDone$ = new Subject();
    }

    ngOnInit() {
        this.overflowCtrl.show.pipe(
            tap(() => this.showOverflow = true),
            switchMap(() => this.overflowCtrl.hide)
        ).subscribe(() => this.showOverflow = false);
    }

    public animationDone() {
        this.animationDone$.next();
    }

    public beforeRemove(event: AsyncEvent) {
        this.animationDone$.subscribe(() => event.done());
    }
}`;

    public sourceHtml = `<div class="card bg-white border-info bg-width mb-3" style="width: 100%;">

    <div class="card-header d-flex flex-row">
        <strong>Async Operations 1 - The Problem</strong>
        <ngx-responsivemenu class="responsive-menu" [showMax]=0 [customOverflow]=true>
            <button type="button" ngxResponsiveMenuItem>Button 1</button>
            <button type="button" ngxResponsiveMenuItem>Button 2</button>
            <button type="button" ngxResponsiveMenuItem>Button 3</button>
            <button type="button" ngxResponsiveMenuItem>Button 4</button>
            <button class="btn btn-sm btn-secondary" ngxResponsiveMenuToggle>
                <i class="fa fa-bars"></i>
            </button>
        </ngx-responsivemenu>
    </div>

    <div class="card-content">
        <div class="card-body" style="height: 300px;">
            <p>some text to fill this up</p>
        </div>

        <div class="sidebar" *ngIf="showOverflow" [@SlideInOut]="'slide'" (@SlideInOut.done)="animationDone($event)">
            <div class="sidebar-content">
                <ngx-responsivemenu-overflow (beforeRemove)="beforeRemove($event)"></ngx-responsivemenu-overflow>
            </div>
        </div>
    </div>
</div>`;

    public sourceScss = `:host {
    .card-content {
        position: relative;
    }

    .responsive-menu {
        flex: 1;
    }

    .sidebar {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        width: 0;
        overflow-x:hidden;
        background: #F7F7F7;
        z-index: 10;
    }

    .sidebar-content {
        padding: .3rem .5rem;
    }
}`;

    public constructor(
        private overflowCtrl: OverflowControl
    ) {
        this.animationDone$ = new Subject();
    }

    ngOnInit() {
        /** create array with 10 items */
        this.overflowCtrl.show.pipe(
            tap(() => this.showOverflow = true),
            switchMap(() => this.overflowCtrl.hide),
        ).subscribe(() => this.showOverflow = false);
    }

    public animationDone() {
        this.animationDone$.next();
    }

    public beforeRemove(event: AsyncEvent) {
        this.animationDone$.subscribe(() => event.done());
    }
}

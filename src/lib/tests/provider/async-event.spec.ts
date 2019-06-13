import { AsyncEvent } from "lib/public-api";
import { EventEmitter } from "@angular/core";
import { take, delay } from "rxjs/operators";
import { from } from "rxjs";

describe("Provider: AsyncEvent", () => {

    it("should complete event", (done) => {
        const eventEmitter = new EventEmitter();

        const asyncEvent = new AsyncEvent();
        const eventDone  = asyncEvent.completed;

        eventEmitter
            .pipe( take(1), delay(200))
            .subscribe((event: AsyncEvent) => event.done());

        from(eventDone)
            .subscribe((completed: boolean) => {
                expect(completed).toBeTruthy();
                done();
            });

        eventEmitter.emit(asyncEvent);
    });

    it("should cancel event", (done) => {
        const eventEmitter = new EventEmitter();

        const asyncEvent = new AsyncEvent();
        const eventDone  = asyncEvent.completed;

        eventEmitter
            .pipe( take(1), delay(200))
            .subscribe((event: AsyncEvent) => event.cancel());

        from(eventDone)
            .subscribe((completed: boolean) => {
                expect(completed).toBeFalsy();
                done();
            });

        eventEmitter.emit(asyncEvent);
    });
});

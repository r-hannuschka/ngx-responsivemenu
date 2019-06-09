import { Subject } from "rxjs";

/**
 * AsyncEvent which will emits through EventEmitter
 * so we can do some (async) operations before we
 * let pass / cancel the event.
 *
 */
export class AsyncEvent {

    private event$: Subject<boolean>;

    public constructor() {
        this.event$ = new Subject();
    }

    /**
     * returns promise which holds current state from event
     * @internal
     */
    public get completed(): Promise<boolean> {
        return this.event$.toPromise();
    }

    /**
     * should be called to continue event
     *
     * @example
     *
     * public async onAsyncHook(event: AsyncEvent) {
     *     await this.doAsyncOperation();
     *     event.done();
     * }
     */
    public done() {
        this.event$.next(true);
        this.complete();
    }

    /**
     * should be called to continue event
     *
     * @example
     *
     * public async onAsyncHook(event: AsyncEvent) {
     *     try {
     *         await this.doAsyncOperation();
     *         event.done();
     *     } catch (fatalError: Error) {
     *         event.cancel();
     *     }
     * }
     */
    public cancel() {
        this.event$.next(false);
        this.complete();
    }

    private complete() {
        this.event$.complete();
    }
}

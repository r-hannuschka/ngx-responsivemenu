import { Subject, Observable } from "rxjs";

export class AsyncEvent {

    private event$: Subject<boolean> = new Subject();

    public get completed(): Promise<boolean> {
        return this.event$.toPromise();
    }

    public done() {
        this.event$.next(true);
        this.complete();
    }

    public cancel() {
        this.event$.next(false);
        this.complete();
    }

    private complete() {
        this.event$.complete();
        this.event$ = null;
    }
}

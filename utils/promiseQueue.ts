export type PromiseFunction = () => Promise<any>;

export default class PromiseQueue {
    private queue: Array<() => any>;
    private isPause: boolean;
    private count: number;
    private doneDeferred: {
        resolve: () => void 
        reject: (reason?: any) => void
    } | null = null;

    constructor(private concurrency: number = 1) {
        this.queue = [];
        this.isPause = false;
        this.count = 0;
    }

    public pause() {
        this.isPause = true;
    }

    public resume() {
        this.isPause = false;
        this.next();
    }

    public add(fn: PromiseFunction | PromiseFunction[]): PromiseQueue | TypeError {
        if (Array.isArray(fn)) {
            if (fn.length > 1) {
                const result = this.add(fn.shift() !);
                if (!(result instanceof TypeError)) {
                    return this.add(fn);
                }
            }
            return this.add(fn[0]);
        } else {
            new Promise((resolve, reject) => {
                const run = () => {
                    this.count++;
                    (fn as () => Promise<any>)().then((value: any) => {
                        resolve(value);
                        this.count--;
                        this.next();
                    },
                    (error: Error) => {
                        reject(error);

                        if (this.doneDeferred) {
                            this.doneDeferred.reject(error);
                        }

                        this.count--;
                        this.next();
                    });
                };

                if (this.count < this.concurrency && !this.isPause) {
                    run();
                } else {
                    this.queue.push(run);
                }
            });
            return this;
        }
    }

    public get waitingCount(): number {
        return this.queue.length;
    }

    public get ongoingCount(): number {
        return this.count;
    }

    public get done(): Promise<void> {      
        return new Promise((resolve, reject) => {
            this.doneDeferred = {
                resolve: resolve,
                reject: reject
            };
        });
    }

    private next() {
        if (this.count >= this.concurrency || this.isPause) {
            return;
        }

        if (this.queue.length > 0) {
            const firstQueueTask = this.queue.shift();
            if (firstQueueTask) {
                firstQueueTask();
            }
        }
        else if (this.doneDeferred) {
            this.doneDeferred.resolve();
        }
    }
}
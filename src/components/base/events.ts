export type EventName = string | RegExp;
export type Subscriber<T = unknown> = (data: T) => void;

export type EmitterEvent = {
    eventName: string;
    data: unknown;
};

export interface IEvents {
    on<T>(event: EventName, callback: Subscriber<T>): void;
    off<T>(event: EventName, callback: Subscriber<T>): void;
    emit<T>(event: string, data?: T): void;
    trigger<T>(event: string, context?: Partial<T>): (data: T) => void;
    onAll(callback: (event: EmitterEvent) => void): void;
    offAll(): void;
}

export class EventEmitter implements IEvents {
    private events: Map<EventName, Set<Subscriber>> = new Map();

    on<T>(eventName: EventName, callback: Subscriber<T>): void {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Set());
        }
        this.events.get(eventName)!.add(callback as Subscriber);
    }

    off<T>(eventName: EventName, callback: Subscriber<T>): void {
        const subs = this.events.get(eventName);
        if (!subs) return;

        subs.delete(callback as Subscriber);
        if (subs.size === 0) this.events.delete(eventName);
    }

    emit<T>(eventName: string, data?: T): void {
        this.events.forEach((subscribers, name) => {
            if (name === '*') {
                for (const callback of Array.from(subscribers)) {
                    callback({ eventName, data } satisfies EmitterEvent);
                }
                return;
            }

            let matched = false;

            if (name instanceof RegExp) {
                name.lastIndex = 0;
                matched = name.test(eventName);
            } else {
                matched = name === eventName;
            }

            if (matched) {
                for (const callback of Array.from(subscribers)) {
                    callback(data);
                }
            }
        });
    }

    onAll(callback: (event: EmitterEvent) => void): void {
        this.on('*', callback);
    }

    offAll(): void {
        this.events.clear();
    }

    trigger<T>(eventName: string, context?: Partial<T>): (data: T) => void {
        return (data: T) => {
            const payload =
                context && typeof context === 'object'
                    ? ({ ...(data as object), ...(context as object) } as T)
                    : data;

            this.emit(eventName, payload);
        };
    }
}
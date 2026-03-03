export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) { }

    protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
        if (!element) return;
        element.src = src;
        if (alt !== undefined) element.alt = alt;
    }

    render(data?: Partial<T>): HTMLElement {
        if (data) Object.assign(this, data);
        return this.container;
    }
}
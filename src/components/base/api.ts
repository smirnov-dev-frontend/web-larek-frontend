export type ApiPostMethod = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;

        const baseHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        const extraHeaders =
            options.headers && typeof options.headers === 'object'
                ? (options.headers as Record<string, string>)
                : {};

        this.options = {
            ...options,
            headers: {
                ...baseHeaders,
                ...extraHeaders,
            },
        };
    }

    private buildUrl(uri: string): string {
        const a = this.baseUrl.replace(/\/+$/, '');
        const b = uri.startsWith('/') ? uri : `/${uri}`;
        return a + b;
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 204) return undefined as T;

        const contentType = response.headers.get('content-type') ?? '';
        const isJson = contentType.includes('application/json');

        if (response.ok) {
            if (isJson) {
                const text = await response.text();
                return (text ? JSON.parse(text) : undefined) as T;
            }
            return (await response.text()) as T;
        }

        if (isJson) {
            const data = (await response.json()) as { error?: string };
            return Promise.reject(data.error ?? response.statusText);
        }

        const text = await response.text();
        return Promise.reject(text || response.statusText);
    }

    get<T>(uri: string): Promise<T> {
        return fetch(this.buildUrl(uri), {
            ...this.options,
            method: 'GET',
        }).then((r) => this.handleResponse<T>(r));
    }

    post<T>(uri: string, data: unknown, method: ApiPostMethod = 'POST'): Promise<T> {
        return fetch(this.buildUrl(uri), {
            ...this.options,
            method,
            body: JSON.stringify(data),
        }).then((r) => this.handleResponse<T>(r));
    }
}
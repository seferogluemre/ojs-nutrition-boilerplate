import { Static, t, TSchema } from 'elysia';

export const paginationQueryDto = t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    perPage: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
});

export type PaginationQuery = Static<typeof paginationQueryDto>;

export const paginationResponseDto = <T extends TSchema>(dataSchema: T) => t.Object({
    data: t.Array(dataSchema),
    meta: t.Object({
        total: t.Number(),
        page: t.Number(),
        perPage: t.Number(),
        pageCount: t.Number(),
    }),
});

export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        total: number;
        page: number;
        perPage: number;
        pageCount: number;
    };
};

export class PaginationService {
    static getPaginationParams(query?: PaginationQuery) {
        const page = query?.page || 1;
        const perPage = query?.perPage || 20;
        const skip = (page - 1) * perPage;

        return {
            page,
            perPage,
            skip,
        };
    }

    static createPaginatedResponse<T, R = T>({
        data,
        total,
        query,
        formatter,
    }: {
        data: T[];
        total: number;
        query?: PaginationQuery;
        formatter?: (item: T) => R;
    }): PaginatedResponse<R> {
        const { page, perPage } = this.getPaginationParams(query);

        return {
            data: formatter ? data.map(formatter) : data as unknown as R[],
            meta: {
                total,
                page,
                perPage,
                pageCount: Math.ceil(total / perPage),
            },
        };
    }
}

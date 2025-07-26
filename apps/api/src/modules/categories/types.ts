import { Static } from 'elysia';
import { categoryCreateDto, categoryResponseDto, categoryShowDto, categoryUpdateDto } from './dtos';

export type CategoryCreatePayload = Static<(typeof categoryCreateDto)['body']>;
export type CategoryUpdatePayload = Static<(typeof categoryUpdateDto)['body']>;
export type CategoryShowParams = Static<(typeof categoryShowDto)['params']>;
export type CategoryShowResponse = Static<typeof categoryResponseDto>;
export type CategoryDestroyParams = CategoryShowParams;

// Hierarchical category types
export type SubChildCategory = {
    name: string;
    slug: string;
    order: number;
};

export type ChildCategory = {
    id: string;
    name: string;
    slug: string;
    order: number;
    sub_children: SubChildCategory[];
};

export type TopSeller = {
    id: string;
    name: string;
    slug: string;
    description: string;
    picture_src: string;
};

export type HierarchicalCategory = {
    id: string;
    name: string;
    slug: string;
    order: number;
    children: ChildCategory[];
    top_sellers: TopSeller[];
}; 
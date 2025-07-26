import { Category } from '#prisma/client';
import { BaseFormatter } from '../../utils';
import { categoryResponseDto } from './dtos';
import { CategoryShowResponse } from './types';

type CategoryWithChildren = Category & {
    children?: (Category & {
        children?: Category[];
    })[];
    top_sellers?: {
        name: string;
        slug: string;
        description: string;
        picture_src: string;
    }[];
};

export abstract class CategoryFormatter {
    static response(data: CategoryWithChildren) {
        const convertedData = BaseFormatter.convertData<CategoryShowResponse>(
            {
                id: data.uuid,
                name: data.name,
                slug: data.slug,
                order: data.order,
                children: data.children?.map(child => ({
                    id: child.uuid,
                    name: child.name,
                    slug: child.slug,
                    order: child.order,
                    sub_children: child.children?.map(subChild => ({
                        id: subChild.uuid,
                        name: subChild.name,
                        slug: subChild.slug,
                        order: subChild.order,
                    })) || [],
                })) || [],
                top_sellers: data.top_sellers || [],
            },
            categoryResponseDto,
        );
        return convertedData;
    }
} 
import { BaseFormatter } from '../../utils';
import { categoryResponseDto } from './dtos';
import { CategoryShowResponse } from './types';
import type { Category } from '#prisma/index';

type CategoryWithChildren = Category & {
    children?: (Category & {
        children?: Category[];
    })[];
    top_sellers?: {
        name: string;
        slug: string;
        description: string;
        picture_src: string;
        price: number;
        average_rating: number;
        review_count: number;
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
                children: data.children?.map((child: CategoryWithChildren) => ({
                    id: child.uuid,
                    name: child.name,
                    slug: child.slug,
                    order: child.order,
                    sub_children: child.children?.map((subChild: Category) => ({
                        id: subChild.uuid,
                        name: subChild.name,
                        slug: subChild.slug,
                        order: subChild.order,
                    })) || [],
                    products: (child as any)?.products?.map((product: any) => ({
                        id: product.uuid,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        picture_src: product.primaryPhotoUrl,
                    })) || [],
                })) || [],
                top_sellers: data.top_sellers || [],
            },
            categoryResponseDto,
        );
        return convertedData;
    }
} 
import { Category } from '#prisma/client';
import { BaseFormatter } from '../../utils';
import { categoryResponseDto } from './dtos';
import { CategoryShowResponse } from './types';

export abstract class CategoryFormatter {
    static response(data: Category & { products?: { id: number; name: string; photos?: { id: number; url: string; }[] }[] }) {
        const convertedData = BaseFormatter.convertData<CategoryShowResponse>(
            {
                ...data,
            },
            categoryResponseDto,
        );
        return convertedData;
    }
} 
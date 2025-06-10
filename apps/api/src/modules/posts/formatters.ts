import { Post } from '#prisma/client';
import { postResponseDto } from './dtos';
import { PostShowResponse } from './types';
import { BaseFormatter } from '../../utils';

export abstract class PostFormatter {
    static response(data: Post & { author: { id: string; name: string } }) {
        const convertedData = BaseFormatter.convertData<PostShowResponse>(
            {
                ...data,
                author: {
                    id: data.author.id,
                    name: data.author.name,
                },
            },
            postResponseDto,
        );
        return convertedData;
    }
} 
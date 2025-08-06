import { Elysia } from 'elysia';
import { canReviewDto, commentIndexDto } from './dto';
import { ProductCommentFormatter } from './formatter';
import { checkUserCanReviewProduct } from './middleware';
import { ProductCommentService } from './service';
import { CommentImageUploadService } from './upload-service';

export const app = new Elysia({
  prefix: '/products/:id/comments',
  detail: {
    tags: ['Product Comments'],
  },
})
  .get(
    '',
    async ({ params, query }) => {
      const offset = query.offset || 0;
      const limit = query.limit || 10;
      const page = Math.floor(offset / limit) + 1;

      const { data, total } = await ProductCommentService.getComments({
        productId: params.id,
        page,
        limit,
      });

      return {
        data: ProductCommentFormatter.list(data),
        meta: {
          limit,
          total,
          offset,
          hasNext: offset + limit < total,
        },
      };
    },
    commentIndexDto,
  )
  .post(
    '',
    async ({ request, params, set }) => {
      let imagePaths: string[] = [];
      const commentData: {
        rating: number;
        title?: string;
        content?: string;
        images?: string[];
      } = {
        rating: 0,
      };

      const contentType = request.headers.get('content-type');
      
      if (contentType?.includes('multipart/form-data')) {
        try {
          const formData = await request.formData();
          const files: File[] = [];
          for (const [key, value] of formData.entries()) {
            if (key === 'images' && typeof value === 'object' && 'name' in value) {
              files.push(value as File);
            } else if (key === 'rating') {
              commentData.rating = Number(value);
            } else {
              commentData[key] = value || undefined;
            }
          }

          // Upload images if present
          if (files.length > 0) {
            imagePaths = await CommentImageUploadService.uploadCommentImages(
              params.id,
              files as File[]
            );
          }

          commentData.images = imagePaths;
        } catch (error) {
          set.status = 400;
          return {
            error: error instanceof Error ? error.message : 'Dosya yükleme hatası',
          };
        }
      } else {
        // Handle regular JSON request - but we're expecting multipart only for file uploads
        set.status = 400;
        return {
          error: 'Bu endpoint sadece multipart/form-data kabul eder',
        };
      }

      // Validate required fields
      if (!commentData.rating || commentData.rating < 1 || commentData.rating > 5) {
        set.status = 400;
        return {
          error: 'Değerlendirme 1-5 arasında olmalıdır.',
        };
      }

      const comment = await ProductCommentService.createComment({
        productId: params.id,
        userId: "5d160bc9-c3bd-476b-add2-71161b5ed8fd",
        data: commentData,
      });

      set.status = 201;
      return ProductCommentFormatter.response(comment);
    }
)
  .get(
    '/can-review',
    async ({ params }) => {
      const result = await checkUserCanReviewProduct("5d160bc9-c3bd-476b-add2-71161b5ed8fd", params.id);
     
      return result;
    },
    canReviewDto,
  )
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader } from '#/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu';
import { Calendar, Image as ImageIcon, MessageCircle, MoreHorizontal, ThumbsUp, Trash2, User } from 'lucide-react';
import { CommentCardProps } from '../types';
import { StarRating } from './star-rating';

export const CommentCard = ({ comment, onDelete }: CommentCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">{comment.user.maskedName}</div>
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={comment.rating} size="sm" />
                <span className="text-xs text-muted-foreground">({comment.rating}/5)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onDelete(comment)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yorumu Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {comment.title && (
          <h4 className="font-medium text-sm mb-2">{comment.title}</h4>
        )}
        
        {comment.content && (
          <p className="text-sm text-muted-foreground mb-3">{comment.content}</p>
        )}
        
        {comment.images.length > 0 && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              <span>{comment.images.length} fotoğraf</span>
            </div>
            <div className="flex space-x-2">
              {comment.images.map((image, index) => (
                <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Yararlı (12)
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              Yanıtla
            </Button>
          </div>
          <Badge variant={comment.rating >= 4 ? "default" : comment.rating >= 3 ? "secondary" : "destructive"}>
            {comment.rating >= 4 ? "Olumlu" : comment.rating >= 3 ? "Nötr" : "Olumsuz"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

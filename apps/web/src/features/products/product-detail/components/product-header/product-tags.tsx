import { cn } from "#lib/utils";

interface ProductTagsProps {
  tags: string[];
}

export function ProductTags({ tags }: ProductTagsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tagString: string, index: number) => {
        try {
          const parsedTags = JSON.parse(tagString);
          return Array.isArray(parsedTags) ? parsedTags.map((tag: string, tagIndex: number) => (
            <span
              key={`${index}-${tagIndex}`}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium border",
                "bg-gray-100 text-gray-700 border-gray-200"
              )}
            >
              {tag}
            </span>
          )) : null;
        } catch {
          return (
            <span
              key={index}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium border",
                "bg-gray-100 text-gray-700 border-gray-200"
              )}
            >
              {tagString}
            </span>
          );
        }
      })}
    </div>
  );
} 
import { cn } from "#lib/utils.js";
import { Upload, X } from "lucide-react";
import * as React from "react";

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  className?: string;
  disabled?: boolean;
}

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [preview, setPreview] = React.useState<string>("");

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  return (
    <div className="relative group">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
        {preview && (
          <img
            src={preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        )}
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1 truncate max-w-24">
        {file.name}
      </p>
    </div>
  );
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/jpeg,image/png,image/webp",
  className,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // File validations
    const validFiles = files.filter(file => {
      // Check file type
      if (!accept.split(',').some(type => file.type === type.trim())) {
        alert(`Dosya türü desteklenmiyor: ${file.name}. Sadece JPG, PNG ve WebP dosyaları kabul edilir.`);
        return false;
      }
      
      // Check file size
      if (file.size > maxSize) {
        alert(`Dosya boyutu çok büyük: ${file.name}. Maksimum ${maxSize / 1024 / 1024}MB olmalıdır.`);
        return false;
      }
      
      return true;
    });

    // Check total file count
    const newFiles = [...value, ...validFiles].slice(0, maxFiles);
    onChange(newFiles);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onChange(newFiles);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const changeEvent = {
      target: { files }
    } as React.ChangeEvent<HTMLInputElement>;
    handleFileSelect(changeEvent);
  };

  const canAddMore = value.length < maxFiles && !disabled;

  return (
    <div className={cn("space-y-4", className)}>
      {/* File previews */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((file, index) => (
            <ImagePreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div
          className={cn(
            "border-2 border-dashed border-gray-300 rounded-lg p-6",
            "hover:border-gray-400 transition-colors duration-200",
            "cursor-pointer bg-gray-50 hover:bg-gray-100"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                Fotoğraf yüklemek için tıklayın
              </p>
              <p className="text-xs text-gray-500">
                veya dosyaları buraya sürükleyin
              </p>
            </div>
            <p className="text-xs text-gray-400">
              JPG, PNG, WebP (maks. {maxSize / 1024 / 1024}MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* File count info */}
      <div className="text-xs text-gray-500">
        {value.length} / {maxFiles} fotoğraf seçildi
      </div>
    </div>
  );
}
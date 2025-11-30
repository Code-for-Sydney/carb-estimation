import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploadProps {
    onImagesSelected: (files: File[]) => void;
    selectedImages: File[];
    onRemoveImage: (index: number) => void;
}

export function ImageUpload({ onImagesSelected, selectedImages, onRemoveImage }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            onImagesSelected(files);
        }
    }, [onImagesSelected]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
            onImagesSelected(files);
        }
    }, [onImagesSelected]);

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer",
                    isDragging
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
                )}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleFileInput}
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className={clsx(
                        "p-3 rounded-full transition-colors",
                        isDragging ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                    )}>
                        <Upload className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-slate-900">
                            Drop images here or <span className="text-emerald-600">browse</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            Upload photos of your meal or menu
                        </p>
                    </div>
                </label>
            </div>

            {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedImages.map((file, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => onRemoveImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

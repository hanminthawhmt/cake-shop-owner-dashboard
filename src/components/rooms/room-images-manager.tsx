'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { RoomImage } from '@/types/rooms';
import { useUploadRoomImage, useDeleteRoomImage } from '@/hooks/use-rooms';
import { Upload, Trash2, Loader2, ImageIcon, Plus } from 'lucide-react';

interface RoomImagesManagerProps {
  roomId: number;
  images: RoomImage[];
}

export function RoomImagesManager({ roomId, images }: RoomImagesManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadRoomImage(roomId);
  const deleteMutation = useDeleteRoomImage(roomId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file, {
        onSuccess: () => {
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
      });
    }
  };

  const handleDelete = (imageId: number) => {
    if (confirm('Are you sure you want to remove this room photo?')) {
      deleteMutation.mutate(imageId);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F2E8DF] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2E8DF]">
        <div>
          <h3 className="text-xs font-bold text-[#3D2314] uppercase tracking-wider">
            Room Photos & Gallery ({images.length})
          </h3>
          <p className="text-xs text-[#9C8A7E]">
            Upload interior and decoration photos for birthday room reservations
          </p>
        </div>

        {/* Hidden File Input & Trigger Button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D0694E] text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer disabled:opacity-60 self-start sm:self-auto"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploadMutation.isPending ? 'Uploading Photo...' : 'Upload New Photo'}</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#E6D7CC] rounded-2xl p-10 text-center space-y-3 bg-[#FFFDF9] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF0EE] text-[#E07A5F] flex items-center justify-center border border-[#F4B4BA]/40">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#3D2314]">No room photos uploaded yet</p>
            <p className="text-xs text-[#7C685C]">
              Click here to upload room pictures (JPEG, PNG, WebP)
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative h-40 rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#F2E8DF] shadow-2xs"
            >
              <Image
                src={img.url}
                alt="Room Photo"
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover Overlay with Delete Action */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 shadow-md transition-colors cursor-pointer"
                  title="Remove room photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Additional Dropzone Tile */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-40 rounded-xl border-2 border-dashed border-[#E6D7CC] bg-[#FFFDF9] hover:bg-[#FAF6F0] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer text-[#7C685C] hover:text-[#3D2314]"
          >
            <Plus className="w-6 h-6 text-[#E07A5F]" />
            <span className="text-xs font-semibold">Add Photo</span>
          </div>
        </div>
      )}
    </div>
  );
}

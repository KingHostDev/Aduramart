"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Preview = {
  name: string;
  url: string;
};

export function ProductImageUploader({ disabled = false }: { disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  function updateFiles(files: File[]) {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));

    if (files.length > 5) {
      setError("You can upload a maximum of 5 product photos.");
      files = files.slice(0, 5);
    } else {
      setError("");
    }

    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));

    if (inputRef.current) {
      inputRef.current.files = transfer.files;
    }

    setPreviews(files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })));
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateFiles(Array.from(event.target.files ?? []));
  }

  function removeImage(index: number) {
    const currentFiles = Array.from(inputRef.current?.files ?? []);
    updateFiles(currentFiles.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="grid gap-3">
      <input
        ref={inputRef}
        name="images"
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        required
        onChange={handleChange}
        className="sr-only"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="group grid min-h-[210px] place-items-center rounded-[26px] border-2 border-dashed border-[#cfc2ff] bg-[#fbf9ff] p-5 text-center transition hover:border-[#6C3CF0] hover:bg-[#F3EEFF] disabled:cursor-not-allowed disabled:bg-[#F9FAFB]"
      >
        <span className="grid gap-3 justify-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-[#6C3CF0] text-white shadow-xl shadow-purple-500/20 transition group-hover:scale-105">
            <ImagePlus size={26} />
          </span>
          <span className="text-lg font-black text-[#1F1F1F]">Add product photos</span>
          <span className="max-w-sm text-sm font-bold leading-6 text-[#6B7280]">Upload 1 to 5 clear images. The first photo becomes the marketplace card image.</span>
        </span>
      </button>

      {error ? <p className="rounded-2xl bg-[#fff1f1] p-3 text-sm font-extrabold text-[#EF4444]">{error}</p> : null}

      {previews.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {previews.map((preview, index) => (
            <figure key={preview.url} className="group relative overflow-hidden rounded-2xl border border-[#ece6ff] bg-white">
              <div className="relative aspect-square">
                <Image src={preview.url} alt={preview.name} fill className="object-cover" sizes="160px" />
              </div>
              <figcaption className="truncate px-3 py-2 text-xs font-extrabold text-[#6B7280]">{index === 0 ? "Cover photo" : `Photo ${index + 1}`}</figcaption>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/92 text-[#6C3CF0] shadow-lg"
                aria-label={`Remove ${preview.name}`}
              >
                <X size={15} />
              </button>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}

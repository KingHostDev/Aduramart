"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.length ? images : ["/product-placeholder.svg"];
  const [selected, setSelected] = useState(gallery[0]);

  return (
    <div className="card overflow-hidden rounded-[24px] p-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#F3EEFF]">
        <Image src={selected} alt={name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 52vw" />
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {gallery.slice(0, 5).map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelected(image)}
              className={`relative aspect-square overflow-hidden rounded-xl border transition ${selected === image ? "border-[#6C3CF0] ring-2 ring-[#6C3CF0]/20" : "border-[#ece6ff] opacity-78 hover:opacity-100"}`}
              aria-label={`View product image ${index + 1}`}
            >
              <Image src={image} alt={`${name} ${index + 1}`} fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
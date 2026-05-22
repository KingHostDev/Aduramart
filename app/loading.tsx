import { HeartHandshake } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FFF9F2]">
      <div className="text-center">
        <div className="adura-loader mx-auto grid size-20 place-items-center rounded-[26px] bg-[#6C3CF0] text-white shadow-2xl shadow-purple-500/25">
          <HeartHandshake size={34} />
        </div>
        <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.24em] text-[#6C3CF0]">AduraMart</p>
        <p className="mt-2 text-sm font-medium text-[#6B7280]">Preparing a peaceful marketplace</p>
      </div>
    </main>
  );
}
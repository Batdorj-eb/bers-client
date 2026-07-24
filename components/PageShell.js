import AdSlot from "@/components/AdSlot";
import Sidebar from "@/components/Sidebar";
import { getAds } from "@/lib/api";

export default async function PageShell({
  children,
  showMidAd = false,
  showTopAd = true,
}) {
  let ads = {};
  try {
    ads = (await getAds()) || {};
  } catch {
    ads = {};
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {showTopAd && (
        <AdSlot ad={ads.topBanner} size="banner" className="mb-8" />
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          {children}
          {showMidAd && (
            <AdSlot ad={ads.midContent} size="banner" className="mt-8" />
          )}
        </div>
        <Sidebar ads={ads} />
      </div>
    </div>
  );
}

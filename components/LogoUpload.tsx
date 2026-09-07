"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoUpload({
  tenantId,
  currentLogoUrl,
}: {
  tenantId: string;
  currentLogoUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const extension = file.name.split(".").pop();
    const path = `${tenantId}/logo.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("branding")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      setError("Uploaden mislukt: " + uploadError.message);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("branding").getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("tenants")
      .update({ logo_url: `${publicUrl.publicUrl}?v=${Date.now()}` })
      .eq("id", tenantId);

    setUploading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div>
      <label className="text-xs font-medium text-slate-600">Logo (op factuur)</label>
      <div className="mt-2 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          {currentLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentLogoUrl} alt="Logo" className="h-full w-full object-contain" />
          ) : (
            <ImageUp className="h-5 w-5 text-slate-300" />
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-xs"
          />
          <p className="mt-1 text-xs text-slate-500">
            {uploading ? "Bezig met uploaden..." : "PNG, JPG of SVG — verschijnt linksboven op je facturen."}
          </p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

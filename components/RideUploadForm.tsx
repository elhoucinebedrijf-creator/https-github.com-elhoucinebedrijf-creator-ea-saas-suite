"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RideUploadForm({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError(null);

    const supabase = createClient();
    const storagePath = `${tenantId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("ride-uploads")
      .upload(storagePath, file);

    if (uploadError) {
      setStatus("error");
      setError("Uploaden mislukt: " + uploadError.message);
      return;
    }

    const res = await fetch("/api/rides/register-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storagePath }),
    });

    if (!res.ok) {
      setStatus("error");
      setError("Verwerken van bestand kon niet worden gestart.");
      return;
    }

    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-6">
      <p className="text-sm font-medium text-slate-700">Rittenbestand uploaden (CSV)</p>
      <p className="mt-1 text-xs text-slate-500">
        Exporteer je ritten uit je boordcomputer/KVM-systeem als CSV en upload ze hier. Nieuwe
        ritten verschijnen hieronder zodra ze verwerkt zijn.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={status === "uploading"}
        className="mt-4 text-sm"
      />
      {status === "uploading" && <p className="mt-2 text-xs text-slate-500">Bezig met uploaden...</p>}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

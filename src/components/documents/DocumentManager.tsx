"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Trash2, Download, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DocItem {
  id: number;
  category: string;
  fileName: string;
  fileType: string | null;
  dataUrl: string;
  createdAt: string;
}

interface Props {
  title?: string;
  endpoint: string; // e.g. /api/employee-documents
  ownerKey: string; // e.g. employeeId
  ownerId: number;
  categories: string[];
}

export function DocumentManager({ title = "Documents", endpoint, ownerKey, ownerId, categories }: Props) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [category, setCategory] = useState(categories[0]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch(`${endpoint}?${ownerKey}=${ownerId}`);
    if (res.ok) setDocs((await res.json()).documents ?? []);
  }
  useEffect(() => {
    if (ownerId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [ownerKey]: ownerId, category, fileName: file.name, fileType: file.type, dataUrl }),
        });
      }
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <Card className="space-y-4">
      <CardTitle>{title}</CardTitle>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Select label="Type" value={category} onChange={(e) => setCategory(e.target.value)} options={categories.map((c) => ({ value: c, label: c }))} />
        </div>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <Button type="button" variant="secondary" disabled={busy} onClick={() => fileRef.current?.click()}>
          <Upload size={15} /> {busy ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {docs.length === 0 ? (
        <p className="text-sm text-gray-400">No documents uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <span className="font-medium">{d.fileName}</span>
                <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{d.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <a href={d.dataUrl} download={d.fileName} className="rounded p-1 text-brand-red hover:bg-gray-100" title="Download"><Download size={16} /></a>
                <button onClick={() => remove(d.id)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { documents as seed } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export default function DocumentsPage() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState("Gayatri H");
  const [type, setType] = useState("Aadhaar");
  const [fileName, setFileName] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Uploads</h2>
          <p className="text-sm text-gray-500">Aadhaar, PAN and supporting documents.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Upload Document</Button>
      </div>

      <Table headers={["Employee", "Type", "File", "Uploaded", "Status"]}>
        {rows.map((d) => (
          <tr key={d.id} className="hover:bg-gray-50/80">
            <td className="px-4 py-3 font-medium">{d.employee}</td>
            <td className="px-4 py-3">
              <Badge tone={d.type === "Aadhaar" ? "blue" : "orange"}>{d.type}</Badge>
            </td>
            <td className="px-4 py-3">{d.fileName}</td>
            <td className="px-4 py-3">{formatDate(d.uploadedAt)}</td>
            <td className="px-4 py-3">
              <Badge tone="green">Verified</Badge>
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={open} onClose={() => setOpen(false)} title="Upload Document">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setRows((prev) => [
              {
                id: `d${Date.now()}`,
                employee,
                type,
                fileName: fileName || `${type.toLowerCase()}_upload.pdf`,
                uploadedAt: new Date().toISOString().slice(0, 10),
              },
              ...prev,
            ]);
            setOpen(false);
          }}
        >
          <Input label="Employee Name" value={employee} onChange={(e) => setEmployee(e.target.value)} />
          <Select
            label="Document Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: "Aadhaar", label: "Aadhaar" },
              { value: "PAN", label: "PAN" },
              { value: "Supporting", label: "Supporting Document" },
            ]}
          />
          <Input
            label="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="document.pdf"
          />
          <Input type="file" label="Choose File" />
          <Button type="submit" className="w-full">Upload</Button>
        </form>
      </Modal>
    </div>
  );
}

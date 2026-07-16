"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { jobOpenings } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

type Job = (typeof jobOpenings)[number];

export default function CandidateJobOpeningsPage() {
  const [selected, setSelected] = useState<Job | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Job Openings</h2>
        <p className="text-sm text-gray-500">
          Available roles — CTC, take-home, invoice & clause dates included.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobOpenings.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.role}</h3>
                <p className="text-sm text-brand-red">{job.company}</p>
              </div>
              <Badge tone={job.process === "Voice" ? "red" : "blue"}>{job.process}</Badge>
            </div>
            <p className="mt-2 text-sm text-gray-500">{job.location}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Skills:</span> {job.skills}</p>
              <p><span className="font-medium text-gray-800">Languages:</span> {job.languages}</p>
              <p><span className="font-medium text-gray-800">CTC:</span> {job.ctc}</p>
              <p><span className="font-medium text-gray-800">Take-home:</span> ₹{job.takeHome}</p>
            </div>
            <Button className="mt-4 w-full" variant="outline" onClick={() => setSelected(job)}>
              View Details
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.role || "Job Details"}
        wide
      >
        {selected && (
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <p><span className="font-semibold">Company:</span> {selected.company}</p>
            <p><span className="font-semibold">Process:</span> {selected.process}</p>
            <p><span className="font-semibold">Location:</span> {selected.location}</p>
            <p><span className="font-semibold">Skills:</span> {selected.skills}</p>
            <p><span className="font-semibold">Languages:</span> {selected.languages}</p>
            <p><span className="font-semibold">Salary:</span> ₹{selected.salary}</p>
            <p><span className="font-semibold">CTC:</span> {selected.ctc}</p>
            <p><span className="font-semibold">Take Home:</span> ₹{selected.takeHome}</p>
            <p><span className="font-semibold">Invoice Date:</span> {formatDate(selected.invoiceDate)}</p>
            <p><span className="font-semibold">Clause Date:</span> {formatDate(selected.clauseDate)}</p>
            <div className="sm:col-span-2">
              <p className="font-semibold">Job Description</p>
              <p className="mt-1 text-gray-600">{selected.jd}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/Card";
import { useUserLabel } from "@/hooks/useAuth";
import { conversations, messages as seedMessages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Bell, Send } from "lucide-react";
import { useMemo, useState } from "react";

export default function MessagesPage() {
  const { name } = useUserLabel();
  const [active, setActive] = useState(conversations[0].id);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState(seedMessages);
  const unread = useMemo(
    () => conversations.reduce((s, c) => s + c.unread, 0),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">
            Chat with Admin / HR — signed in as <strong>{name}</strong>
          </p>
        </div>
        {unread > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-3 py-1.5 text-sm font-semibold text-brand-red">
            <Bell size={14} />
            {unread} new notification{unread > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="grid min-h-[480px] md:h-[560px] md:grid-cols-[260px_1fr]">
          <div className="border-b border-gray-100 bg-gray-50/60 md:border-b-0 md:border-r">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "flex w-full flex-col border-b border-gray-100 px-4 py-3 text-left hover:bg-white",
                  active === c.id && "bg-white border-l-4 border-l-brand-red"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                  <div className="flex items-center gap-2">
                    {c.unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                        {c.unread}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                </div>
                <p className="mt-1 truncate text-xs text-gray-500">{c.lastMessage}</p>
              </button>
            ))}
          </div>
          <div className="flex min-h-[360px] flex-col">
            <div className="border-b border-gray-100 px-4 py-3 font-semibold">
              {conversations.find((c) => c.id === active)?.name}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm sm:max-w-[75%]",
                      m.mine
                        ? "rounded-br-md bg-brand-red text-white"
                        : "rounded-bl-md bg-gray-100 text-gray-800"
                    )}
                  >
                    <p>{m.text}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        m.mine ? "text-white/70" : "text-gray-400"
                      )}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-gray-100 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim()) return;
                setMsgs((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    from: "Me",
                    text,
                    time: "Just now",
                    mine: true,
                  },
                ]);
                setText("");
              }}
            >
              <input
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-red"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-red px-3 py-2 text-white hover:bg-brand-red-hover"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}

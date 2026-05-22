"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Bookmark, User, ChevronDown } from "lucide-react";

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export default function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={28}
            height={28}
            className="rounded-full border border-white/20"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-yellow-400" />
          </div>
        )}
        <span className="text-sm font-medium text-white/80 max-w-24 truncate hidden sm:block">
          {user.name?.split(" ")[0]}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
          {/* User info */}
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>

          <Link
            href="/watchlist"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-yellow-400/70" />
            Danh sách của tôi
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

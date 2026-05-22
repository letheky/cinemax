import { auth } from "@/auth";
import Link from "next/link";
import { LogIn } from "lucide-react";
import UserMenu from "./UserMenu";

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return <UserMenu user={session.user} />;
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold transition-colors"
    >
      <LogIn className="w-4 h-4" />
      Đăng nhập
    </Link>
  );
}

import type { Metadata } from "next";

import { AdminSignOut } from "@/components/admin/admin-sign-out";
import { requireAdminMfa } from "@/modules/administration/services/require-admin";

export const metadata: Metadata = { robots: { index: false, follow: false, noarchive: true } };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminMfa();
  return (
    <>
      <div className="bg-navy-950 px-5 py-3 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="text-sm font-bold">MEETCOLLIER. Private administration</p>
          <AdminSignOut />
        </div>
      </div>
      {children}
    </>
  );
}

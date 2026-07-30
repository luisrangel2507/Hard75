import { Header } from "@/components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">{children}</main>
    </>
  );
}

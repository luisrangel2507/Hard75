import { Header } from "@/components/Header";
import { Onboarding } from "@/components/Onboarding";
import { PageTransition } from "@/components/PageTransition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Onboarding />
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}

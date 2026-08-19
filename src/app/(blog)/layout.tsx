import { Header } from "@/components/blog/Header";
import { Sidebar } from "@/components/blog/Sidebar";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}

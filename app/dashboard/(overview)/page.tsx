import SideNav from "@/components/ui/dashboard/sidenav";
import { lusitana } from "@/components/ui/fonts";

export default function Dashboard() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <img
          style={{ width: "200%" }}
          src="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*SvtF4kmd8mKZdQ6hLLMh8w.jpeg"
          alt=""
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}

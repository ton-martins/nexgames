import TopHeader from "../components/TopHeader";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--background-color)] text-[color:var(--text-primary-color)]">
      <TopHeader />
      <Header />
    </div>
  );
}
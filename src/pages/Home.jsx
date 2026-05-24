import TopHeader from "../components/TopHeader";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <TopHeader />
      <Header />
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <h1 className="text-2xl font-bold">Home NexGames</h1>
        </div>
      </main>
    </>
  );
}
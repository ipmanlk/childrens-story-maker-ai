import { useSession } from "next-auth/react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCoins, FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  const { data: sessionData } = useSession();

  // Mock data for generated content
  const generatedContent = [
    { id: 1, title: "The Magic Forest Adventure", date: "2023-05-15" },
    { id: 2, title: "Space Explorers", date: "2023-05-10" },
    { id: 3, title: "The Friendly Dragon", date: "2023-05-05" },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Children's Story Maker AI</title>
        <meta
          name="description"
          content="Your personalized dashboard for Children's Story Maker AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-purple-100">
        <Navbar />
        <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 sm:py-12">
          <h1 className="mb-8 text-4xl font-extrabold text-indigo-700 drop-shadow-lg">
            Welcome, {sessionData?.user?.name}!
          </h1>

          <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center">
              <FaCoins className="mr-2 text-3xl text-yellow-400" />
              <span className="text-2xl font-bold text-indigo-700">
                {/* Replace with actual coin count */}
                50 Coins
              </span>
            </div>
            <button className="rounded-full bg-yellow-400 px-6 py-2 font-bold text-indigo-900 transition duration-300 hover:bg-yellow-300">
              <FaPlus className="mr-2 inline" />
              Buy More Coins
            </button>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-indigo-700">
              Your Stories
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {generatedContent.map((content) => (
                <Link href={`/story/${content.id}`} key={content.id}>
                  <div className="rounded-lg bg-white p-6 shadow-md transition duration-300 hover:shadow-lg">
                    <h3 className="mb-2 text-xl font-semibold text-indigo-600">
                      {content.title}
                    </h3>
                    <p className="text-gray-600">Created on: {content.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/create-story"
              className="inline-block rounded-full bg-indigo-600 px-8 py-4 text-xl font-bold text-white transition duration-300 hover:bg-indigo-700"
            >
              Create New Story
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

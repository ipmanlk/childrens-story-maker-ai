import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import Link from "next/link";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

// Mock data for story videos (replace with actual data fetching logic)
const storyVideos = [
  {
    id: 1,
    title: "The Magic Forest",
    author: "Alice",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Space Adventure",
    author: "Bob",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 3,
    title: "Underwater Friends",
    author: "Charlie",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // Add more story videos as needed
];

export default function Gallery() {
  return (
    <>
      <Head>
        <title>Story Gallery - Children's Story Maker AI</title>
        <meta
          name="description"
          content="Browse amazing AI-generated kids story videos"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
        <Navbar />

        <main className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-8 text-center shadow-xl">
            <div className="relative z-10">
              <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                Magical Story Gallery
              </h1>
              <p className="mb-8 text-xl text-white drop-shadow sm:text-2xl">
                Explore a world of AI-generated story videos!
              </p>
            </div>
            <div className="mt-8 flex justify-center space-x-8">
              <div className="animate-float text-5xl">📚</div>
              <div
                className="animate-float text-5xl"
                style={{ animationDelay: "0.5s" }}
              >
                🎨
              </div>
              <div
                className="animate-float text-5xl"
                style={{ animationDelay: "1s" }}
              >
                🎬
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {storyVideos.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-lg bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div className="relative mb-4 overflow-hidden pt-[56.25%]">
                  <ReactPlayer
                    url={video.videoUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    className="absolute left-0 top-0"
                  />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-indigo-700">
                  {video.title}
                </h2>
                <p className="text-gray-600">by {video.author}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/create-story"
              className="group relative overflow-hidden rounded-full bg-yellow-400 px-8 py-4 text-xl font-bold text-indigo-900 transition duration-300 hover:bg-yellow-300"
            >
              <span className="relative z-10">Create Your Own Story!</span>
              <span className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white transition-all duration-300 group-hover:scale-100"></span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

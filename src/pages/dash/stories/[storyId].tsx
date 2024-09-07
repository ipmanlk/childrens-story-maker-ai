import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaArrowLeft, FaBook, FaVideo } from "react-icons/fa";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface Story {
  id: string;
  title: string;
  script: string;
  videoUrl: string;
}

// Dummy story data
const dummyStory: Story = {
  id: "1",
  title: "The Magic Forest Adventure",
  script: "Once upon a time, in a lush green forest filled with towering trees and colorful flowers, there lived a curious little rabbit named Hoppy. Hoppy always dreamed of going on a grand adventure beyond the familiar paths of his home.\n\nOne day, while hopping through a field of daisies, Hoppy stumbled upon a mysterious glowing stone. As he touched it with his paw, a burst of sparkling light surrounded him, and he found himself transported to a magical part of the forest he had never seen before.\n\nIn this enchanted realm, Hoppy met a wise old owl named Hoot, who told him about a hidden treasure deep within the heart of the forest. Excited by the prospect of a real adventure, Hoppy decided to search for the treasure.\n\nAlong his journey, Hoppy made new friends: a playful squirrel named Nutsy and a brave mouse called Squeaky. Together, they faced challenges like crossing a bubbling stream, solving riddles from talking trees, and finding their way through a maze of glowing mushrooms.\n\nFinally, after a day full of excitement and teamwork, Hoppy and his friends reached the center of the forest. There, they discovered that the real treasure was not gold or jewels, but the gift of friendship and the joy of exploring new places.\n\nAs the sun began to set, Hoppy realized it was time to return home. With a wave of his new magic stone, he and his friends were transported back to the familiar part of the forest. Hoppy's heart was full of happiness as he hopped back to his family, eager to share the tales of his magical forest adventure.\n\nAnd so, Hoppy learned that sometimes the greatest adventures and the most precious treasures are found when we're brave enough to explore beyond our comfort zone and open our hearts to new friendships.",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

export default function StoryPage() {
  const router = useRouter();
  const { storyId } = router.query;
  const [activeTab, setActiveTab] = useState<"script" | "video">("script");

  // Use the dummy story instead of fetching from an API
  const story = dummyStory;

  return (
    <>
      <Head>
        <title>{story.title} - Children's Story Maker AI</title>
        <meta
          name="description"
          content={`Watch ${story.title}, a story created with Children's Story Maker AI`}
        />
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-purple-100">
        <Navbar />
        <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6">
            <button
              onClick={() => router.push("/dash")}
              className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-6 text-3xl font-bold text-indigo-700">
              {story.title}
            </h1>
            <div className="mb-6">
              <div className="flex border-b">
                <button
                  className={`mr-4 pb-2 ${
                    activeTab === "script"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("script")}
                >
                  <FaBook className="mr-2 inline" />
                  Story Script
                </button>
                <button
                  className={`pb-2 ${
                    activeTab === "video"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("video")}
                >
                  <FaVideo className="mr-2 inline" />
                  Generated Video
                </button>
              </div>
            </div>
            {activeTab === "script" && (
              <div className="rounded-md bg-gray-100 p-4">
                <p className="whitespace-pre-wrap">{story.script}</p>
              </div>
            )}
            {activeTab === "video" && (
              <div className="mx-auto max-w-4xl">
                <div className="relative pt-[56.25%]">
                  <ReactPlayer
                    url={story.videoUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    className="absolute left-0 top-0"
                  />
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

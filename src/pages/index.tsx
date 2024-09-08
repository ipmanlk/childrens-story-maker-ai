import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Children's Story Maker AI</title>
        <meta
          name="description"
          content="Generate amazing kids story videos with AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-blue-100 to-purple-100">
        <Navbar />

        <main className="container mx-auto min-h-screen px-4 py-8 sm:px-6 sm:py-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-8 text-center shadow-xl">
            <div className="relative z-10">
              <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                Imagine, Create, Amaze!
              </h1>
              <p className="mb-8 text-xl text-white drop-shadow sm:text-2xl">
                Create magical stories and videos with the power of AI!
              </p>
              <button className="group relative overflow-hidden rounded-full bg-yellow-400 px-8 py-4 text-xl font-bold text-indigo-900 transition duration-300 hover:bg-yellow-300">
                <span className="relative z-10">Start Your Adventure!</span>
                <span className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white transition-all duration-300 group-hover:scale-100"></span>
              </button>
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

          <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
            <FeatureCard
              icon="🎨"
              title="Colorful Characters"
              description="Bring stories to life with vibrant, AI-generated characters"
              color="bg-pink-100"
            />
            <FeatureCard
              icon="🌟"
              title="Engaging Plots"
              description="Create unique storylines tailored for young audiences"
              color="bg-yellow-100"
            />
            <FeatureCard
              icon="🎬"
              title="Animated Videos"
              description="Turn stories into captivating animated videos"
              color="bg-green-100"
            />
          </div>

          <div className="mt-16 rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700 sm:mb-8 sm:text-4xl">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <StepCard
                number={1}
                title="Choose Your Adventure"
                description="Pick a theme or let your imagination run wild!"
              />
              <StepCard
                number={2}
                title="Customize Your Story"
                description="Add characters, twists, and magical elements"
              />
              <StepCard
                number={3}
                title="Watch It Come to Life"
                description="See your story transform into an animated video"
              />
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-6 text-center text-3xl font-bold text-indigo-700 sm:mb-8 sm:text-4xl">
              Sample Story Videos
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-lg pt-[56.25%] shadow-lg">
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  width="100%"
                  height="100%"
                  controls={true}
                  className="absolute left-0 top-0"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg pt-[56.25%] shadow-lg">
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  width="100%"
                  height="100%"
                  controls={true}
                  className="absolute left-0 top-0"
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-2xl font-bold text-white">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-indigo-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

import { signIn } from "next-auth/react";
import { FaGoogle, FaBookOpen } from "react-icons/fa";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login - Children's Story Maker AI</title>
        <meta name="description" content="Login to Children's Story Maker AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-100 to-purple-100">
        <Navbar />
        <main className="flex flex-grow flex-col items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-extrabold text-indigo-700 drop-shadow-lg sm:text-5xl">
                Unleash Your Imagination
              </h1>
              <p className="text-xl text-indigo-600">
                Create magical stories with the power of AI
              </p>
            </div>
            <div className="rounded-lg bg-white p-8 shadow-xl">
              <div className="mb-6 flex justify-center">
                <FaBookOpen className="text-6xl text-indigo-600" />
              </div>
              <p className="mb-6 text-center text-lg text-gray-600">
                Sign in to start creating amazing stories for kids!
              </p>
              <button
                onClick={() => void signIn("google")}
                className="flex w-full items-center justify-center rounded-full bg-yellow-400 px-6 py-3 text-lg font-bold text-indigo-900 transition duration-300 hover:scale-105 hover:bg-yellow-500"
              >
                <FaGoogle className="mr-2" />
                Login with Google
              </button>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
            <LoginFeatureCard
              icon="🚀"
              title="Quick Start"
              description="Begin your storytelling journey in seconds"
              color="bg-blue-100"
            />
            <LoginFeatureCard
              icon="🔒"
              title="Secure Access"
              description="Your stories and data are safe with us"
              color="bg-green-100"
            />
            <LoginFeatureCard
              icon="🌈"
              title="Endless Possibilities"
              description="Unlock a world of creative storytelling"
              color="bg-purple-100"
            />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;

function LoginFeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-lg ${color} p-6 shadow-md transition-transform hover:scale-105`}
    >
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-indigo-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

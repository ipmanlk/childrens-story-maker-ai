import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bottom-0 bg-indigo-900 py-4 text-white">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; 2023 Children's Story Maker AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

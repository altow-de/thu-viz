import Content from "@/components/Content";
import Header from "@/components/Header";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center bg-gradient-to-b from-danube-200 to-danube-800 relative py-8 sm:py-16">
      <div className="max-w-5xl h-full flex-1 bg-white rounded-md shadow-md">
        <Header />
        <Content title={"Content"} />
      </div>
    </main>
  );
}

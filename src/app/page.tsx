"use client";
import Content from "@/components/pages/Content";
import Header from "@/components/navigation/Header";
import PageContent from "@/components/pages/PageContent";
import { NavigationPage } from "@/frontend/constants";
import React, { useState } from "react";
import Background from "@/components/pages/Background";

export default function Home() {
  const [selectedNav, setSelectedNav] = useState(0);
  return (
    <Background>
      <div className="relative max-w-5xl mb-24 h-full flex-1 bg-white rounded-lg shadow-md z-2">
        <Header selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
        <Content title={NavigationPage[selectedNav]}>
          <PageContent pageIndex={selectedNav} />
        </Content>
      </div>
    </Background>
  );
}

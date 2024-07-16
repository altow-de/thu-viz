"use client";
import Content from "@/components/pages/Content";
import Header from "@/components/navigation/Header";
import PageContent from "@/components/pages/PageContent";
import { NavigationPage } from "@/frontend/constants";
import React, { useEffect, useState } from "react";
import Background from "@/components/pages/Background";
import { useStore } from "@/frontend/store";
import { observer } from "mobx-react-lite";

const Home = () => {
  const { data: dataStore } = useStore();
  const [selectedNav, setSelectedNav] = useState(0);
  useEffect(() => {
    setSelectedNav(dataStore.selectedNav);
  }, [dataStore.selectedNav]);
  return (
    <Background>
      <div className="relative max-w-5xl h-full flex-1 bg-white rounded-lg shadow-md z-2 w-full">
        <Header selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
        <Content title={NavigationPage[selectedNav]}>
          <PageContent pageIndex={selectedNav} />
        </Content>
      </div>
    </Background>
  );
};

export default observer(Home);

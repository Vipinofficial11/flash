"use client";
import { useEffect, useState } from "react";
import { responseType } from "../utils/Types";
import Main from "@/Components/ui/home";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<{
    response: responseType;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!input) {
        return setSearchResult(undefined);
      }

      const response = await fetch(`api/v1/search?q=${input}`);
      const data = (await response.json()) as {
        response: responseType;
      };
      setSearchResult(data);
    };

    fetchData();
  }, [input]);
  return (
    <div className="h-[100vh]">
      <Main />
    </div>
  );
}

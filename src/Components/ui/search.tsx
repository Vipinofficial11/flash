"use client";
import { useEffect, useState } from "react";
import { responseType } from "@/utils/Types";
import Main from "@/Components/ui/home";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/Components/ui/command";

function Search() {
  const [input, setInput] = useState<string>("");
  const [searchResult, setSearchResult] = useState<{
    results: string[];
    duration: number;
  }>();
  const [open, setOpen] = useState(false);
  // Enabling debouncing on search.
  useEffect(() => {
    // @ts-ignore
    let timer;

    if (input) {
      timer = setTimeout(() => {
        fetchData();
      }, 300);
    }

    // @ts-ignore
    return () => clearTimeout(timer);
  }, [input]);

  const fetchData = async () => {
    try {
      if (!input) {
        return setSearchResult(undefined);
      }

      const response = await fetch(
        `https://flash.vipinofficialv1.workers.dev/api/v1/search?q=${input}`
      );
      const data = (await response.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResult(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <main className="flex justify-center items-center mt-20 z-0">
      <div>
        <Command>
          <CommandInput
            value={input}
            onValueChange={setInput}
            placeholder="Search countries..."
            className="placeholder:text-zinc-500"
          />

          <CommandList>
            {searchResult?.results.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : null}

            {searchResult?.results ? (
              <CommandGroup heading="Countries">
                {searchResult?.results.map((result) => (
                  <CommandItem key={result} value={result} onSelect={setInput}>
                    {result}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}

            {searchResult?.results ? (
              <>
                <div className="h-px w-full bg-zinc-200" />

                <p className="p-2 text-xs text-zinc-500 font-medium">
                  Found {searchResult.results.length} results in{" "}
                  {searchResult?.duration.toFixed(0)}ms
                </p>
              </>
            ) : null}
          </CommandList>
        </Command>
      </div>
    </main>
  );
}

export default Search;

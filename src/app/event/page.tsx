"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { suiClient } from "@/lib/suiClient";
import { TESTNET_CROWDFUNDING_PACKAGE_ID } from "@/types/constants";
import { PaginatedEvents } from "@mysten/sui/client";

const MIST_PER_SUI = BigInt(1_000_000_000);

function formatSuiAmount(mist: string | number): string {
  try {
    const amount = BigInt(mist);
    const sui = Number(amount) / Number(MIST_PER_SUI);
    return sui.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return "0.00";
  }
}

interface EventData {
  event_id: string;
  name: string;
  description: string;
  image_ref: string;
  owner: string;
  target_amount: string;
  isOpen: boolean;
}

export default function EventPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<PaginatedEvents | null>(null);
  const PACKAGE_ID = TESTNET_CROWDFUNDING_PACKAGE_ID;
  const EVENT_TYPE = `${PACKAGE_ID}::crowdfunding::EventCreated<0x2::sui::SUI>`;

  const [isLoadingMap, setIsLoadingMap] = useState<Record<string, boolean>>({});

  const setImageLoading = useCallback((key: string, loading: boolean) => {
    setIsLoadingMap((prev) => ({ ...prev, [key]: loading }));
  }, []);

  useEffect(() => {
    if (!data?.data) return;
    const map: Record<string, boolean> = {};
    data.data.forEach((ev) => {
      const parsed = ev.parsedJson as EventData;
      const key = parsed.event_id ?? `${ev.id.txDigest}-${ev.id.eventSeq}`;
      map[key] = true;
    });
    setIsLoadingMap(map);
  }, [data]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRes = await suiClient.queryEvents({
        query: {
          MoveEventType: EVENT_TYPE,
        },
      });
      if (eventsRes) setData(eventsRes);
    };
    fetchEvents();
  }, []);

  const filteredEvents = data?.data?.filter((event) => {
    const eventData = event.parsedJson as EventData;
    return (
      eventData.name?.toLowerCase().includes(search.toLowerCase()) ||
      eventData.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20 py-28">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full md:w-1/2">
            <span className="absolute left-3 top-1.5 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search events by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            Explore Events
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Discover projects that inspire change
          </p>
          <p className="text-sm text-gray-500">
            Find, support, and fund meaningful ideas that shape a better future
            ✨
          </p>
        </div>
        {/* Event grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents?.map((event) => {
            const eventData = event.parsedJson as EventData;
            const uniqueKey =
              eventData.event_id ?? `${event.id.txDigest}-${event.id.eventSeq}`;
            const isLoading = isLoadingMap[uniqueKey] ?? true;
            return (
              <div
                key={uniqueKey}
                className="bg-gray-900 rounded-xl overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,0,255,0.4)] transition-transform duration-300 cursor-pointer"
              >
                <div className="relative w-full h-52 bg-gray-800 overflow-hidden rounded-t-xl">
                  {/* Animated skeleton overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 z-20">
                      <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
                    </div>
                  )}

                  <Image
                    src={eventData.image_ref || "/images/flui-home.png"}
                    alt={eventData.name || "Event image"}
                    fill
                    priority={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-300 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoadingComplete={() => setImageLoading(uniqueKey, false)}
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold line-clamp-1">
                    {eventData.name}
                  </h2>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                    {eventData.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Target:</span>
                      <span className="text-lg font-bold text-blue-400">
                        {formatSuiAmount(eventData.target_amount)} SUI
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Owner:</span>
                      <span className="text-xs text-gray-400 font-mono">
                        {eventData.owner.slice(0, 6)}...
                        {eventData.owner.slice(-4)}
                      </span>
                    </div>
                  </div>

                  <Link href={`/event/${eventData.event_id}`}>
                    <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm rounded-md transition-all">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredEvents?.length === 0 && (
          <p className="text-center text-white mt-20">No events found</p>
        )}
      </div>
    </section>
  );
}

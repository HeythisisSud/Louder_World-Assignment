"use client";

import React from "react";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

interface Props {
  title: string;
  datetime: string;
  venueName?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  organizer?: string | null;
  price?: string | null;
  sourceName?: string;
  onGetTickets: () => void;
}

export default function EventCard({
  title,
  datetime,
  venueName,
  address,
  organizer,
  price,
  sourceName,
  imageUrl,
  onGetTickets,
}: Props) {
  return (
    <div
      className="
        w-full max-w-sm
        h-130              /* ✅ Fixed height */
        rounded-3xl overflow-hidden
        border border-white/15
        bg-white/5 backdrop-blur-2xl
        shadow-lg
        hover:shadow-[0_0_55px_rgba(120,200,255,0.25)]
        transition duration-300
        flex flex-col
      "
    >
      {/* ✅ Image Fixed */}
      <div className="h-45 w-full overflow-hidden relative bg-black/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover opacity-90"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* ✅ Content */}
      <div className="flex flex-col grow p-5 gap-3">
        {/* ✅ Title Clamp */}
        <h2 className="text-white font-semibold text-lg leading-snug line-clamp-2 min-h-13">
          {title}
        </h2>

        {/* ✅ Date */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar size={16} />
          <span className="line-clamp-1">{datetime}</span>
        </div>

        {/* ✅ Location Clamp */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin size={16} />
          <span className="line-clamp-1">
            {venueName}
            {address ? ` · ${address}` : ""}
          </span>
        </div>

        {/* ✅ Organizer Clamp */}
        {organizer && (
          <p className="text-xs text-gray-400 line-clamp-1">
            Hosted by <span className="text-gray-200">{organizer}</span>
          </p>
        )}

        {/* ✅ Price Always Same Spot */}
        <div className="mt-1">
          {price ? (
            <p className="text-sm font-semibold text-green-300">
              Price: {price}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Price: N/A</p>
          )}
        </div>

        {/* ✅ Push Button to Bottom */}
        <div className="mt-auto">
          <button
            onClick={onGetTickets}
            className="
              w-full py-3
              rounded-2xl font-semibold
              bg-white text-black
              hover:bg-gray-200
              active:scale-95
              transition flex items-center justify-center gap-2
            "
          >
            Get Tickets <ExternalLink size={16} />
          </button>

          {/* ✅ Source */}
          {sourceName && (
            <p className="text-[11px] text-gray-500 text-center mt-2">
              Source: {sourceName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

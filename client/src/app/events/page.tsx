"use client";
import CardNav from "../../components/Navbar";
import ProfileCard from "../../components/ProfileCard";
import FloatingLines from "../../components/FloatingLines";
import { Event } from "@/types/events";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import { format } from "date-fns";
import TicketModal from "@/components/TicketModal";
export default function Home() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [events, setEvents] = useState<Event[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setUserLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?page=${page}&limit=18`,
        );
        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();

        setEvents(Array.isArray(data) ? data : data.events || []);

        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setEventsLoading(false);
      }
    }

    fetchEvents();
  }, [page]);
  if (userLoading || eventsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-full border-4 border-white/20 border-t-white animate-spin" />

        <p className="mt-6 text-gray-300 text-sm">
          Loading Sydney Events Platform...
        </p>
      </div>
    );
  }


  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        {
          label: "Company",
          href: "/about/company",
          ariaLabel: "About Company",
        },
        {
          label: "Careers",
          href: "/about/careers",
          ariaLabel: "About Careers",
        },
      ],
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        {
          label: "Featured",
          href: "/projects/featured",
          ariaLabel: "Featured Projects",
        },
        {
          label: "Case Studies",
          href: "/projects/case-studies",
          ariaLabel: "Project Case Studies",
        },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        {
          label: "Email",
          href: "mailto:contact@example.com",
          ariaLabel: "Email us",
        },
        { label: "Twitter", href: "https://twitter.com", ariaLabel: "Twitter" },
        {
          label: "LinkedIn",
          href: "https://linkedin.com",
          ariaLabel: "LinkedIn",
        },
      ],
    },
  ];

  return (
    <div className="pt-25" style={{ width: "100%", height: "100vh" }}>
      <div style={{ zIndex: 10 }}>
        <CardNav items={items} ease="power3.out" />
      </div>
      <div className="grid gap-8 mx-10 mt-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            datetime={
              event.dateTime
                ? format(new Date(event.dateTime), "EEE, d MMM • h:mm a")
                : event.dateTime || "Date TBA"
            }
            venueName={event.venueName}
            address={event.address}
            organizer={event.organizer}
            price={event.price}
            sourceName={event.sourceName}
            imageUrl={event.imageUrl}
            onGetTickets={() => setSelectedEvent(event)}
          />
        ))}
        {selectedEvent && (
          <TicketModal
            eventId={selectedEvent.id}
            eventUrl={selectedEvent.sourceUrl}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
      <div className="flex mx-auto  justify-center items-center gap-6 mt-12 pb-18 ">
        {/* Prev Button */}
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="
      px-5 py-2 rounded-xl
      bg-white/10 text-white
      border border-white/20
      hover:bg-white/20
      disabled:opacity-40 disabled:cursor-not-allowed
      transition
    "
        >
          ← Prev
        </button>

        {/* Page Info */}
        <p className="text-white font-medium">
          Page {page} of {totalPages}
        </p>

        {/* Next Button */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="
      px-5 py-2 rounded-xl
      bg-white/10 text-white
      border border-white/20
      hover:bg-white/20
      disabled:opacity-40 disabled:cursor-not-allowed
      transition
    "
        >
          Next →
        </button>
      </div>
    </div>
  );
}

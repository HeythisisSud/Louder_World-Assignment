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



export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include",
    }).then((res) => {
      if (!res.ok) router.push("/login");
    });
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:5000/api/events");

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
  const router = useRouter();
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
      <div style={{zIndex: 10 }}>
        <CardNav
          items={items}
          ease="power3.out"
        />

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
  onGetTickets={() => window.open(event.sourceUrl, "_blank")}
/>

          ))}
        </div>
    </div>
      
  );
}

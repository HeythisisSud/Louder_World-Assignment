"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { FiUser } from "react-icons/fi";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  
  items: CardNavItem[];
  className?: string;
  ease?: string;
}

const CardNav: React.FC<CardNavProps> = ({  
  items,
  className = "",
  ease = "power3.out",
}) => {
  /* ---------------- PROFILE STATE ---------------- */
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => null);
  }, []);

  /* ---------------- NAV STATE ---------------- */
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  /* ✅ Dynamic height */
  const calculateHeight = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    return isMobile ? 360 : 260;
  };

  /* ✅ GSAP Timeline */
  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 70, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 40, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight(),
      duration: 0.55,
      ease,
    });

    tl.to(
      cardsRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease,
        stagger: 0.12,
      },
      "-=0.25"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
    };
  }, []);

  /* ✅ Toggle Menu */
  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.reverse().eventCallback("onReverseComplete", () => {
        setIsExpanded(false);
      });
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 w-[94%] max-w-6xl top-6 z-50 ${className}`}
    >
      {/* ✅ Glass Navbar */}
      <nav
        ref={navRef}
        className="
          rounded-3xl
          border border-white/20
          overflow-hidden
          backdrop-blur-2xl
          bg-linear-to-b from-white/15 to-white/5
          shadow-[0_0_70px_rgba(255,255,255,0.12)]
          transition duration-300
          hover:shadow-[0_0_90px_rgba(120,200,255,0.25)]
        "
      >
        {/* ✅ Top Bar */}
        <div className="h-17.5 flex items-center justify-between px-6 bg-white/5">
          {/* ✅ Hamburger */}
          <button
            onClick={toggleMenu}
            className="flex flex-col gap-1.5"
          >
            <span
              className={`w-7 h-0.5 bg-white transition ${
                isHamburgerOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-7 h-0.5 bg-white transition ${
                isHamburgerOpen ? "-rotate-45 -translate-y-1" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-white font-semibold tracking-wide hidden md:block">
              Sydney Events Platform
            </span>
          </div>

          {/* ✅ Right Side */}
          <div className="flex items-center gap-4">
            {/* ✅ Profile Avatar */}
            {user ? (
              <img
                src={user.avatarUrl}
                alt="profile"
                className="w-10 h-10 rounded-full border border-white/30 object-cover"
                title={user.name}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <FiUser className="text-white text-lg" />
              </div>
            )}

            {/* ✅ CTA Button */}
            <button
              className="
                hidden md:flex
                px-5 py-2
                rounded-2xl
                font-semibold
                bg-white text-black
                hover:bg-gray-100
                hover:scale-[1.05]
                active:scale-95
                transition duration-200
              "
            >
              Get Started
            </button>
          </div>
        </div>

        {/* ✅ Expanded Menu */}
        <div
          className={`px-5 pb-5 grid md:grid-cols-3 gap-4 ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={item.label}
              ref={setCardRef(idx)}
              className="
                rounded-2xl
                p-5
                border border-white/15
                bg-white/5
                backdrop-blur-xl
                hover:bg-white/10
                hover:scale-[1.03]
                transition duration-300
              "
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                {item.label}
              </h3>

              <div className="flex flex-col gap-2 text-sm text-gray-200">
                {item.links.map((lnk) => (
                  <a
                    key={lnk.label}
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    className="flex items-center gap-2 hover:text-white transition"
                  >
                    <GoArrowUpRight />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;

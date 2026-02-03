"use client";
import CardNav from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import FloatingLines from "../components/FloatingLines";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include",
    }).then((res) => {
      if (!res.ok) router.push("/login");
    });
  }, []);
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
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      
      <div style={{ position: "relative", zIndex: 10 }}>
        <CardNav
          logo="/logo.png"
          logoAlt="Company Logo"
          items={items}
          baseColor="#fff"
          menuColor="#000"
          buttonBgColor="#111"
          buttonTextColor="#fff"
          ease="power3.out"
        />
        
      </div>
    </div>
  );
}

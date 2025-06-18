import React from "react";
import { Link } from "react-router-dom";
import {
  FiGithub,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import FiverrLogo from "../components/shared/FiverrLogo";
import { categories } from "../utils/categories";

function Footer() {
  const socialLinks = [
    { name: "Github", icon: <FiGithub />, link: "https://www.github.com" },
    {
      name: "Youtube",
      icon: <FiYoutube />,
      link: "https://www.youtube.com/KishanSheth21/",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin />,
      link: "https://www.linkedin.com/in/koolkishan/",
    },
    {
      name: "Instagram",
      icon: <FiInstagram />,
      link: "https://instagram.com/koolkishansheth",
    },
    {
      name: "Twitter",
      icon: <FiTwitter />,
      link: "https://twitter.com/koolkishansheth",
    },
  ];
  const data = [
    {
      headerName: "Categories",
      links: [
        ...categories.map(({ name }) => ({
          name,
          link: `/search?category=${name}`,
        })),
      ],
    },
    {
      headerName: "About",
      links: [
        { name: "Careers", link: "#" },
        { name: "Press & News", link: "#" },
        { name: "Partnership", link: "#" },
        { name: "Privacy Policy", link: "#" },
        { name: "Terms of Service", link: "#" },
        { name: "Intellectual Property Claims", link: "#" },
        { name: "Investor Relations", link: "#" },
      ],
    },
    {
      headerName: "Support",
      links: [
        { name: "Help & Support", link: "#" },
        { name: "Trust & Safety", link: "#" },
        { name: "Selling on Fiverr", link: "#" },
        { name: "Buying on Fiverr", link: "#" },
      ],
    },
    {
      headerName: "Community",
      links: [
        { name: "Community Success Stories", link: "#" },
        { name: "Community Hub", link: "#" },
        { name: "Forum", link: "#" },
        { name: "Events", link: "#" },
        { name: "Blog", link: "#" },
        { name: "Influencers", link: "#" },
        { name: "Affiliates", link: "#" },
        { name: "Podcast", link: "#" },
        { name: "Invite a Friend", link: "#" },
        { name: "Become a Seller", link: "#" },
        { name: "Community Standards", link: "#" },
      ],
    },
    {
      headerName: "Move From Fiverr",
      links: [
        { name: "Fiverr Business", link: "#" },
        { name: "Fiverr Pro", link: "#" },
        { name: "Fiverr Logo Maker", link: "#" },
        { name: "Fiverr Guides", link: "#" },
        { name: "Get Inspired", link: "#" },
        { name: "Fiverr Select", link: "#" },
        { name: "ClearVoice", link: "#" },
        { name: "Fiverr Workspace", link: "#" },
        { name: "Learn", link: "#" },
        { name: "Working Not Working", link: "#" },
      ],
    },
  ];
  return (
    <footer className="w-full mx-auto px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 md:py-16 h-max border-t border-gray-200 bg-gray-100">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-0 lg:justify-between">
        {data.map(({ headerName, links }) => {
          return (
            <li key={headerName} className="flex flex-col gap-2">
              <span className="font-bold text-sm sm:text-base">{headerName}</span>
              <ul className="flex flex-col gap-1 sm:gap-2">
                {links.map(({ name, link }) => (
                  <li key={name} className="text-[#404145] text-xs sm:text-sm">
                    <Link to={link} className="hover:text-[#1DBF73] transition-colors duration-200">{name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <FiverrLogo fillColor={"#404145"} />
        <ul className="flex gap-4 sm:gap-5">
          {socialLinks.map(({ icon, link, name }) => (
            <li
              key={name}
              className="text-lg sm:text-xl text-[#404145] hover:text-[#1DBF73] transition-all"
            >
              <a href={link} target="_blank" rel="noopener noreferrer">
                {icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

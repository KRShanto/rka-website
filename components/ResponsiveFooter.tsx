"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface PhoneLink {
  label: string;
  isPhone: true;
  phoneNumber: string;
}

type FooterLinkType = FooterLink | PhoneLink;

interface FooterColumn {
  title: string;
  links: FooterLinkType[];
}

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

interface ResponsiveFooterProps {
  logo: string;
  logoAlt: string;
  description: string;
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  newsletter?: boolean;
  copyright: string;
}

export default function ResponsiveFooter({
  logo,
  logoAlt,
  description,
  columns,
  socialLinks,
  newsletter = true,
  copyright,
}: ResponsiveFooterProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (title: string) => {
    setActiveAccordion(activeAccordion === title ? null : title);
  };

  // Function to update phone number links
  const updatePhoneNumber = (links: FooterLinkType[]): FooterLinkType[] => {
    return links.map((link) => {
      if ("href" in link && link.label === "+880 1234 567890") {
        return {
          label: "+880 1763531313",
          isPhone: true,
          phoneNumber: "+880 1763531313",
        };
      }
      return link;
    });
  };

  // Update phone numbers in columns
  const updatedColumns = columns.map((column) => ({
    ...column,
    links: updatePhoneNumber(column.links),
  }));

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logo || "/placeholder.svg"}
                alt={logoAlt}
                className="h-10 w-auto"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold">{logoAlt}</span>
            </div>
            <p className="text-gray-400 mb-6">{description}</p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {updatedColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"isPhone" in link ? (
                      <span
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        onClick={() => {
                          if (
                            typeof navigator !== "undefined" &&
                            navigator.clipboard
                          ) {
                            navigator.clipboard
                              .writeText(link.phoneNumber)
                              .then(() => {
                                alert(
                                  `Phone number copied: ${link.phoneNumber}`
                                );
                              })
                              .catch(() => {
                                alert(
                                  `Please copy this number: ${link.phoneNumber}`
                                );
                              });
                          } else {
                            alert(
                              `Please copy this number: ${link.phoneNumber}`
                            );
                          }
                        }}
                      >
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label === "123 Karate Street, Dhaka"
                          ? "House 36, Road 3, C Block, Banasree, Dhaka"
                          : link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter && (
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
                Subscribe
              </h3>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest news and offers.
              </p>
              <form className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-[#dc2626]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Footer Accordions */}
        <div className="md:hidden space-y-4 mb-8 relative z-10">
          {/* Logo and Description */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logo || "/placeholder.svg"}
                alt={logoAlt}
                className="h-10 w-auto"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold">{logoAlt}</span>
            </div>
            <p className="text-gray-400 mb-4">{description}</p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={`mobile-social-${index}-${social.href}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors z-10 relative"
                  aria-label={social.label}
                  onClick={(e) => {
                    // Ensure the click event propagates correctly
                    e.stopPropagation();
                  }}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns as Accordions */}
          {updatedColumns.map((column) => (
            <div key={column.title} className="border-b border-gray-800 pb-2">
              <button
                className="flex justify-between items-center w-full py-3 text-left font-bold"
                onClick={() => toggleAccordion(column.title)}
                aria-expanded={activeAccordion === column.title}
              >
                <span>{column.title}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform",
                    activeAccordion === column.title
                      ? "transform rotate-180"
                      : ""
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  activeAccordion === column.title
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <ul className="space-y-2 py-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {"isPhone" in link ? (
                        <span
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                          onClick={() => {
                            if (
                              typeof navigator !== "undefined" &&
                              navigator.clipboard
                            ) {
                              navigator.clipboard
                                .writeText(link.phoneNumber)
                                .then(() => {
                                  alert(
                                    `Phone number copied: ${link.phoneNumber}`
                                  );
                                })
                                .catch(() => {
                                  alert(
                                    `Please copy this number: ${link.phoneNumber}`
                                  );
                                });
                            } else {
                              alert(
                                `Please copy this number: ${link.phoneNumber}`
                              );
                            }
                          }}
                        >
                          {link.label}
                        </span>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link.label === "123 Karate Street, Dhaka"
                            ? "House 36, Road 3, C Block, Banasree, Dhaka"
                            : link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Mobile Newsletter */}
          {newsletter && (
            <div className="pt-4">
              <h3 className="text-lg font-bold mb-2">Subscribe</h3>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest news and offers.
              </p>
              <form className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-[#dc2626]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Copyright and Credits */}
        <div className="text-center pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-1">{copyright}</p>
          <p className="text-gray-500 text-sm">
            Design and Developed by{" "}
            <a
              href="https://www.facebook.com/mostofa.skmostofa.399"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              SK MOSTOFA HASAN
            </a>
            {" & "}
            <a
              href="https://www.krshanto.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              KR Shanto
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

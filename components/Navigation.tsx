"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/SignOutButton";
import logo from "@/app/(main)/assets/sesame-street-archive-logo.png";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function Navigation({ session }) {
  // Get navigation links from messages/en.json
  const t = useTranslations("Navigation");

  const navLinks = [
    { label: t("links.home.label"), path: t("links.home.path") },
    { label: t("links.explore.label"), path: t("links.explore.path") },
    { label: t("links.about.label"), path: t("links.about.path") },
    { label: t("links.guide.label"), path: t("links.guide.path") },
    { label: t("links.team.label"), path: t("links.team.path") },
    { label: t("links.dashboard.label"), path: t("links.dashboard.path") },
    { label: t("links.annotate.label"), path: t("links.annotate.path") },
    { label: t("links.signIn.label"), path: t("links.signIn.path") }
  ];

  // Filter links for session-specific logic
  const filteredLinks = navLinks.filter(link => {
    if (link.path === "/annotate" && !session?.user) return false;
    if (link.path === "/auth/signin" && session?.user) return false;
    return true;
  });

  return (
    <Disclosure as="nav">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-gray-800 hover:underline uppercase font-inter-tight"
        >
          <Image
            src={logo}
            alt="Sesame Street Archive Logo"
            className="h-8"
            height={32}
          />
          <span className="hidden lg:inline">Sesame Street Archive</span>
        </Link>
        <div className="flex gap-2 items-center">
          <div className="relative w-8 h-full sm:hidden">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>
          </div>
          <div className="hidden sm:block">
            {filteredLinks.map(link => (
              <Button
                asChild
                key={link.path}
                variant="ghost"
                className="text-base px-4 py-2 rounded-md hover:bg-neutral-100"
              >
                <Link href={link.path}>{link.label}</Link>
              </Button>
            ))}
            {session?.user && (
              <>
                <span className="text-sm text-neutral-700">
                  Hi, {session.user.name}
                </span>
                <SignOutButton />
              </>
            )}
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        {({ close }) => (
          <div className="grid space-y-1 px-2 pt-2 pb-3">
            {filteredLinks.map(link => (
              <Button
                asChild
                key={link.path}
                variant="ghost"
                className="text-base px-4 py-2 rounded-md hover:bg-neutral-100"
              >
                <Link onNavigate={() => close()} href={link.path}>
                  {link.label}
                </Link>
              </Button>
            ))}
            {session?.user && <SignOutButton />}
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}

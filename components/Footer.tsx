import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import footerMessages from "@/messages/en.json";

const Footer: React.FC = () => {
  const t = useTranslations("Footer");

  // Get navigation sections from messages/en.json
  const navSections = footerMessages.Footer.Navigation;

  return (
    <footer className="border-t bg-white text-neutral-500 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Navigation Sections */}
          {Object.entries(navSections).map(([sectionKey, section]) => (
            <div key={sectionKey}>
              <h3 className="font-semibold text-neutral-700 mb-4">{section.label}</h3>
              <ul className="space-y-2">
                {Object.entries(section.links).map(([linkKey, link]) => (
                  <li key={linkKey}>
                    <Link
                      href={link.path}
                      className="text-sm hover:text-neutral-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold text-neutral-700 mb-4">
              {t('subscribe.title')}
            </h3>
            <p className="text-sm mb-4">
              {t('subscribe.description')}
            </p>
            <form className="space-y-3">
              <div>
                <label htmlFor="email" className="sr-only">
                  {t('subscribe.label')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('subscribe.placeholder')}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                {t('subscribe.cta')}
              </Button>
            </form>
            <p className="text-xs mt-2 text-neutral-400">
              {t('unsubscribe')}
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-neutral-200 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8">
            {/* Copyright */}
            <div className="text-center lg:text-left grid gap-4">
              <p className="text-xs font-medium text-neutral-600">
                {t.rich("copyright", {
                  em: (chunks) => <em>{chunks}</em>,
                  year: new Date().getFullYear()
                })} 
              </p>
              <p className="text-xs leading-relaxed text-neutral-500">
                {t.rich("disclaimer", {
                  em: (chunks) => <em>{chunks}</em>
                })} 
              </p>
            </div>
            {/* Legal Links */}
            <div className="flex justify-center lg:justify-end space-x-6">
              <Link
                href="/privacy"
                className="text-xs hover:text-neutral-700 transition-colors"
              >
                {t('privacy')}
              </Link>
              <Link
                href="/terms"
                className="text-xs hover:text-neutral-700 transition-colors"
              >
                {t('terms')}
              </Link>
              <Link
                href="/accessibility"
                className="text-xs hover:text-neutral-700 transition-colors"
              >
                {t('accessibility')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-600 hover:text-gray-900">
                  {t('footer.quickLinks.browseEvents')}
                </Link>
              </li>
              <li>
                <Link to="/events/new" className="text-gray-600 hover:text-gray-900">
                  {t('footer.quickLinks.createEvent')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  {t('footer.quickLinks.dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.resources.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900">
                  {t('footer.resources.helpCenter')}
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-gray-600 hover:text-gray-900">
                  {t('footer.resources.guidelines')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                  {t('footer.resources.privacy')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray-600 mb-4">{t('footer.newsletter.description')}</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t('footer.newsletter.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
              aria-label={t('footer.social.github')}
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
              aria-label={t('footer.social.twitter')}
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
              aria-label={t('footer.social.linkedin')}
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
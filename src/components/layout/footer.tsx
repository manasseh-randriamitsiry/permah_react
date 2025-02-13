import React from 'react';
import { BrandSection } from './footer/BrandSection';
import { QuickLinks } from './footer/QuickLinks';
import { Resources } from './footer/Resources';
import { Newsletter } from './footer/Newsletter';
import { BottomSection } from './footer/BottomSection';

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <BrandSection />
          <QuickLinks />
          <Resources />
          <Newsletter />
        </div>
        <BottomSection />
      </div>
    </footer>
  );
}
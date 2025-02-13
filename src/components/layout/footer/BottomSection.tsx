import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function BottomSection() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <p className="text-sm text-gray-600">
          © {currentYear} EventManager. All rights reserved.
        </p>
        
        {/* Social Links */}
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <Github className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
} 
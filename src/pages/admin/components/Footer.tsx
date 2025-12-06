import React from 'react';

// Footer Props interface to define the customization options for the footer
interface FooterProps {
  brandName: string;
  brandLink: string;
  authorName: string;
  authorUrl: string;
  authorIcon: JSX.Element; // SVG or any custom icon
}

const Footer: React.FC<FooterProps> = ({
  brandName,
  brandLink,
  authorName,
  authorUrl,
  authorIcon,
}) => {
  return (
    <footer id="page-footer" className="flex flex-none items-center py-5 bg-gray-800 text-white">
      <div className="container mx-auto flex flex-col px-4 text-center text-sm md:flex-row md:justify-between md:text-start lg:px-8 xl:max-w-7xl">
        
        {/* Brand Section */}
        <div className="pt-4 pb-1 md:pb-4">
          © <span className="font-medium">{brandName}</span>
        </div>

        {/* Author Section */}
        <div className="inline-flex items-center justify-center pt-1 pb-4 md:pt-4">
          <span>Crafted with</span>
          {authorIcon}
          <span>
            by{' '}
            <a
              href={authorUrl}
              className="font-medium text-blue-600 hover:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {authorName}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

// Default Footer Component
const DefaultFooter: React.FC = () => {
  return (
    <Footer
      brandName="TailDesk"
      brandLink="https://www.taildesk.com" // You can modify this URL if necessary
      authorName="pixelcave"
      authorUrl="https://pixelcave.com"
      authorIcon={
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-1 inline-block size-4 text-red-600"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          ></path>
        </svg>
      }
    />
  );
};

export default DefaultFooter;

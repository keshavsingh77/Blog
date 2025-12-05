
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, type = 'website' }) => {
  const location = useLocation();
  // Using the provided Stream URL as the base for canonicals
  const siteUrl = 'https://movies4uhd.vercel.app';
  
  // Construct canonical URL. 
  // Note: Since HashRouter is used, the hash is part of the client-side route. 
  // Search engines can crawl hash URLs, but standardizing the base is key.
  const canonicalUrl = `${siteUrl}/#${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = `${title} | Creative Mind`;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 3. Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Update Open Graph Tags (Facebook, LinkedIn, Discord previews)
    const setMetaTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    };

    setMetaTag('og:site_name', 'Creative Mind');
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:url', canonicalUrl);
    setMetaTag('og:type', type);
    
    if (image) {
        setMetaTag('og:image', image);
    }

  }, [title, description, canonicalUrl, image, type]);

  return null;
};

export default SEO;

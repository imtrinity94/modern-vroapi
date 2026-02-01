
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string[];
    type?: string;
    image?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = 'Modern API documentation for vRealize Orchestrator (vRO) plugins.',
    keywords = [],
    type = 'website',
    image = '/og-image.png'
}) => {
    const siteTitle = 'modern-vroapi';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    // Default keywords
    const defaultKeywords = ['vRO', 'vRealize Orchestrator', 'API', 'Documentation', 'VMware', 'Aria Automation'];
    const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');

    // Ensure absolute URL for social images
    const siteUrl = 'https://modernvroapi.in';
    const absoluteImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:image" content={absoluteImageUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImageUrl} />
        </Helmet>
    );
};

export default SEO;

/**
 * Ad platform specs (AdFlow-style): limits, formats, placements, CTAs, ad types.
 * Used for character limits, UTM, and platform specs UI.
 */

export const PLATFORMS = {
  'Meta Ads': {
    color: '#1877f2',
    icon: 'f',
    formats: ['Single Image', 'Carousel', 'Video', 'Stories', 'Reels', 'Collection'],
    placements: ['Feed', 'Stories', 'Reels', 'Right Column', 'Marketplace', 'Audience Network'],
    limits: { headline: 40, description: 125, primaryText: 125 },
    utmSource: 'facebook',
    ctas: ['Shop Now', 'Learn More', 'Sign Up', 'Book Now', 'Contact Us', 'Get Offer', 'Download'],
    adTypes: ['Awareness', 'Traffic', 'Engagement', 'Leads', 'App Promotion', 'Sales'],
    note: 'Feed and Stories perform best for most brands.'
  },
  'Google Ads': {
    color: '#4285f4',
    icon: 'G',
    formats: ['Responsive Search', 'Display', 'Performance Max', 'Shopping', 'Video', 'App'],
    placements: ['Search Network', 'Display Network', 'YouTube Pre-roll', 'YouTube Bumper', 'Discovery'],
    limits: { headline: 30, description: 90, primaryText: 90 },
    utmSource: 'google',
    ctas: ['Shop Now', 'Learn More', 'Sign Up', 'Get Quote', 'Apply Now', 'Download', 'Subscribe'],
    adTypes: ['Search', 'Display', 'Video', 'Shopping', 'App', 'Discovery']
  },
  'TikTok Ads': {
    color: '#ff0050',
    icon: 'T',
    formats: ['In-Feed Video', 'TopView', 'Brand Takeover', 'Branded Hashtag', 'Spark Ad', 'Collection'],
    placements: ['TikTok In-Feed', 'TikTok TopView', 'Pangle Network', 'TikTok Stories'],
    limits: { headline: 100, description: 100, primaryText: 100 },
    utmSource: 'tiktok',
    ctas: ['Shop Now', 'Learn More', 'Sign Up', 'Download', 'Order Now', 'Subscribe'],
    adTypes: ['Reach', 'Traffic', 'Video Views', 'Lead Generation', 'App Install', 'Conversions'],
    note: 'Video-first. 9:16 ratio. Sound-on recommended.'
  },
  'Pinterest Ads': {
    color: '#e60023',
    icon: 'P',
    formats: ['Standard Pin', 'Video Pin', 'Carousel Pin', 'Shopping Pin', 'Collection', 'Idea'],
    placements: ['Browse Feed', 'Search Results', 'Related Pins', 'Explore Feed', 'Shop Tab'],
    limits: { headline: 100, description: 500, primaryText: 500 },
    utmSource: 'pinterest',
    ctas: ['Learn More', 'Shop Now', 'Sign Up', 'Watch Now', 'Visit Site', 'Get App'],
    adTypes: ['Awareness', 'Video Views', 'Consideration', 'Conversions', 'Catalog Sales'],
    note: 'Visual discovery. Vertical images perform best (2:3 ratio).'
  },
  'Telegram Ads': {
    color: '#26a5e4',
    icon: '>',
    formats: ['Sponsored Message', 'Channel Post Boost'],
    placements: ['Public Channels (1000+ members)', 'Bot Conversations'],
    limits: { headline: 0, description: 160, primaryText: 160 },
    utmSource: 'telegram',
    ctas: ['Open Channel', 'Visit Site', 'Start Bot'],
    adTypes: ['Awareness', 'Traffic'],
    note: 'Text-only. Max 160 chars. No images.'
  },
  'Snapchat Ads': {
    color: '#fffc00',
    icon: 'S',
    formats: ['Single Image/Video', 'Story Ad', 'Collection Ad', 'AR Lens', 'Dynamic Ad'],
    placements: ['Between Stories', 'Discover Feed', 'AR Lens', 'Snap Map'],
    limits: { headline: 34, description: 130, primaryText: 130 },
    utmSource: 'snapchat',
    ctas: ['Shop Now', 'Swipe Up', 'Learn More', 'Sign Up', 'Watch', 'Play Game'],
    adTypes: ['Awareness', 'Traffic', 'Engagement', 'App Installs', 'Lead Gen', 'Conversions'],
    note: 'Full-screen vertical video (9:16).'
  },
  'X (Twitter) Ads': {
    color: '#e7e7e7',
    icon: 'X',
    formats: ['Promoted Tweet', 'Promoted Video', 'Image Ad', 'Carousel', 'Text Ad', 'Amplify'],
    placements: ['Timeline', 'Search Results', 'Profiles', 'Trending Topics', 'Newsletter'],
    limits: { headline: 70, description: 280, primaryText: 280 },
    utmSource: 'twitter',
    ctas: ['Learn More', 'Shop Now', 'Sign Up', 'Download', 'Book Now', 'Apply'],
    adTypes: ['Awareness', 'Tweet Engagements', 'Website Traffic', 'App Installs', 'Video Views']
  },
  'LinkedIn Ads': {
    color: '#0a66c2',
    icon: 'in',
    formats: ['Single Image', 'Video', 'Carousel', 'Text Ad', 'Spotlight', 'Message Ad', 'Conversation'],
    placements: ['LinkedIn Feed', 'Right Rail', 'InMail', 'Audience Network', 'Stories'],
    limits: { headline: 70, description: 150, primaryText: 150 },
    utmSource: 'linkedin',
    ctas: ['Learn More', 'Register', 'Sign Up', 'Subscribe', 'Download', 'Get Quote', 'Apply'],
    adTypes: ['Brand Awareness', 'Website Visits', 'Engagement', 'Video Views', 'Lead Gen', 'Job Applicants'],
    note: 'B2B. High CPC but strong professional targeting.'
  },
  'YouTube Ads': {
    color: '#ff0000',
    icon: 'Y',
    formats: ['Skippable In-Stream', 'Non-Skippable', 'Bumper (6s)', 'Video Discovery', 'Masthead'],
    placements: ['Pre-roll', 'Mid-roll', 'Post-roll', 'Video Discovery', 'Homepage Masthead'],
    limits: { headline: 100, description: 35, primaryText: 35 },
    utmSource: 'youtube',
    ctas: ['Learn More', 'Shop Now', 'Sign Up', 'Book Now', 'Download', 'Subscribe'],
    adTypes: ['Awareness', 'Consideration', 'Action', 'Brand Lift'],
    note: 'Video required. First 5 seconds critical before skip.'
  },
  'Reddit Ads': {
    color: '#ff4500',
    icon: 'R',
    formats: ['Promoted Post', 'Video Ad', 'Carousel', 'Conversation Ad', 'Product Listing'],
    placements: ['Home Feed', 'Community Feed', 'Search Results', 'Trending Subreddits'],
    limits: { headline: 300, description: 500, primaryText: 500 },
    utmSource: 'reddit',
    ctas: ['Learn More', 'Shop Now', 'Sign Up', 'Play Now', 'Get App', 'Watch'],
    adTypes: ['Brand Awareness', 'Traffic', 'Conversions', 'Video Views', 'App Installs'],
    note: 'Community-first. Ads must feel native.'
  }
};

export const ALL_PLATFORMS = Object.keys(PLATFORMS);

export function slug(s) {
  if (s == null) return '';
  return String(s).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || '';
}

export function generateUTM(campaign, adset, headline, platform) {
  const src = (PLATFORMS[platform] && PLATFORMS[platform].utmSource) ? PLATFORMS[platform].utmSource : slug(platform);
  return `utm_source=${src}&utm_medium=paid_social&utm_campaign=${slug(campaign)}&utm_content=${slug(adset)}&utm_term=${slug((headline || '').slice(0, 30))}`;
}

export function generateAdName(campaign, adset, index, platform) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const abbr = {
    'Meta Ads': 'META',
    'Google Ads': 'GOOG',
    'TikTok Ads': 'TKTK',
    'Pinterest Ads': 'PINS',
    'Telegram Ads': 'TG',
    'Snapchat Ads': 'SNAP',
    'X (Twitter) Ads': 'X',
    'LinkedIn Ads': 'LI',
    'YouTube Ads': 'YT',
    'Reddit Ads': 'RED'
  };
  const p = abbr[platform] || (platform ? platform.slice(0, 4).toUpperCase() : 'AD');
  return `${p}_${slug(campaign).slice(0, 12)}_${slug(adset).slice(0, 8)}_v${String((index || 0) + 1).padStart(2, '0')}`;
}

export function getPlatformColor(platform) {
  return (PLATFORMS[platform] && PLATFORMS[platform].color) || '#888';
}

export function getPlatformIcon(platform) {
  return (PLATFORMS[platform] && PLATFORMS[platform].icon) || 'o';
}

export function getPlatformShortName(platform) {
  if (!platform) return '';
  return platform.replace(' Ads', '').replace(' (Twitter)', '');
}

export function getPlatformLimits(platform) {
  return (PLATFORMS[platform] && PLATFORMS[platform].limits) || { headline: 999, description: 999, primaryText: 999 };
}

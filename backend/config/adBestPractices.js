/**
 * Industry best-practice rules for ad specs.
 * Powers the self-optimizing Ad Spec Advisor: recommends specs that bring the best results.
 * Evolves platform from monitoring into a self-optimizing marketing engine.
 */

const BEST_PRACTICES = {
  'Meta Ads': {
    headline: { min: 5, optimalMax: 35, max: 40, tip: 'Headlines 25–35 chars get highest CTR; front-load the hook.' },
    description: { optimalMax: 100, max: 125, tip: 'First line visible in feed (~125 chars); put CTA or key benefit early.' },
    creative: { aspectRatios: ['1:1', '4:5', '9:16'], tip: '4:5 and 9:16 often outperform 1:1 in feed. Video: hook in first 3s.' },
    placement: { preferred: ['Feed', 'Stories'], tip: 'Feed + Stories drive most conversions; test Reels for younger audiences.' },
    cta: { highPerformers: ['Shop Now', 'Learn More', 'Sign Up'], tip: 'Match CTA to landing page and conversion goal.' }
  },
  'Google Ads': {
    headline: { min: 25, optimalMax: 30, max: 30, tip: 'Use all 3 headlines; include keyword in at least one.' },
    description: { optimalMax: 80, max: 90, tip: 'Include primary keyword and a clear benefit or offer.' },
    creative: { aspectRatios: ['1:1', '16:9', '4:1'], tip: 'Responsive ads let Google mix assets; supply multiple ratios.' },
    placement: { preferred: ['Search Network', 'Performance Max'], tip: 'Search captures intent; PMax extends reach across inventory.' },
    cta: { highPerformers: ['Get Quote', 'Shop Now', 'Sign Up'], tip: 'Strong CTAs improve Quality Score and cost per conversion.' }
  },
  'TikTok Ads': {
    headline: { optimalMax: 80, max: 100, tip: 'Short punchy lines; native tone. Avoid salesy language.' },
    description: { optimalMax: 80, max: 100, tip: 'Sound-on creative; first 1–2 seconds must stop the scroll.' },
    creative: { aspectRatios: ['9:16'], tip: 'Vertical 9:16 only. Full-screen, native feel. Use trending sounds where relevant.' },
    placement: { preferred: ['TikTok In-Feed'], tip: 'In-Feed is primary; TopView for big launches.' },
    cta: { highPerformers: ['Shop Now', 'Learn More', 'Download'], tip: 'Direct response CTAs work; keep creative entertaining.' }
  },
  'Pinterest Ads': {
    headline: { optimalMax: 80, max: 100, tip: 'Keyword-rich headlines help in search and discovery.' },
    description: { optimalMax: 350, max: 500, tip: 'Longer descriptions with keywords perform well in search.' },
    creative: { aspectRatios: ['2:3', '1:2.1'], tip: 'Vertical 2:3 or 1000x1500; tall pins get more repins.' },
    placement: { preferred: ['Browse Feed', 'Search Results'], tip: 'Search + feed; use keywords in copy and pin title.' },
    cta: { highPerformers: ['Shop Now', 'Learn More', 'Watch Now'], tip: 'Shopping pins need clear product and CTA.' }
  },
  'LinkedIn Ads': {
    headline: { optimalMax: 50, max: 70, tip: 'Professional tone; lead with outcome or credential.' },
    description: { optimalMax: 120, max: 150, tip: 'B2B messaging; proof points and clear next step.' },
    creative: { aspectRatios: ['1:1', '1.91:1'], tip: '1:1 and landscape; clean, professional imagery.' },
    placement: { preferred: ['LinkedIn Feed'], tip: 'Feed reaches decision-makers; InMail for high-intent campaigns.' },
    cta: { highPerformers: ['Learn More', 'Register', 'Get Quote'], tip: 'Lead-gen CTAs align with LinkedIn audience.' }
  },
  'YouTube Ads': {
    headline: { optimalMax: 25, max: 35, tip: 'Short; supports the video message. Shown with skip.' },
    description: { optimalMax: 35, max: 35, tip: 'One line; reinforce value or CTA.' },
    creative: { aspectRatios: ['16:9', '1:1'], tip: '16:9 standard. First 5 seconds critical—hook before skip.' },
    placement: { preferred: ['Pre-roll', 'Video Discovery'], tip: 'Skippable in-stream + discovery for consideration.' },
    cta: { highPerformers: ['Learn More', 'Subscribe', 'Shop Now'], tip: 'Align CTA with video content and offer.' }
  },
  'X (Twitter) Ads': {
    headline: { optimalMax: 50, max: 70, tip: 'Conversational; fits timeline context.' },
    description: { optimalMax: 250, max: 280, tip: 'Thread-style or punchy; hashtags sparingly.' },
    creative: { aspectRatios: ['1:1', '16:9'], tip: 'Square or landscape; clear in timeline.' },
    placement: { preferred: ['Timeline', 'Search Results'], tip: 'Timeline for reach; Search for intent.' },
    cta: { highPerformers: ['Learn More', 'Shop Now', 'Sign Up'], tip: 'Direct CTAs perform; keep copy native.' }
  },
  'Snapchat Ads': {
    headline: { optimalMax: 28, max: 34, tip: 'Very short; full-screen vertical owns attention.' },
    description: { optimalMax: 100, max: 130, tip: 'Swipe-up CTA; creative does the selling.' },
    creative: { aspectRatios: ['9:16'], tip: 'Full-screen vertical 9:16; immersive and fast.' },
    placement: { preferred: ['Between Stories', 'Discover Feed'], tip: 'Stories and Discover; vertical only.' },
    cta: { highPerformers: ['Swipe Up', 'Shop Now', 'Watch'], tip: 'Swipe Up is primary CTA for web/conversions.' }
  },
  'Reddit Ads': {
    headline: { optimalMax: 200, max: 300, tip: 'Native, community tone. Avoid corporate speak.' },
    description: { optimalMax: 350, max: 500, tip: 'Authentic; answer “why” and add value.' },
    creative: { aspectRatios: ['1:1', '4:5'], tip: 'Feels like organic post; text-heavy or simple image.' },
    placement: { preferred: ['Home Feed', 'Community Feed'], tip: 'Target relevant subreddits; blend in.' },
    cta: { highPerformers: ['Learn More', 'Shop Now', 'Sign Up'], tip: 'Soft-sell CTAs; community trusts authenticity.' }
  },
  'Telegram Ads': {
    headline: { max: 0, tip: 'Text-only. No headline field.' },
    description: { optimalMax: 140, max: 160, tip: 'Concise message; one clear CTA. No images.' },
    creative: { aspectRatios: [], tip: 'Text-only channel ads.' },
    placement: { preferred: ['Public Channels (1000+ members)'], tip: 'Relevant channels only.' },
    cta: { highPerformers: ['Visit Site', 'Open Channel'], tip: 'Simple CTAs; message is the creative.' }
  }
};

/**
 * Get best-practice recommendations for a platform (and optional objective/format).
 */
function getRecommendations(platform, objective, format) {
  const p = BEST_PRACTICES[platform];
  if (!p) {
    return { platform, found: false, message: 'Platform not found. Use a supported platform for recommendations.' };
  }
  const out = {
    platform,
    found: true,
    headline: p.headline,
    description: p.description,
    creative: p.creative,
    placement: p.placement,
    cta: p.cta,
    tips: [
      p.headline?.tip,
      p.description?.tip,
      p.creative?.tip,
      p.placement?.tip,
      p.cta?.tip
    ].filter(Boolean)
  };
  return out;
}

/**
 * Advise on current ad copy/specs: compliance + optimization hints.
 */
function advise(platform, headline, description, format) {
  const rec = getRecommendations(platform);
  if (!rec.found) return { ...rec, compliance: [], optimizations: [] };

  const compliance = [];
  const optimizations = [];
  const limits = rec.headline || rec.description ? {} : null;

  if (rec.headline && rec.headline.max > 0 && headline != null) {
    const len = String(headline).length;
    if (len > rec.headline.max) {
      compliance.push({ field: 'headline', status: 'over', current: len, max: rec.headline.max, message: `Headline is ${len} chars; max ${rec.headline.max}. Shorten to avoid truncation.` });
    } else if (rec.headline.optimalMax && len > rec.headline.optimalMax) {
      optimizations.push({ field: 'headline', current: len, optimalMax: rec.headline.optimalMax, tip: rec.headline.tip });
    } else if (len > 0) {
      compliance.push({ field: 'headline', status: 'ok', current: len, max: rec.headline.max });
    }
  }

  if (rec.description && rec.description.max > 0 && description != null) {
    const len = String(description).length;
    if (len > rec.description.max) {
      compliance.push({ field: 'description', status: 'over', current: len, max: rec.description.max, message: `Description is ${len} chars; max ${rec.description.max}. Shorten to stay within spec.` });
    } else if (rec.description.optimalMax && len > rec.description.optimalMax) {
      optimizations.push({ field: 'description', current: len, optimalMax: rec.description.optimalMax, tip: rec.description.tip });
    } else if (len > 0) {
      compliance.push({ field: 'description', status: 'ok', current: len, max: rec.description.max });
    }
  }

  return {
    ...rec,
    compliance,
    optimizations
  };
}

module.exports = {
  BEST_PRACTICES,
  getRecommendations,
  advise
};

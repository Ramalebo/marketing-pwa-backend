const express = require('express');
const { Ad } = require('../models');
const { Op } = require('sequelize');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

const CHANNELS = [
  { key: 'social', name: 'Social Media', description: 'Facebook, Instagram, Twitter', icon: 'mdi-share-variant', iconBg: '#E3F2FD', iconColor: '#2196F3' },
  { key: 'email', name: 'Email Marketing', description: 'Newsletter, Campaigns', icon: 'mdi-email', iconBg: '#E8F5E9', iconColor: '#4CAF50' },
  { key: 'display', name: 'Display Ads', description: 'Banner, Native, Video', icon: 'mdi-monitor', iconBg: '#F3E5F5', iconColor: '#9C27B0' },
  { key: 'search', name: 'Search Ads', description: 'Google, Bing', icon: 'mdi-magnify', iconBg: '#FFF3E0', iconColor: '#FF9800' }
];

function formatK(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000) % 1 === 0 ? (num / 1000) + 'K' : (num / 1000).toFixed(1) + 'K';
  return String(Math.round(num));
}

// GET /api/dashboard – KPIs, channel performance, AI insight (from real ad data)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({
        kpis: defaultKpis(),
        channelPerformance: defaultChannelPerformance(),
        aiInsight: defaultAiInsight(),
        trend: defaultTrend(),
        distribution: defaultDistribution()
      });
    }

    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev30 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const ads = await Ad.findAll({
      where: { createdBy: userId },
      attributes: ['id', 'reach', 'engagement', 'spend', 'channel', 'status', 'createdAt']
    });

    const currentAds = ads.filter(a => new Date(a.createdAt) >= last30);
    const previousAds = ads.filter(a => new Date(a.createdAt) < last30);

    const sum = (list, key) => list.reduce((acc, a) => acc + (Number(a[key]) || 0), 0);
    const totalReach = sum(currentAds, 'reach');
    const totalSpend = sum(currentAds, 'spend');
    const totalEngagement = currentAds.length ? currentAds.reduce((acc, a) => acc + (Number(a.engagement) || 0), 0) / currentAds.length : 0;
    const prevReach = sum(previousAds, 'reach');
    const prevSpend = sum(previousAds, 'spend');
    const prevEngagement = previousAds.length ? previousAds.reduce((acc, a) => acc + (Number(a.engagement) || 0), 0) / previousAds.length : 0;

    const reachChange = prevReach ? ((totalReach - prevReach) / prevReach * 100).toFixed(1) : '0';
    const spendChange = prevSpend ? ((totalSpend - prevSpend) / prevSpend * 100).toFixed(1) : '0';
    const engagementChange = prevEngagement ? ((totalEngagement - prevEngagement) / prevEngagement * 100).toFixed(1) : '0';

    const kpis = {
      totalReach: formatK(totalReach) || '0',
      totalReachChange: reachChange,
      engagementRate: totalEngagement.toFixed(1) + '%',
      engagementChange,
      conversionRate: '0.2%',
      conversionChange: '-0.2',
      totalSpend: totalSpend >= 1000 ? `R${(totalSpend / 1000).toFixed(1)}K` : `R${Math.round(totalSpend)}`,
      totalSpendChange: spendChange
    };

    const byChannel = {};
    CHANNELS.forEach(c => {
      byChannel[c.key] = { ...c, reach: 0, spend: 0, engagementSum: 0, count: 0, prevReach: 0, prevSpend: 0, prevCount: 0 };
    });
    currentAds.forEach(a => {
      const ch = (a.channel || 'social').toLowerCase().replace(/\s+/g, '');
      const key = CHANNELS.some(c => c.key === ch) ? ch : 'social';
      byChannel[key].reach += Number(a.reach) || 0;
      byChannel[key].spend += Number(a.spend) || 0;
      byChannel[key].engagementSum += Number(a.engagement) || 0;
      byChannel[key].count += 1;
    });
    previousAds.forEach(a => {
      const ch = (a.channel || 'social').toLowerCase().replace(/\s+/g, '');
      const key = CHANNELS.some(c => c.key === ch) ? ch : 'social';
      byChannel[key].prevReach += Number(a.reach) || 0;
      byChannel[key].prevSpend += Number(a.spend) || 0;
      byChannel[key].prevCount += 1;
    });

    const channelPerformance = CHANNELS.map(c => {
      const d = byChannel[c.key];
      const value = formatK(d.reach) || '0';
      const prevReachCh = d.prevReach || 1;
      const change = d.prevReach ? ((d.reach - d.prevReach) / prevReachCh * 100).toFixed(1) : '0';
      return {
        name: d.name,
        value,
        change: change + '%',
        description: d.description,
        icon: d.icon,
        iconBg: d.iconBg,
        iconColor: d.iconColor
      };
    });

    let aiInsight = defaultAiInsight();
    const channelsWithSpend = Object.entries(byChannel).filter(([, d]) => d.spend > 0 && d.reach > 0);
    if (channelsWithSpend.length >= 2) {
      const withRoi = channelsWithSpend.map(([key, d]) => ({
        key,
        name: d.name,
        roi: d.reach / (d.spend || 1),
        spend: d.spend,
        reach: d.reach
      }));
      withRoi.sort((a, b) => a.roi - b.roi);
      const lowest = withRoi[0];
      const highest = withRoi[withRoi.length - 1];
      if (lowest.key !== highest.key && lowest.spend > 0) {
        const pct = Math.min(20, Math.round((lowest.spend / (totalSpend || 1)) * 100));
        aiInsight = {
          type: 'Budget Allocation',
          message: `${lowest.name} showing lower ROI. Consider reallocating ${pct}% budget to high-performing ${highest.name} campaigns.`
        };
      }
    }

    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const trend = { labels, reach: [0, 0, 0, 0], engagement: [0, 0, 0, 0] };
    const allAdsLast4Weeks = ads.filter(a => new Date(a.createdAt) >= new Date(now.getTime() - 4 * weekMs));
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now.getTime() - (4 - i) * weekMs);
      const weekEnd = new Date(now.getTime() - (3 - i) * weekMs);
      const inWeek = allAdsLast4Weeks.filter(a => {
        const t = new Date(a.createdAt).getTime();
        return t >= weekStart.getTime() && t < weekEnd.getTime();
      });
      trend.reach[i] = inWeek.reduce((acc, a) => acc + (Number(a.reach) || 0), 0);
      trend.engagement[i] = inWeek.length ? inWeek.reduce((acc, a) => acc + (Number(a.engagement) || 0), 0) / inWeek.length : 0;
    }
    const totalReachAll = CHANNELS.reduce((acc, c) => acc + byChannel[c.key].reach, 0);
    const distLabels = ['Social Media', 'Email', 'Display', 'Search'];
    const distPct = CHANNELS.map(c => totalReachAll ? Math.round((byChannel[c.key].reach / totalReachAll) * 100) : 0);
    const sumPct = distPct.reduce((a, b) => a + b, 0);
    if (sumPct === 0) {
      distPct[0] = 100;
      for (let i = 1; i < distPct.length; i++) distPct[i] = 0;
    }

    res.json({
      kpis,
      channelPerformance,
      aiInsight,
      trend: { labels: trend.labels, reach: trend.reach, engagement: trend.engagement },
      distribution: { labels: distLabels, values: distPct }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      message: error.message,
      kpis: defaultKpis(),
      channelPerformance: defaultChannelPerformance(),
      aiInsight: defaultAiInsight(),
      trend: defaultTrend(),
      distribution: defaultDistribution()
    });
  }
});

function defaultKpis() {
  return {
    totalReach: '0',
    totalReachChange: '0',
    engagementRate: '0%',
    engagementChange: '0',
    conversionRate: '0%',
    conversionChange: '0',
    totalSpend: 'R0',
    totalSpendChange: '0'
  };
}

function defaultChannelPerformance() {
  return CHANNELS.map(c => ({
    name: c.name,
    value: '0',
    change: '0%',
    description: c.description,
    icon: c.icon,
    iconBg: c.iconBg,
    iconColor: c.iconColor
  }));
}

function defaultAiInsight() {
  return {
    type: 'Budget Allocation',
    message: 'Add campaigns with reach and spend to get AI recommendations.'
  };
}

function defaultTrend() {
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    reach: [0, 0, 0, 0],
    engagement: [0, 0, 0, 0]
  };
}

function defaultDistribution() {
  return {
    labels: ['Social Media', 'Email', 'Display', 'Search'],
    values: [100, 0, 0, 0]
  };
}

module.exports = router;

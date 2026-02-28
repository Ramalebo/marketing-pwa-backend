import { createRouter, createWebHistory } from 'vue-router';

// Login temporarily disabled – all routes open without auth
const routes = [
  {
    path: '/login',
    redirect: '/dashboard'
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../views/Clients.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../views/Notes.vue')
  },
  {
    path: '/ads',
    name: 'Ads',
    component: () => import('../views/Ads.vue')
  },
  {
    path: '/insights',
    name: 'Insights',
    component: () => import('../views/Insights.vue')
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: () => import('../views/Chatbot.vue')
  },
  {
    path: '/sms',
    name: 'SMS',
    component: () => import('../views/SMS.vue')
  },
  {
    path: '/email',
    name: 'Email',
    component: () => import('../views/Email.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue')
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('../views/Templates.vue')
  },
  {
    path: '/post-history',
    name: 'PostHistory',
    component: () => import('../views/PostHistory.vue')
  },
  {
    path: '/schedule-posts',
    name: 'SchedulePosts',
    component: () => import('../views/SchedulePosts.vue')
  },
  {
    path: '/display',
    name: 'Display',
    component: () => import('../views/Display.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue')
  },
  {
    path: '/optimization',
    name: 'Optimization',
    component: () => import('../views/Optimization.vue')
  },
  {
    path: '/beacons',
    name: 'Beacons',
    component: () => import('../views/Beacons.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Auth guards disabled – login removed until mechanism is sorted
router.beforeEach((to, from, next) => {
  next();
});

export default router;


import Vue from 'vue'
import Authentication from '@/components/Authentication'
import Dashboard from '@/components/Dashboard'

export const routes = [
	{
		path: '/',
		name: 'Authentication',
		component: Authentication
  },
  {
		path: '/main',
		name: 'Dashboard',
		component: Dashboard
  },
]
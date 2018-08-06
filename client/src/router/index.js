import Vue from 'vue'
import Authentication from '@/components/Authentication'
import Dashboard from '@/components/Dashboard'
import Devices from '@/components/detail/Devices'
import Device from '@/components/detail/Device'
import Database from '@/components/Database'

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
  {
	  path: '/devices',
	  name: 'Devices',
	  component: Devices
  },
  {
	  path: '/database',
	  name: 'Database',
	  component: Database
  },
  {
	  path: '/device/:uid',
	  name: 'Device',
	  component: Device
  }
]
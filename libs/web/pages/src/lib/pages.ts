export const pages = [
  {
    name: 'Agents',
    icon: 'user',
    route: {
      path: 'agents',
      loadChildren: () => import('@cta/web/agents').then(mod => mod.AgentsModule),
      data: {
        breadcrumb: 'Agents'
      }
    }
  },
  {
    name: 'Back Tests',
    icon: 'user',
    route: {
      path: 'back-tests',
      loadChildren: () => import('@cta/web/back-tests').then(mod => mod.WebBackTestsModule),
      data: {
        breadcrumb: 'Back Tests'
      }
    }
  },
  {
    name: 'Exchanges',
    icon: 'user',
    route: {
      path: 'exchanges',
      loadChildren: () => import('@cta/web/exchanges').then(mod => mod.WebExchangesModule),
      data: {
        breadcrumb: 'Exchanges'
      }
    }
  }
]

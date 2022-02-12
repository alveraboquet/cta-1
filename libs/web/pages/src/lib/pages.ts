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
  }
]

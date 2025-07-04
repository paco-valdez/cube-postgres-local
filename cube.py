# Configuration options: https://cube.dev/docs/product/configuration

from cube import config

# context_to_app_id maps security contexts of individual queries to compiled contexts.
# Each compiled context would in turn produce a compiled data model.
# Learn more: https://cube.dev/docs/reference/configuration/config#context_to_app_id
@config('context_to_app_id')
def context_to_app_id(ctx: dict) -> str:
  return ctx['securityContext'].setdefault('team', 'default')

# scheduled_refresh_contexts provides a list of well-known security contexts.
# Thay can be mapped to compiled contexts and compiled data models ahead of time.
# Learn more:  https://cube.dev/docs/reference/configuration/config#scheduled_refresh_contexts
@config('scheduled_refresh_contexts')
def scheduled_refresh_contexts() -> list[dict]:
  return [
    { 'securityContext': { 'team': 'default' } },
    { 'securityContext': { 'team': 'marketing' } },
    { 'securityContext': { 'team': 'product' } },
    { 'securityContext': { 'team': 'sales' } }
  ]

# query_rewrite provides a way to inspect, modify, and restrict queries at runtime.
# Learn more: https://cube.dev/docs/reference/configuration/config#query_rewrite
@config('query_rewrite')
def query_rewrite(query: dict, ctx: dict) -> dict:
  # print(query)
  team = ctx['securityContext'].setdefault('team', 'default')

  # Raising an exception would prevent a query from running
  if team == 'product':
    raise Exception('Product team is restricted from running queries. See cube.py for details.')

  # Modifying a query is also possible.
  # Learn more: https://cube.dev/docs/guides/recipes#access-control
  if team == 'sales':
    query['limit'] = 10

  # Add time dimension date range automatically if rolling window measures are used.
  # It's not a best practice, just a matter of convenience in this demo deployment
  def add_date_range_for_measures(measures: list[str], date_range: list[str]):
    for measure in measures:
      if not 'measures' in query:
        query['measures'] = []

      if not 'timeDimensions' in query:
        query['timeDimensions'] = []

      if measure in query['measures'] and len(query['timeDimensions']) > 0:
        for time_dimension in query['timeDimensions']:
          if not 'dateRange' in time_dimension or time_dimension['dateRange'] == None:
            time_dimension['dateRange'] = date_range

  add_date_range_for_measures([
    'base_orders.total',
    'base_orders.dau',
    'base_orders.wau',
    'base_orders.mau',
    'orders.total',
    'orders.dau',
    'orders.wau',
    'orders.mau'
  ], [
    '2019-01-01',
    '2023-11-05'
  ])

  return query

cube(`Orders`, {
  sql: `SELECT * FROM orders`,

  preAggregations: {
    ordersByVendor: {
      measures: [Orders.count],
      dimensions: [Vendors.name]
    }
  },

  joins: {
    Vendors: {
      sql: `${CUBE}.vendor_id = ${Vendors}.vendor_id`,
      relationship: `belongsTo`
    }
  },
  measures: {
    count: {
      type: `count`
    }
  },
  dimensions: {
    id: {
      sql: `order_id`,
      type: `number`,
      primaryKey: true
    },
    title: {
      sql: `title`,
      type: `string`
    }
  },
  dataSource: `default`,
});
cube(`Orders`, {
  sql: `SELECT * FROM orders`,

  joins: {
    Vendors: {
      sql:  `${CUBE}.vendor_id = ${Vendors}.vendor_id`,
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

  dataSource: `default`
});
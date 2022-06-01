cube(`Vendors`, {
  sql: `SELECT * FROM vendors`,

  joins: {
  },

  measures: {
    count: {
      type: `count`
    }
  },

  dimensions: {
    id: {
      sql: `vendor_id`,
      type: `number`,
      primaryKey: true
    },
    name: {
      sql: `name`,
      type: `string`
    }
  },

  dataSource: `default`
});
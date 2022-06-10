const {
  securityContext: { appID },
} = COMPILE_CONTEXT;

cube(`Vendors`, {
  dataSource: appID,

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
});
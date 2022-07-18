const {
  securityContext: { appID },
} = COMPILE_CONTEXT;

cube(`Merchants`, {
  dataSource: appID,

  sql: `SELECT * FROM merchants`,

  measures: {
    count: {
      type: `count`
    },
  },
  dimensions: {
    id: {
      sql: `merchant_id`,
      type: `number`,
      primaryKey: true
    },
    merchant_name: {
      sql: `merchant_name`,
      type: `string`
    },
    commission: {
      sql: `commission`,
      type: `number`
    }
  },
});
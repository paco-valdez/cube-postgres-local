const {
  securityContext: { appID },
} = COMPILE_CONTEXT;

cube(`Orders`, {
  dataSource: appID,

  sql: `SELECT * FROM orders`,

  joins: {
    Vendors: {
      sql: `${CUBE}.vendor_id = ${Vendors}.vendor_id`,
      relationship: `belongsTo`
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
    },
    vendorName: {
      sql: `${Vendors}.name`,
      type: `string`
    }
  },
});
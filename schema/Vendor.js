if(typeof COMPILE_CONTEXT.securityContext === 'undefined' || typeof COMPILE_CONTEXT.securityContext.appID === 'undefined'){
  COMPILE_CONTEXT.securityContext = {
    securityContext: { securityContext: { appID: 'transactions' } },
  };
}

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
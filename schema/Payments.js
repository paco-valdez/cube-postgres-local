const {
  securityContext: { appID },
} = COMPILE_CONTEXT;

cube(`Payments`, {
  dataSource: appID,

  sql: `SELECT * FROM payments`,

  measures: {
    count: {
      type: `count`
    },
    revenue: {
      type: `sum`,
      sql: `${amountDim}`,
      shown: true
    }
  },
  dimensions: {
    id: {
      sql: `payment_id`,
      type: `number`,
      primaryKey: true
    },
    reference: {
      sql: `reference`,
      type: `string`
    },
    amountDim: {
      sql: `amount`,
      type: `number`
    }
  },
});

cube(`OrdersPayments`, {
  dataSource: appID,

  sql: `SELECT * FROM orders_payments`,

  preAggregations: {
    ordersByVendor: {
      measures: [OrdersPayments.count, OrdersPayments.revenue],
      dimensions: [Orders.vendorName]
    }
  },

  joins: {
    Payments: {
      sql: `${CUBE}.payment_id = ${Payments}.payment_id`,
      relationship: `hasMany`
    },
    Merchants: {
      sql: `${CUBE}.merchant_id = ${Merchants}.merchant_id`,
      relationship: `hasMany`
    },
    Orders: {
      sql: `${CUBE}.order_id = ${Orders}.order_id`,
      relationship: `hasMany`
    }
  },
  measures: {
    count: {
      type: `count`,
      drillMembers: [Orders.id, Payments.id, Merchants.id],
    },
    revenue: {
      type: `sum`,
      sql: `${paymentAmount}`
    }
  },

  dimensions: {
    id: {
      sql: `${OrdersPayments}.order_id::text || '_' || ${OrdersPayments}.payment_id::text || '_' || ${OrdersPayments}.merchant_id::text`,
      type: `string`,
      primaryKey: true
    },
    paymentAmount: {
      sql: `${Payments.amountDim}`,
      type: `number`,
      // subQuery: true,
      // propagateFiltersToSubQuery: true
    }
  },
});
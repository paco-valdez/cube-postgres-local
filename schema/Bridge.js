const {
    securityContext: { appID },
  } = COMPILE_CONTEXT;

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
        relationship: `belongsTo`
      },
      Merchants: {
        sql: `${CUBE}.merchant_id = ${Merchants}.merchant_id`,
        relationship: `belongsTo`
      },
      Orders: {
        sql: `${CUBE}.order_id = ${Orders}.order_id`,
        relationship: `belongsTo`
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
      },
      budgetedAmount: {
        type: `sum`,
        sql: `${budgetedAmountDim}`
      },
      commission: {
        type: 'max',
        sql: `${commissionDim}`
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
        type: `number`
      },
      budgetedAmountDim: {
        sql: `${Orders.budgetedDim}`,
        type: `number`
      },
      commissionDim: {
        sql: `${Merchants.commission}`,
        type: `number`
      }
    },
  });
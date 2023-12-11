const cubejs = require('@cubejs-client/core');
const sign = require('jwt-encode');
// Defined as CUBEJS_API_SECRET=secret1234
const secret = 'secret1234';
const data = {
  appID: `transactions`,
  iat: parseInt((new Date().getTime()/1000) + (60 * 60))
};
const jwt = sign(data, secret);

const cubejsApi = new cubejs.CubejsApi(
  jwt,
  { apiUrl: 'http://localhost:4000/cubejs-api/v1' }
);

const count_query ={
  "measures": [
    "Orders.count"
  ],
  "dimensions": [
    "Orders.title"
  ],
  "order": {
    "Orders.count": "desc"
  }
};

async function getResults(query) {
  return await cubejsApi.load(query);
};

async function dryRun(query) {
  return await cubejsApi.dryRun(query);
} 

test('Expect row count to be 5', async () => {
  const resultSet = await getResults(count_query);
  expect(resultSet.loadResponses[0].data.length).toBe(5);
});

test('Perform Dry run', async () => {
  const resultSet = await dryRun(count_query);
  expect(resultSet.normalizedQueries[0].measures[0]).toBe(count_query.measures[0]);
});


test('Invalid Query Dry run', async () => {

  const invalid_query = {
    "measures": [
      "Orders2.count"
    ],
    "dimensions": [
      "Orders.title"
    ],
    "order": {
      "Orders.count": "desc"
    }
  };
  try {
    await dryRun(invalid_query);
  } catch (e) {
    expect(e.message).toBe("Cube 'Orders2' not found for path 'Orders2.count'");
  }
});


const {default: cosmosServer} = require("@zeit/cosmosdb-server")
const {CosmosClient} = require("@azure/cosmos")
const https = require("https")
const test = require('tape')

const server = cosmosServer().listen(8081, () => {
  console.log(`Cosmos DB server running at https://localhost:8081`)
  runClient().catch(console.error)
})

async function runClient() {
  const client = new CosmosClient({
    endpoint: `https://localhost:8081`,
    key: "dummy key",
    // disable SSL verification
    // since the server uses self-signed certificate
    agent: https.Agent({rejectUnauthorized: false})
  })

  // initialize databases since the server is always empty when it boots
  const {database} = await client.databases.createIfNotExists({id: 'test-db'})
  const {container} = await database.containers.createIfNotExists({id: 'test-container'})

  // use the client
  try {
    return await tests(container)
  } catch (e) {
    console.log('got error on tests')
    throw (e)
  } finally {
    await server.close()
    // await new Promise((resolve) => {
    //   server.close(resolve)
    // })
  }

}

async function tests(container) {
  test('timing test', async (t) => {
  
    t.equal(1, 1)

    const o = container.items.upsert({a: 1})
    // const o = await container.items.upsert({a: 1})
    // t.deepEqual(o, {a: 1})

    t.end()

  })
}

// return

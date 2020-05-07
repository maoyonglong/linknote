const redis = require('redis')
const client = redis.createClient()

//const i = client.set("key1", "sdfsdf", () => {
	client.get('key1', (err, res) => {
	console.log(res)
})
//})





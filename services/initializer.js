const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL

class Database {
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  async connect() {
    try {
      await this.client.connect();
      // Send a ping to confirm a successful connection
      await this.client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
      // Ensures that the client will close when you get error
      console.log(e)
      await this.client.close();
    }
  }
}

module.exports = new Database();
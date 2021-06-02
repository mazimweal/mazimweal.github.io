process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const chalk = require('chalk');
const newEngine = require('@comunica/actor-init-sparql').newEngine;

const PORT = 4000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* cors middleware */
app.use(cors());
// express Router middleware
app.use(router);


//! QUERY STEPS:
//- 1. create query engine
//- 2. use engine to query async query method === query(queryString, context)
//- 3. compile the query results

// 1. create a query engine from comunica (with default config)
const myEngine = newEngine();

const getResult = async (datasources, query, res) => {
  try {
    // 2. querying 
    const result = await myEngine.query(
      query,
      { sources: datasources }
      );
      
    let results = [];

    // 3. compile results
    result.bindingsStream.on('data', (data) => {
      results.push(data);
    });

    console.log("RESULTS", results)

    // 4. send results in response
    result.bindingsStream.on('end', () => {
      res.send({
        data: results
      });

      console.log("RESULTS", results)
    });

    result.bindingsStream.on('error', (error) => {
      console.error(error)
    });
  } catch (error) {
      res.status(400).send({
        message: 'Parse error'
      });
      // console.log('// +++++++++++++++++++++++++++++++++++++++++++++++++++++ //');
      // console.error(error)
  }
};


router.post('/api/query', (req, res) => {
  const { datasources, query } = req.body;
  getResult(datasources, query, res);
});

app.listen(PORT, console.log(`listening on PORT ${chalk.green(PORT)}`));


// SELECT * WHERE {
//   ?s ?p ?o
//   } LIMIT 10
const cypher = require('cypher-query-builder');
const constants = require('./constants.js')

async function search(req, res) {
    try {
        // Make sure to include the protocol in the hostname
        let connection = new cypher.Connection('neo4j+s://'+constants.CONNECTION_URI, {
        username: constants.USERNAME,
        password: constants.PASSWORD,
        });
        let query = new cypher.Query(connection)
        console.log('Connection: ', connection)
        // const results = await query.match([
        //     cypher.node('i', 'Item', {name: 'Dining Table'}),
        //     cypher.relation('has', [ 'HAS_ITEM' ]),
        //     cypher.node('room')
        // ])
        //     .return('*')
        //     .run();

        let results = await query.matchNode('room', 'Room')
        .where({})
        .with('room')
        .create([
            (cypher.node('room', ''),
            cypher.relation('has', '', 'HAS_ITEM'),
            cypher.node('item', 'Item', { name: 'Dining' }))
        ])
        .return(['room', 'item'])
        .run();

        // const results = db.raw('match (p:Property)-[:HAS_ROOM]->(r:Room)-[:HAS_ITEM]->(i:Item)-[:HAS_THEME]->(t:Theme, where t.name = "Tropical")')
        // Get just the properties of the nodes
        // Get all the project nodes (including their id, labels and properties).
        // let projects = results.map(row => row.projects);
        // let projectProps = results.map(row => row.projects.properties);
        // console.log('projects:', projects)
        // console.log('projectProps:', projects)
        console.log('Results:', JSON.stringify(results))
        res.sendStatus(200);}
    catch (e) {
        console.log('Error: ', e)
        res.sendStatus(400)
    }
}

module.exports = { search }
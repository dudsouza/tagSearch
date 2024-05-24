const neo4j = require('neo4j-driver');
const constants = require('./constants.js')

// Method to connect to the noe4j driver
async function connect(){
    let driver={};

    try {
        driver = neo4j.driver('neo4j+s://'+constants.CONNECTION_URI, neo4j.auth.basic(constants.USER, constants.PASSWORD))
        const serverInfo = await driver.getServerInfo()
        console.log('Connection established')
        console.log(serverInfo)
    } catch(err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
        return driver;
    }
}

function createQueryString(formData) {
    let query='';
    let roomEmpty=true; // If no room provided no need to match items from particular room
    Object.keys(formData).forEach(function(key) {
        // console.debug('Key : ' + key + ', Value : ' + formData[key])
        // If no value then skip it as no MATCH needed
        if(formData[key] == ''){
        }
        else if(key == 'item') {
            if(roomEmpty) {
                query += `MATCH (i:Item where toLower(i.name) = toLower($item)) 
                with i
                `
            } else {
                query += `MATCH (r)-[:HAS_ITEM]->(i:Item where toLower(i.name) = toLower($item)) 
                with i
                `
                roomEmpty = true;
            }
        }
        else if(key == 'room') {
            roomEmpty = !roomEmpty;
            query += `MATCH (r:Room where toLower(r.name) = toLower($room)) 
            with r
            `
        } // Creating MATCH conditions for relations and keys other than Item & Room
        else {
            if (roomEmpty) {
                query += `${constants.MATCH['item']}-[:${constants.RELATIONS[key]}]->(${constants.LETTER[key]}:${constants.TYPES[key]} WHERE toLower(${constants.LETTER[key]}.name) = toLower($${key})) 
                with i
            `} else {
                query += `MATCH (r)-[:HAS_ITEM]->(i:Item)-[:${constants.RELATIONS[key]}]->(${constants.LETTER[key]}:${constants.TYPES[key]} WHERE toLower(${constants.LETTER[key]}.name) = toLower($${key})) 
                with i
                `
                roomEmpty = true;
            }
        }
    })
    return query;
}

// This method groups all items into an array for each room
function transformRespData(data) {
    combinedResults = data.reduce((acc, curr) => {
        const found = acc.find(item => item.name === curr.name);
        if (found)
            found.items.push(curr.item);
        else {
            acc.push({
                name:curr.name,
                items: [curr.item],
                url: curr.url
            });
        }
        return acc;
    },[]);
    const transformedData = {
        status: 'success',
        results: combinedResults
    }
    console.debug(transformedData);
    return transformedData
}

async function search(req, res) {
    let driver;
    try {
        driver = await connect();

        const formData = req.body;
        let query = createQueryString(formData);
        // Further match room for the items matched and return name & url with item
        query += `match (r:Room)-[:HAS_ITEM]->(i)
        with i, r
        RETURN r.name AS name, r.url AS url, i.name AS item`
        const { records, summary, keys } = await driver.executeQuery(
            query,
            formData,
            constants.DATABASE
        )
        // Summary information
        console.debug(
            `>> The query ${summary.query.text} ` +
            `returned ${records.length} records ` +
            `in ${summary.resultAvailableAfter} ms.`
        )
        let result = [];
        // Loop through results and store them into an array
        for(record of records) {
            result.push(
                {
                    name: record.get('name'),
                    item: record.get('item'),
                    url:record.get('url')
                }
            )
        }
        const transformResponse = transformRespData(result);
        res.status(200).json(transformResponse);
    } catch (e) {
        console.error();('Error: ', e)
        res.sendStatus(400);
    }
    finally {
        console.debug('neo4j driver closed')
        driver.close();
    }
}

module.exports = { search }

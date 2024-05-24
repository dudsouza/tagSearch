const USER='neo4j';
const PASSWORD="PkMPXKGxTQJWJ0g2AfM2e_608mnWs75F6b4yAf7xYKU"
const CONNECTION_URI='e1feb1c0.databases.neo4j.io:7687'
const DATABASE = { database: 'neo4j' };

const RELATIONS = {
    room: 'HAS_ROOM',
    item: 'HAS_ITEM',
    theme: 'HAS_THEME',
    material: 'HAS_MATERIAL',
    colour: 'HAS_COLOURSCHEME',
    light: 'HAS_LIGHT',
    perspective: 'HAS_PERSPECTIVE',
    adjective: 'HAS_ADJECTIVE'
};

const MATCH={
    item: 'MATCH (i:Item)',
    room: 'MATCH (r:Room)'
}

const LETTER = {
    room: 'r',
    item: 'i',
    theme: 't',
    material: 'm',
    colour: 'c',
    light: 'l',
    perspective: 'p',
    adjective: 'a'
}

const TYPES = {
    room: 'Room',
    item: 'Item',
    theme: 'Theme',
    material: 'Material',
    colour: 'ColourScheme',
    light: 'Light',
    perspective: 'Perspective',
    adjective: 'Adjective'
};

const NAME = {
    room: 'r.name',
    item: 'i.name',
    theme: 't.name',
    material: 'm.name',
    colour: 'c.name',
    light: 'l.name',
    perspective: 'p.name',
    adjective: 'a.name'
};

// const formData = {
//     room: 'dining',
//     item: '',
//     theme: 'rustic',
//     material: 'Wooden',
//     colour: 'white distressed',
//     light: '',
//     perspective: '',
//     adjective: ''
// };

module.exports = { USER,
    PASSWORD,
    CONNECTION_URI,
    DATABASE,
    RELATIONS,
    MATCH,
    LETTER,
    TYPES,
    NAME
}
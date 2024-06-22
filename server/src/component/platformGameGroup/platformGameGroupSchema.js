const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const platformGameGroupSchema = new Schema({
    //group id
    groupId: {type: String},
    //group code
    code: {type: Number},
    //group name
    name: {type: String},
    //group name
    displayName: {type: String},
    //platform obj id
    platform: {type: Schema.ObjectId, ref: 'platform'},
    //group games
    games: [{index: {type: Number}, game: {type: Schema.ObjectId, ref: 'game'}}],
    //child departments
    children: [{type: Schema.ObjectId, ref: 'platformGameGroup'}],
    //parent department
    parent: {type: Schema.ObjectId, ref: 'platformGameGroup', default: null},
    //game group icon path
    gameGroupIconUrl: {type: String}
});

module.exports = platformGameGroupSchema;
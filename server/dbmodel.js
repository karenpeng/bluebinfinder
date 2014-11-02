var mongoose = require('mongoose');
var recordSchema = mongoose.Schema({
  'name': {
    type: String
  },
  'x': {
    type: Number
  },
  'y': {
    type: Number
  }
});

recordSchema.index({
  master_id: 1,
  name: 1
});
module.exports = mongoose.model('Record', recordSchema);
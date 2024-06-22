const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;
const permissionSchema = new Schema(
  {
    name: {
      type: String
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource"
    },
    desc: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

permissionSchema.plugin(mongoosePaginate);
module.exports = permissionSchema;

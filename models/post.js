module.exports = function (mongoose) {
    const option = {
        collection: "post",
        timestamps: {
            createdOn: "createdOn",
            updatesOn: "updatedOn"
        }
    }

    console.log("This is postSchema");
    const postSchema = new mongoose.Schema({
        isDeleted: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        postImg: {
            type: String,
            required:true
        },
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        }
    }, option);

    return postSchema;
}
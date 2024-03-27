module.exports = function (mongoose) {
    const option = {
        collection: "savepost",
        timestamps: {
            createdOn: "createdOn"
        }
    }

    console.log("This is savepostSchema");
    const savepostSchema = new mongoose.Schema({
        _userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        _postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "post"
        },
        
    }, option);

    return savepostSchema;
}
module.exports = function (mongoose) {
    const option = {
        collection: "user",
        timestamps: {
            createdOn: "createdOn",
            updatesOn: "updatedOn"
        }
    }

    console.log("This is userSchema");
    const userSchema = new mongoose.Schema({
        isDeleted: {
            type: Boolean,
            default: false
        },
        userstatus: {
            type: String,
            enum: ["created", "active", "deactive"],
            default: "created"
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profilephoto: {
            type: String,
            default:'/static/defaultPhoto.avif'
            // unique: true,
            // required: true
        }
    }, option);

    userSchema.pre('save', async function (next) {
        this.fullName = `${this.firstName} ${this.lastName}`;
        // console.log(countdata);
        // console.log("this is pre hook ",this.name.fullName);
        next();
    });
    return userSchema;
}
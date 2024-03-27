var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path')

const multer = require('multer');
const { log } = require('console');
const poststorage = multer.diskStorage({
    destination: function (req, file, cb) {
        filePath = `public/upload/posts/`;
        fs.mkdirSync(filePath, { recursive: true })
        cb(null, filePath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, uniqueSuffix + ext)
    }
})
const uploadpost = multer({
    storage: poststorage,
    limits: { fileSize: 2 * 1024 * 1024 }, //2 mb   
    fileFilter: function checkFileType(_req, file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // console.log("extname", extname, "---", path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
        // console.log("mimetype", file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error("Invalid Extention"));
        }
    }
}).single('postImg')

//timeline handle in index.js file
//loading timeline page
router.get('/', function (req, res, next) {
    res.render('page/timeline', { title: 'Posts' });
});

//loading create post page
router.get('/create', function (req, res, next) {
    res.render('post/createPost', { title: 'Posts', layout: 'layout' });
});

//post created 
router.post('/create', function (req, res, next) {
    try {
        uploadpost(req, res, async function (err) {
            console.log("file upload");
            console.log("-file----->", req.file);
            if (err) {
                console.log("Get error===", JSON.stringify(err));
                req.flash('error', err.message);
                return res.status(406).send({
                    status: 406,
                    type: "error",
                    message: err.message
                })
            } else {

                console.log("------->", req.body);
                req.body['_user'] = req.user._id
                req.body['postImg'] = "/upload/posts/" + req.file.filename
                const data = await postModel(req.body);
                await data.save();
                res.status(201).send({
                    status: 201,
                    type: "Success",
                    message: "Post Successfully uploaded"
                })
            }
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 400,
            type: "error",
            message: "Error while uploading post"
        })
    }
});

//loading view model and edit model
router.get('/view', async function (req, res, next) {
    try {
        if (req.query.viewId) {
            condition = req.query.viewId
        } else if (req.query.editId) {
            condition = req.query.editId
        }else{
            return  res.status(404).send({
                status: 404,
                type: "error",
                message: "Invalid URL"
            })
        }
        console.log(req.query);
        const data = await postModel.aggregate([
            {
                $match: {
                    _id: new ObjectId(condition)
                }
            },
            {
                $lookup: {
                    from: "user",
                    let: { userId: "$_user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"]
                                }
                            }
                        },
                        {
                            $project: { email: 1, fullName: 1, profilephoto: 1, _id: 0 }
                        }
                    ],
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            }
        ]);
        console.log("Data pass in model------", data[0]);
        if (req.query.viewId) {
            res.render('model/viewModel', { title: 'Posts', viewData: data[0], layout: 'blank' });
        } else if (req.query.editId) {
            res.render('model/editModel', { title: 'Posts', viewData: data[0], layout: 'blank' });
        } else {
            res.status(404).send({
                status: 404,
                type: "error",
                message: "Invalid URL"
            })
        }
    } catch (error) {
        console.log(error);
        res.end()
    }
});

// post edit return in ajax in edit model
router.post('/edit', uploadpost,async function (req, res, next) {
    try {
        console.log("=====");
        console.log(req.body);
        console.log("========");
        
            console.log("file upload");
            console.log("-file----->", req.file);
            // if (err) {
            //     console.log("Get error===", JSON.stringify(err));
            //     req.flash('error', err.message);
            //     return res.status(406).send({
            //         status: 406,
            //         type: "error",
            //         message: "Post not uploaded"
            //     })
            // } else {

                console.log("------->", req.body);
                if(req.file.filename){
                    req.body['postImg'] = "/upload/posts/" + req.file.filename
                }
                console.log("final body---",req.body);

                res.status(201).send({
                    status: 201,
                    type: "Success",
                    message: "Post Successfully uploaded"
                })
            // }
     

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 400,
            type: "error",
            message: "Error while uploading post"
        })
    }
});

//archive post
router.delete('/archive/:postId', async function (req, res, next) {
    try {
        const userCompare = await postModel.findOne({ _id: new ObjectId(req.params.postId) }, "_user").lean();
        if (String(userCompare._user) == req.user._id) {
            await postModel.updateOne({ _id: req.params.postId }, { $set: { isDeleted: true } })
        } else {
            return res.status(406).send({
                status: 406,
                type: 'error',
                message: "Data not found"
            })
        }
        res.status(202).send({
            status: 202,
            type: 'success',
            message: "successfully archive"
        })
    } catch (error) {
        console.log(error);
    }
});

//call when save btn click 
router.post('/savePost', async function (req, res, next) {
    try {

        console.log(req.query);
        console.log(req.body);
        const compareUserId = await postModel.exists({ _id: req.body._postId, _user: { $ne: req.user._id } })
        console.log(compareUserId);
        if (!compareUserId) {
            return res.status(406).send({
                status: 406,
                type: 'error',
                message: "Data not found"
            })
        }
        req.body["_userId"] = req.user._id;
        const data = await savepostModel.exists(req.body)
        if (data) {
            await savepostModel.findOneAndRemove(req.body)
            return res.status(202).send({
                status: 202,
                type: 'success',
                message: "successfully unsave"
            })
        } else {
            const savePostData = await savepostModel(req.body)
            await savePostData.save()
            return res.status(202).send({
                status: 202,
                type: 'success',
                message: "successfully save"
            })
        }

    } catch (error) {
        console.log(error);
    }
});
module.exports = router;
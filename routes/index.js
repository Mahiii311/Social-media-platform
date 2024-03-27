var express = require('express');
var router = express.Router();
const passport = require('passport');
const md5 = require('md5');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('page/timeline', { title: 'Posts', layout: 'main' });
});

//loading sign-in page
router.get('/sign-in', function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/post');
  }
  res.render('sign-in', { title: 'sign-in', layout: 'login' });
});

//login user
router.post('/sign-in', function (req, res, next) {
  console.log("Log in data");
  console.log(req.body);
  try {

    passport.authenticate('local', function (err, user, info) {
      console.log("au----post--------");
      if (err) {
        console.log("Passport error");
        return next(err)
      }
      if (!user) {
        // *** Display message without using flash option
        // re-render the login form with a message
        console.log("Error msg user not found");
        req.flash('error', 'Please provide valid login details')
        return res.redirect('/sign-in');
      }
      req.logIn(user, async function (err) {
        if (err) {
          console.log("Login error");
          return next(err);
        }
        await userModel.updateOne({ _id: new ObjectId(req.user._id) }, { userstatus: "active" })
        console.log("successfully log in with passport");
        res.redirect('/post');
      });
    })(req, res, next);
  } catch (error) {
    console.log("post method", error);
    res.redirect('/');
  }
});

//loading sign-up page
router.get('/sign-up', function (req, res, next) {
  res.render('sign-up', { title: 'sign-up', layout: 'login' });
});

//email check while typing
router.get('/sign-up/emailValidate', async function (req, res, next) {
  // console.log("email fatch");
  // console.log(req.query.email);
  const emailExists = await userModel.exists({ email: req.query.email })
  console.log(emailExists);
  if (emailExists) {
    console.log("email exist");
    return res.send(false)
  }
  console.log("email not exist");
  res.send(true)
});

//register user
router.post('/sign-up', async function (req, res, next) {
  try {
    console.log(req.body);
    console.log(req.body.firstName);
    const data = await userModel(req.body);
    const emailExists = await userModel.exists({ email: req.body.email })
    console.log(emailExists);
    if (emailExists) {
      console.log("email exist");
      return res.status(409).send({
        status: 409,
        type: "error",
        message: "Email already exist"
      })
    }
    await data.save();
    res.status(201).send({
      status: 201,
      type: "success",
      message: "User Successfully Register"
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 400,
      type: "error",
      message: "error while registerd user"
    })
  }
});

//post list
router.get('/list', async function (req, res, next) {
  try {
    const data = await postModel.aggregate([
      {
        $match:{
          isDeleted: false
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
    // console.log(data);
    res.render('post/postCard', { post: data, layout: 'blank' })
  } catch (error) {
    console.log("this is call /list router");
    console.log(error);
  }
});

//logout user
router.get('/logOut', async function (req, res, next) {
  console.log("log out successfully");
  await userModel.updateOne({ _id: new ObjectId(req.user._id) }, { userstatus: "deactive" })
  req.logout();
  res.redirect('/');
});

module.exports = router;
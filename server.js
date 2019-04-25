const express = require('express')
const Sequelize = require("sequelize")
const op = Sequelize.Op;

const db = require('./db')

const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(session({
  key: 'userId',
  secret: 'someRandomStuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60000
  }
}))

app.use((req, res, next) => {
  if (req.cookies.userId && !req.session.user) {
    //console.log("clearing Cookie")
    res.clearCookie('userId')
  }

  next()
})

const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookie.userId) {
    res.redrect('/')
  } else {
    next()
  }
}

app.use((req, res, next) => {
  if (req.originalUrl.includes('pages')) {
    if (req.session.user) {
      console.log(req.session.user)
      next()
    } else {
      res.redirect('/')
    }
  } else {
    next()
  }

})

app.use(
  '/pages',
  express.static(__dirname + '/public/html')
)
app.use(
  '/js',
  express.static(__dirname + '/public/js')
)
app.use(
  '/media',
  express.static(__dirname + '/public/media')
)

app.get('/', (req, res) => {
  console.log('...............................')
  console.log('request cookie: ', req.cookies)
  console.log('request session: ', req.session)
  console.log('...............................')
  if (req.session.user) {
    res.sendFile(__dirname + '/public/html/dashboard.html')
  } else {
    res.sendFile(__dirname + '/public/html/login.html')
  }
})

app.get('/login', (req, res) => {
  res.redirect('/')
})

app.post('/login', (req, res) => {
  console.log(req.body)
  db.User.findOne({
    where: {
      name: req.body.name
    }
  }).then(user => {
    if (!user) {
      res.redirect('/login');
    } else {
      req.session.user = user.dataValues
      req.session.save();
      res.send({ success: true })
    }
  })
})

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/html/signup.html')
})

app.post('/signup', (req, res) => {
  db.User.create({
    name: req.body.name,
    email: req.body.email
  }).then(data => {
    res.send({
      success: true
    })
  })
})

app.get('/logout', (req, res) => {
  if (req.cookies.userId) {
    res.clearCookie('userId')
  }
  res.redirect('/login')
})

app.get('/products', (req, res) => {
  db.Product.findAll().then(products => {
    console.log("Sending all products")
    res.json(products)
  }).catch(err => {
    console.log(err)
  })
})

app.post('/products', (req, res) => {
  console.log("printing response body :::::", req.body);
  db.Product.create({
    name: req.body.name,
    quantity: parseInt(req.body.quantity),
    price: parseInt(req.body.price),
    vendorId: parseInt(req.body.vendorId)
  }).catch(function (err) {
    console.log(err)
  })
  res.send({
    success: true
  })
})

app.post('/deleteProduct',(req,res)=>{
  db.CartItems.destroy({
    where:{
      productId: req.body.id
    }
  })
  .then(()=>{
    db.Product.destroy({
      where:{
        id: req.body.id
      }
    }).then(data=>{
      res.send({
        success: true
      })
    })
  })
  
})

app.get('/vendors', (req, res) => {
  db.Vendor.findAll().then(users => {
    console.log("Sending all vendors")
    res.json(users)
  }).catch(err => {
    console.log(err)
  })
})

app.post('/vendors', (req, res) => {
  db.Vendor.create({
    name: req.body.name,
  })
    .then(() => {
      res.send({
        success: true
      })
    })
})

app.get('/users', (req, res) => {
  db.User.findAll().then(users => {
    console.log("Sending all users")
    res.json(users)
  }).catch(err => {
    console.log(err)
  })
})

app.get('/cartLen', (req, res) => {
  let username = req.session.user.name;
  db.CartItems.count({
    where: {
      userName: username
    }
  }).then(data => {
    // console.log(data)
    if (data) {
      res.json({
        length: data
      })
    } else {
      res.json({
        length: 0
      })
    }

  })

})

app.get('/cartItems', (req, res) => {
  let username = req.session.user.name;
  db.CartItems.findAll({
    where: {
      userName: username
    }
  }).then(data => {
    // console.log(data)
    if (data) {
      res.json(data)
    } else {
      res.json({
        length: 0
      })
    }

  })

})

app.post('/removeFromCart', (req, res) => {
  console.log(".......................................")
  console.log(req.body)
  console.log("........................................")
  db.CartItems.destroy({
    where: {
      productId: req.body.productId,
      userName: req.session.user.name
    }
  }).then(data => {
    res.send({
      success: true
    })
  })
})

app.post('/deleteVendor', (req, res) => {
  db.Product.findAll({
    attributes:['id'],
    where: {
      vendorId: req.body.id
    }
  }).then(data=>{
    let arr=[]
    data.forEach(element => {
      console.log(element.dataValues.id);
      arr.push(element.dataValues.id)
    });
    // console.log(data)
    db.CartItems.destroy({
      where: {
        productId:{
          [op.in]:arr
        }
      }
    })
    .then(()=>{
      db.Product.destroy({
        where:{
          vendorId: req.body.id
        }
      })
      .then(()=>{
        db.Vendor.destroy({
          where: {
            id: req.body.id
          }
        })
        .then(data=>{
          res.send({
            success: true
          })
        })
      })    
    })
  })
})

app.post('/addToCart', async (req, res) => {

  try {
    if (req.session.user) {
      const prod = await db.Product.findOne({
        where: {
          id: req.body.productId
        }
      })
      const user = await db.User.findOne({
        where: {
          name: req.session.user.name
        }
      })
      const cartObj = await db.CartItems.findOne({
        where: {
          productId: parseInt(req.body.productId),
          userName: req.session.user.name
        }
      })
      if (cartObj === null) {
        const newCart = await db.CartItems.create({
          name: prod.name,
          quantity: 1,
          price: prod.price,
          productId: prod.id,
          userName: user.name
        })
      } else {
        console.log("updating")
        const result = await db.CartItems.update({
          quantity: cartObj.quantity + 1,
        },
          {
            where: {
              id:cartObj.id
            }
          })
      }
      res.send({ success: true })
    }
  } catch (e) {
    console.log(e.message)
  }
})

app.post('/subFromCart', async (req, res) => {
  try {
    if (req.session.user) {
      const prod = await db.Product.findOne({
        where: {
          id: req.body.productId
        }
      })
      const user = await db.User.findOne({
        where: {
          name: req.session.user.name
        }
      })
      const cartObj = await db.CartItems.findOne({
        where: {
          productId: parseInt(req.body.productId),
          userName: req.session.user.name
        }
      })
      if (cartObj.quantity == 1) {
        const newCart = await db.CartItems.destroy({
          where:{
            id: cartObj.id
          }
        })
      } else {
        console.log("updating")
        const result = await db.CartItems.update({
          quantity: cartObj.quantity - 1,
        },
          {
            where: {
              id: cartObj.id
            }
          })
      }
      res.send({ success: true })
    }
  } catch (e) {
    console.log(e.message)
  }
})



app.post('/cart')
db.sequelize.sync({
  force: true
})
  .then(() => {
    console.log('Database synced')
    db.User.create({
      name: "d",
      email: "g"
    })
    db.Vendor.create({
      name: "neeta"
    })

    db.Product.create({
      name: "phone1",
      quantity: 2,
      price: 100,
      vendorId: 1
    })
    db.Product.create({
      name: "phone2",
      quantity: 2,
      price: 100,
      vendorId: 1
    })
    db.Product.create({
      name: "phone3",
      quantity: 2,
      price: 100,
      vendorId: 1
    })
    db.Product.create({
      name: "phone4",
      quantity: 2,
      price: 100,
      vendorId: 1
    })

    const PORT = process.env.PORT || 4444

    app.listen(PORT, () => {
      console.log(`Started on http://localhost:${PORT}`)
    })
  })

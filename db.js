const Sequelize = require('sequelize')
const Op = Sequelize.Op

const sequelize = new Sequelize({
  dialect: 'sqlite', 
  storage: __dirname + '/Product.db'
})

const Vendor = sequelize.define('vendor', {
  name: {
  type: Sequelize.STRING,

}
})

const Product = sequelize.define('product', {
  name: {
      type: Sequelize.STRING,
     
 },
 quantity: Sequelize.INTEGER,
 price:{
  type: Sequelize.STRING,
  allowNull: false,
  defaultValue:0.0
 }
})

const User = sequelize.define('user', {
  name: {
      type: Sequelize.STRING,
      primaryKey: true
  },
  email: Sequelize.STRING
})

const CartItems= sequelize.define('cartitem' ,{
  name:Sequelize.STRING,
  quantity: Sequelize.INTEGER,
  price:Sequelize.INTEGER
})

Product.belongsTo(Vendor);
Vendor.hasMany(Product, {onDelete: "cascade"});

CartItems.belongsTo(Product)
Product.hasMany(CartItems, {onDelete: "cascade"})

CartItems.belongsTo(User)
User.hasMany(CartItems, {onDelete: "cascade"})

module.exports={
  sequelize,
  Vendor,
  Product,
  User,
  CartItems
}

 

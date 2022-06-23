const { config } = require('../../config/config');
const {
  Model,
  DataTypes
} = require('sequelize');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(config.dbName, config.mysqlUser, config.mysqlPassword, {
  host: config.mysqlHost,
  port: config.mysqlPort,
  dialect: 'mysql'
});

class SuperCharger extends Model {
}

SuperCharger.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '名稱'
  },
  city: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '縣市'
  },
  tpc: {
    type: DataTypes.INTEGER,
    comment: 'tpc數量'
  },
  ccs2: {
    type: DataTypes.INTEGER,
    comment: 'ccs2數量'
  },
  floor: {
    type: DataTypes.STRING(10),
    comment: '樓層'
  },
  business_hours: {
    type: DataTypes.STRING(30),
    comment: '營業時間'
  },
  park_fee: {
    type: DataTypes.STRING(10),
    comment: '停車費率'
  },
  charger_fee: {
    type: DataTypes.STRING(10),
    comment: '充電費率'
  },
  version: {
    type: DataTypes.STRING(10),
    comment: '版本'
  },
  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'super_charger'
});

class User extends Model {
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '角色'
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    comment: '帳號'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '密碼'
  },
  nickname: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '暱稱'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '電子郵件'
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '生日'
  },
  sex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '性別'
  },
  charger_id: {
    type: DataTypes.INTEGER,
    references: {
      model: SuperCharger,
      key: 'id'
    },
    comment: '管理超充id'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否已驗證'
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '積分'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'user'
});

class PointLog extends Model {
}

PointLog.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    comment: '使用者id'
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '分類'
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '點數快照'
  },
  change: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '增減數'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'point_log'
});

class CarModel extends Model {
}

CarModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  model: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '型號'
  },
  spec: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '規格'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'car_model'
});

class Car extends Model {
}

Car.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    comment: '使用者id'
  },
  car_model_id: {
    type: DataTypes.INTEGER,
    references: {
      model: CarModel,
      key: 'id'
    },
    comment: '車輛型號id'
  },
  manufacture_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '出廠日期'
  },
  has_image: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否擁有圖片'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'car'
});

class AdministrativeDistrict extends Model {
}

AdministrativeDistrict.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  city: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '縣市'
  },
  area: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '區域'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'administrative_district'
});

class Trip extends Model {
}

Trip.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    comment: '使用者id'
  },
  mileage: {
    type: DataTypes.INTEGER,
    comment: '滿電里程'
  },
  consumption: {
    type: DataTypes.FLOAT,
    comment: '平均電力'
  },
  total: {
    type: DataTypes.FLOAT,
    comment: '電量總計'
  },
  start: {
    type: DataTypes.STRING(30),
    comment: '起點'
  },
  end: {
    type: DataTypes.STRING(30),
    comment: '終點'
  },
  start_battery_level: {
    type: DataTypes.INTEGER,
    comment: '起點電量'
  },
  end_battery_level: {
    type: DataTypes.INTEGER,
    comment: '終點電量'
  },
  is_charge: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
    comment: '是否充電'
  },
  charger_id: {
    type: DataTypes.INTEGER,
    references: {
      model: SuperCharger,
      key: 'id'
    },
    comment: '超充id'
  },
  charge: {
    type: DataTypes.INTEGER,
    comment: '充電%數'
  },
  fee: {
    type: DataTypes.INTEGER,
    comment: '充電費用'
  },
  trip_date: {
    type: DataTypes.DATEONLY,
    comment: '旅程日期'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'trip'
});

class TripRate extends Model {
}

TripRate.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    comment: '使用者id'
  },
  trip_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Trip,
      key: 'id'
    },
    comment: '旅程id'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'trip_rate'
});

class Product extends Model {
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '名稱'
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '點數'
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '庫存'
  },
  charger_id: {
    type: DataTypes.INTEGER,
    references: {
      model: SuperCharger,
      key: 'id'
    },
    comment: '超充id'
  },
  is_launched: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
    comment: '是否上架'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'product'
});

class RedeemLog extends Model {
}

RedeemLog.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  seller_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    comment: '賣方id'
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    comment: '買方id'
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    },
    comment: '產品id'
  },

  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '建立時間'
  },
  update_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '更新時間'
  },
}, {
  sequelize,
  freezeTableName: true,
  timestamps: false,
  modelName: 'redeem_log'
});

module.exports = {
  sequelize,
  User,
  PointLog,
  Car,
  CarModel,
  AdministrativeDistrict,
  SuperCharger,
  Trip,
  TripRate,
  Product,
  RedeemLog
};

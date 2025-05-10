const { Sequelize, DataTypes } = require("sequelize");

// Create a Sequelize instance and connect to the PostgreSQL database
const sequelize = new Sequelize(
  "protfolio",
  "protfolio_user",
  "T2RLMoynT8N3QHij9bpUkscvlzNkHr5L",
  {
    host: "dpg-d0fg10qdbo4c73ads8h0-a.oregon-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      statement_timeout: 60000,
      idle_in_transaction_session_timeout: 180000,
      conectionTimeoutMillis: 5000,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 100,
      min: 0,
      idle: 30000,
    },
  }
);

// Define the User model
const User = sequelize.define(
  "user",
  {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: sequelize.literal("gen_random_uuid()"), // DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_headline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("now"),
    },
  },
  {
    timestamps: false,
    modelName: "User",
    tableName: "user",
    schema: "public",
    paranoid: true,
  }
);

// Define the Skill model
const Skill = sequelize.define(
  "skill",
  {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: sequelize.literal("gen_random_uuid()"), // DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skill_heading: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key_skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    modelName: "Skill",
    tableName: "skill",
    schema: "public",
    paranoid: true,
  }
);

// Define the Project model
const Project = sequelize.define(
  "project",
  {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: sequelize.literal("gen_random_uuid()"), // DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    modelName: "Project",
    tableName: "project",
    schema: "public",
    paranoid: true,
  }
);

// Define the Blog model
const Blog = sequelize.define(
  "blog",
  {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: sequelize.literal("gen_random_uuid()"), // DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    modelName: "Blog",
    tableName: "blog",
    schema: "public",
    paranoid: true,
  }
);

// Define relationships
User.hasMany(Skill, { as: "skills", foreignKey: "user_id" });
User.hasMany(Blog, { as: "blogs", foreignKey: "user_id" });
User.hasMany(Project, { as: "projects", foreignKey: "user_id" });

Skill.belongsTo(User, { foreignKey: "user_id" });
Project.belongsTo(User, { foreignKey: "user_id" });
Blog.belongsTo(User, { foreignKey: "user_id" });

// Sync all models with the database
// (async () => {
//   try {
//     await sequelize.sync();
//     console.log("Database synchronized successfully");
//   } catch (error) {
//     console.error("Error syncing database:", error);
//   }
// })();

module.exports = {
  User,
  Skill,
  Project,
  Blog,
  sequelize,
};

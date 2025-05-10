const express = require("express");
const router = express.Router();
const { User, Skill, Project, Blog } = require("../models/model");

// Get all users with their related data
router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Skill,
          as: "skills",
        },
        {
          model: Project,
          as: "projects",
        },
        {
          model: Blog,
          as: "blogs",
        },
      ],
    });
    return res.status(200).json({ status: "Success", users });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// Get user details by UUID
router.get("/user-details/:uuid", async (req, res) => {
  try {
    if (!req.params.uuid) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
      include: [
        {
          model: Skill,
          as: "skills",
        },
        {
          model: Project,
          as: "projects",
        },
        {
          model: Blog,
          as: "blogs",
        },
      ],
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }
    return res.status(200).json({ status: "Success", user });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// Create new user
router.post("/signup", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const userData = {
      name: req.body.name,
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password.trim(),
    };
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "Error", message: "User already exists" });
    }

    const user = await User.create(userData);
    return res.status(201).json({ status: "Success", user });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { email: req.body.email.trim().toLowerCase() },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }
    console.log(user.password, req.body.password, "asjhdbask");
    if (user.password !== req.body.password.trim()) {
      return res
        .status(401)
        .json({ status: "Error", message: "Invalid password" });
    }
    return res.status(200).json({ status: "Success", user });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// Update user details
router.patch("/update-user/:uuid", async (req, res) => {
  try {
    if (!req.params.uuid) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const updateData = {
      name: req.body.name,
      profile_headline: req.body.profile_headline,
      profile_summary: req.body.profile_summary,
      img_url: req.body.img_url,
      github: req.body.github,
      linkedin: req.body.linkedin,
    };

    await user.update(updateData);
    return res.status(200).json({ status: "Success", user });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// add skill
router.post("/add-skill/:userId", async (req, res) => {
  try {
    if (!req.params.userId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }

    const user = await User.findOne({
      where: { uuid: req.params.userId },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    // duplicate check
    const existingSkill = await Skill.findOne({
      where: {
        skill_heading: req.body.skill_heading.trim(),
        user_id: user.id,
      },
    });
    if (existingSkill) {
      return res
        .status(400)
        .json({ status: "Error", message: "Skill already exists" });
    }

    const skill = await Skill.create({
      skill_heading: req.body.skill_heading,
      key_skills: req.body.key_skills,
      user_id: user.id,
    });

    return res.status(201).json({ status: "Success", skill });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// Update skill
router.patch("/update-skill/:uuid/:skillId", async (req, res) => {
  try {
    if (!req.params.uuid || !req.params.skillId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const skill = await Skill.findOne({
      where: { uuid: req.params.skillId },
    });
    if (!skill) {
      return res.status(404).json({
        status: "Error",
        message: `Skill not found with id: ${req.params.skillId}`,
      });
    }

    const updateData = {
      skill_heading: req.body.skill_heading,
      key_skills: req.body.key_skills,
    };

    await skill.update(updateData);
    return res.status(200).json({ status: "Success", skill });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// delete skill
router.delete("/delete-skill/:uuid/:skillId", async (req, res) => {
  try {
    if (!req.params.uuid || !req.params.skillId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const skill = await Skill.findOne({
      where: { uuid: req.params.skillId, user_id: user.id },
    });
    if (!skill) {
      return res.status(404).json({
        status: "Error",
        message: `Skill not found with id: ${req.params.skillId}`,
      });
    }

    await skill.destroy();
    return res
      .status(200)
      .json({ status: "Success", message: "Skill deleted" });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// add project
router.post("/add-project/:userId", async (req, res) => {
  try {
    if (!req.params.userId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }

    const user = await User.findOne({
      where: { uuid: req.params.userId },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    // duplicate check
    const existingProject = await Project.findOne({
      where: {
        title: req.body.title.trim(),
        user_id: user.id,
      },
    });
    if (existingProject) {
      return res
        .status(400)
        .json({ status: "Error", message: "Project already exists" });
    }

    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url,
      link: req.body.link,
      user_id: user.id,
    });

    return res.status(201).json({ status: "Success", project });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// Update project
router.patch("/update-project/:uuid/:projectId", async (req, res) => {
  try {
    if (!req.params.uuid || !req.params.projectId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const project = await Project.findOne({
      where: { uuid: req.params.projectId },
    });
    if (!project) {
      return res.status(404).json({
        status: "Error",
        message: `Project not found with id: ${req.params.projectId}`,
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url,
      link: req.body.link,
    };

    await project.update(updateData);
    return res.status(200).json({ status: "Success", project });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// delete project
router.delete("/delete-project/:uuid/:projectId", async (req, res) => {
  try {
    if (!req.params.uuid || !req.params.projectId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const project = await Project.findOne({
      where: { uuid: req.params.projectId, user_id: user.id },
    });
    if (!project) {
      return res.status(404).json({
        status: "Error",
        message: `Project not found with id: ${req.params.projectId}`,
      });
    }

    await project.destroy();
    return res
      .status(200)
      .json({ status: "Success", message: "Project deleted" });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});
// add a blog
router.post("/add-blog/:userId", async (req, res) => {
  try {
    if (!req.params.userId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }

    const user = await User.findOne({
      where: { uuid: req.params.userId },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    // duplicate check
    const existingBlog = await Blog.findOne({
      where: { title: req.body.title.trim(), user_id: user.id },
    });
    if (existingBlog) {
      return res
        .status(400)
        .json({ status: "Error", message: "Blog already exists" });
    }

    const blog = await Blog.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || new Date(),
      link: req.body.link,
      user_id: user.id,
    });

    return res.status(201).json({ status: "Success", blog });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// Update blog
router.patch("/update-blog/:uuid/:blogId", async (req, res) => {
  try {
    if (!req.params.uuid || !req.params.blogId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const blog = await Blog.findOne({
      where: { uuid: req.params.blogId },
    });
    if (!blog) {
      return res.status(404).json({
        status: "Error",
        message: `Blog not found with id: ${req.params.blogId}`,
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date || new Date(),
      link: req.body.link,
    };

    await blog.update(updateData);
    return res.status(200).json({ status: "Success", blog });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

// delete blog
router.delete("/delete-blog/:uuid/:blogId", async (req, res) => {
  try {
    if (!req.params.uuid || !req.params.blogId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const blog = await Blog.findOne({
      where: { uuid: req.params.blogId, user_id: user.id },
    });
    if (!blog) {
      return res.status(404).json({
        status: "Error",
        message: `Blog not found with id: ${req.params.blogId}`,
      });
    }

    await blog.destroy();
    return res.status(200).json({ status: "Success", message: "Blog deleted" });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
});

module.exports = router;

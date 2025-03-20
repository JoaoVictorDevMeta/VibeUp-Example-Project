import prisma from "../../prisma/database.js";
import generateTokenCookie from "../utils/helpers/TokenandCookieSetup.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

const getUserProfile = async (req, res) => {
  try {
    const { query } = req.params;
    let typeSearch = {
      username: query,
    };

    if(Number(query)) {
      typeSearch = {
        id: parseInt(query),
      }
    }

    const user = await prisma.user.findUnique({
      where: typeSearch,
      include: {
        followers: true,
        following: true,
      },
    });

    if(!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { password: _, ...userInfo } = user;

    if (!userInfo) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    if (user) {
      return res.status(400).json({ error: "Usuário ja existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
      },
    });

    const { password: _, ...createdUser } = newUser;

    generateTokenCookie(createdUser.id, res);
    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    const passwordMatch = await bcrypt.compare(password, user?.password || "");

    if (!user || !passwordMatch) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const { password: _, ...userInfo } = user;

    generateTokenCookie(user.id, res);
    res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Usuário deslogado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id.toString()) {
      return res.status(400).json({ error: "Você não pode seguir você mesmo" });
    }

    const followedUser = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!followedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const followRelation = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followedUser.id,
          followingId: req.user.id,
        },
      },
    });

    if (followRelation) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: followedUser.id,
            followingId: req.user.id,
          },
        },
      });
      res.status(200).json({ message: "Deixou de seguir o usuário" });
    } else {
      await prisma.follow.create({
        data: {
          followerId: followedUser.id,
          followingId: req.user.id,
        },
      });
      res.status(200).json({ message: "Seguindo o usuário" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user.id;

    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedImage = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedImage.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: user,
    });

    const { password: _, ...userInfo } = user;
    res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSuggestedUsers = async (req, res) => {
  try{
    const userId = req.user.id;
    
    const userFollowedByYou = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });

    // Extract the IDs of the followed users
    const followedIds = userFollowedByYou.map(follow => follow.followerId);

    // Find users who are not followed by the current user
    let suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...followedIds, userId],
        },
      },
      include: {
        followers: true,
      },
    });

    //remove passwrd
    suggestedUsers = suggestedUsers.map(user => {
      const { password: _, ...userInfo } = user;
      return userInfo;
    });

    const shuffledUsers = suggestedUsers.sort(() => 0.5 - Math.random());
    const limitedSuggestions = shuffledUsers.slice(0, 4); 

    res.status(200).json(limitedSuggestions);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
};

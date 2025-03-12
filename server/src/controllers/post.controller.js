import prisma from "../../prisma/database.js";
import { v2 as cloudinary } from "cloudinary";

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        likes: true,
        replies: {
          include: {
            likes: true,
            PostedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const { id } = req.user;
    const maxLength = 500;

    if (!text && !img) {
      return res.status(400).json({ error: "Post não pode estar vazio" });
    }

    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Post não pode ter mais de ${maxLength} caracteres` });
    }

    if (img) {
      const uploadedImage = await cloudinary.uploader.upload(img);
      img = uploadedImage.secure_url;
    } else {
      img = "";
    }

    const post = await prisma.post.create({
      data: {
        text,
        img,
        PostedBy: {
          connect: {
            id,
          },
        },
      },
      include: {
        likes: true,
        replies:{
          include: {
            likes: true,
            PostedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                profilePic: true,
              },
            },
          },
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    if (post.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar este post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: "Post deletado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId),
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId: parseInt(postId),
          userId,
        },
      },
    });

    if (like) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId: parseInt(postId),
            userId,
          },
        },
      });
      res.status(200).json({ message: "Descurtiu o post" });
    } else {
      await prisma.like.create({
        data: {
          postId: parseInt(postId),
          userId,
        },
      });
      res.status(200).json({ message: "Curtiu o post" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const maxLength = 500;

    if (!text) {
      return res.status(400).json({ error: "Resposta não pode estar vazia" });
    }

    if (text.length > maxLength) {
      return res.status(400).json({
        error: `Resposta não pode ter mais de ${maxLength} caracteres`,
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId),
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    const reply = await prisma.reply.create({
      data: {
        text,
        postId: parseInt(postId),
        authorId: userId,
      },
      include: {
        likes: true,
        PostedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            profilePic: true,
          },
        },
      },
    });

    res.status(201).json(reply);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const following = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });

    const followingIds = following.map((follow) => follow.followerId);
    let feedPosts = [];

    for (const id of followingIds) {
      const posts = await prisma.post.findMany({
        where: {
          authorId: id,
        },
        include: {
          PostedBy: {
            select: {
              id: true,
              username: true,
              name: true,
              profilePic: true,
            },
          },
          likes: true,
          replies: {
            include: {
              likes: true,
              PostedBy: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  profilePic: true,
                },
              },
            },
          },
        },
      });
      feedPosts = feedPosts.concat(posts);
    }
    feedPosts.sort((a, b) => b.createdAt - a.createdAt);

    res.json(feedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        likes: true,
        replies: {
          include: {
            likes: true,
            PostedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;

    const reply = await prisma.reply.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!reply) {
      return res.status(404).json({ error: "Resposta não encontrada" });
    }

    if (reply.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar esta resposta" });
    }

    await prisma.reply.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: "Resposta deletada com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  deleteReply
};

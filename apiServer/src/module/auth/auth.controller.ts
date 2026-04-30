import { Request, Response } from "express";
import { Authservice } from "./auth.service";
import { z } from "zod";
import { prisma } from "../../db/client";

// Signup Schema
const signupSchema = z.object({
  name: z.string(),
  email: z.string().trim().toLowerCase().email("invalid email address"),
  password: z.string().min(8)
});

// Login Schema
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("invalid email address"),
  password: z.string().min(8)
});

// User Signup
const signup = async (req: Request, res: Response) => {
  try {

    const parse = signupSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json(parse.error);
    }

    const { name, email, password } = parse.data;

    const { user, token } = await Authservice.signup(name, email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.usertype
    });

  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Contributor Signup
const contributorSignup = async (req: Request, res: Response) => {
  try {
    const parse = signupSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json(parse.error);
    }

    const { name, email, password } = parse.data;

    const { user, token } = await Authservice.contributorSignup(name, email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.usertype
    });

  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// User Login
const login = async (req: Request, res: Response) => {
  try {
    const parse = loginSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json(parse.error);
    }

    const { email, password } = parse.data;

    const { user, token } = await Authservice.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.usertype
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Contributor Login
const contributor = async (req: Request, res: Response) => {
  try {
    const parse = loginSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json(parse.error);
    }

    const { email, password } = parse.data;

    const { user, token } = await Authservice.contributor(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.usertype
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// to get user details for frontend protected routes redirection
const getAuthMe = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, name, email, usertype } = user;

  return res.status(200).json({
    id,
    name,
    email,
    userType: usertype,
  });
};

// for user profile
const getme = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, name, email, usertype } = user;

  const groupedPosts = await prisma.post.groupBy({
    by: ["postType"],
    where: { userId: id },
    _count: { _all: true },
  });

  const counts = {
    events: 0,
    places: 0,
    services: 0,
  };

  for (const item of groupedPosts) {
    if (item.postType === "EVENT") counts.events = item._count._all;
    if (item.postType === "PLACE") counts.places = item._count._all;
    if (item.postType === "SERVICE") counts.services = item._count._all;
  }

  return res.status(200).json({
    id,
    name,
    email,
    userType: usertype,
    counts,
  });
};

const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token", { path: "/" });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export default {
  signup,
  login,
  contributor,
  contributorSignup,
  getme,
  getAuthMe,
  logout
};


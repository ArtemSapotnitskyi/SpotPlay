import { Request, Response } from "express";
import * as libraryService from "../services/library.service.js";

export const createFolder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!name) {
      res.status(400).json({ message: "Folder name is required" });
      return;
    }

    const newFolder = await libraryService.createFolder(userId, name);
    res.status(201).json({ message: "Folder created", folder: newFolder });
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFolder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const folderId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const isDeleted = await libraryService.deleteFolder(folderId, userId);

    if (!isDeleted) {
      res.status(404).json({ message: "Folder not found or access denied" });
      return;
    }

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Delete folder error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

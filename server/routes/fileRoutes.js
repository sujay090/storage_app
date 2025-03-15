import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import { deleteFile, fetchFile, renameFile, uploadFile } from "../controllers/files.controller.js";

const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

router.post("/:parentDirId?", uploadFile);

router.get("/:id",fetchFile);

router.patch("/:id", renameFile);

router.delete("/:id", deleteFile);

export default router;

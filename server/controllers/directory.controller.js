import { rm } from "fs/promises";
import Directory from "../models/directory.model.js";
import FileSchema from "../models/files.model.js";
export const getDirectory = async (req, res) => {
  const user = req.user;
  const _id = req.params.id || user.rootDirId.toString();
 try{
  const directoryData = await Directory.findOne({ _id }).lean();
  if (!directoryData) {
    return res
      .status(404)
      .json({ error: "Directory not found or you do not have access to it!" });
  }

  const files = await FileSchema.find({ parentDirId: directoryData._id }).lean()
  const directories = await Directory.find({ parentDirId: _id }).lean()
  return res.status(200).json({
    ...directoryData,
    files: files.map((file) => ({ ...file, id: file._id })),
    directories: directories.map((dir) => ({ ...dir, id: dir._id })),
  });
 }catch(err){
  console.log(err.message)
 }
};

export const createDirectory = async (req, res, next) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId.toString();
  const dirname = req.headers.dirname || "New Folder";
  try {
    const parentDir = await Directory.findOne({
      _id: parentDirId,
    }).lean();

    if (!parentDir)
      return res
        .status(404)
        .json({ message: "Parent Directory Does not exist!" });

    await Directory.insertOne({
      name: dirname,
      parentDirId,
      userId: user._id,
    });

    return res.status(200).json({ message: "Directory Created!" });
  } catch (err) {
    next(err);
  }
};

export const renameDirectory = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirName } = req.body;
  try {
    await Directory.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      { name: newDirName }
    );
    res.status(200).json({ message: "Directory Renamed!" });
  } catch (err) {
    next(err);
  }
};

export const deleteDirectory = async (req, res, next) => {
  const { id } = req.params;
  const directoryData = await Directory.findOne(
    {
      _id: id,
      userId: req.user._id,
    }
  ).select("_id").lean();

  if (!directoryData) {
    return res.status(404).json({ error: "Directory not found!" });
  }

  async function getDirectoryContents(id) {
    let files = await FileSchema.find({ parentDirId: id }).select("extension").lean();
    let directories = await Directory.find({ parentDirId: id }).select("_id").lean();

    for (const { _id  } of directories) {
      const { files: childFiles, directories: childDirectories } =
        await getDirectoryContents(_id);

      files = [...files, ...childFiles];
      directories = [...directories, ...childDirectories];
    }

    return { files, directories };
  }

  const { files, directories } = await getDirectoryContents(id);

  for (const { _id, extension } of files) {
    await rm(`./storage/${_id.toString()}${extension}`);
  }

  await FileSchema.deleteMany({
    _id: { $in: files.map(({ _id }) => _id) },
  });

  await Directory.deleteMany({
    _id: { $in: [...directories.map(({ _id }) => _id), id] },
  });

  return res.json({ message: "Files deleted successfully" });
};

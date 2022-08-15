const httpStatus = require('http-status');
const { randomUUID } = require('crypto');
const util = require('util');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { bucket } = require('../config/storage');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const updateProfileImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { originalname, buffer } = req.file;
    const blob = bucket.file(`${randomUUID()}_${originalname.replace(/ /g, '_')}`);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', async () => {
        const publicUrl = util.format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
        const user = await userService.updateUserById(req.params.userId, { profileImg: publicUrl });
        return res.status(200).send(user);
      })
      .on('error', (err) => {
        return res.json(`Unable to upload image, something went wrong`, err);
      })
      .end(buffer);
  } catch (err) {
    return res.json(err);
  }
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfileImage,
};

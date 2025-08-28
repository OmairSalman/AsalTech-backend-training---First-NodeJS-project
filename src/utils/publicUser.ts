import { User } from "../models/userEntity";

export function userToPublic(user: User) {
  return {
    _id: user._id,
    name: user.name,
    avatarURL: user.avatarURL,
  };
}
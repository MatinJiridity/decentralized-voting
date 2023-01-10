import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModal from "../models/user.js";
import CommitmentsModal from "../models/commitment.js";
import { addVoter } from './web3.js';

import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import ethers from 'ethers';

const secret = 'test';
const group = new Group();

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const getUserInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModal.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
}

export const commit = async (req, res) => {
  const { id } = req.params;
  const { commitment } = req.body;

  console.log(commitment)

  // if (!req.userId) {
  //   return res.json({ message: "Unauthenticated" });
  // }

  try {

    const user = await UserModal.findById(id);
    const username = user.name;
    const bool = user.hasCommit;

    console.log(username)

    if (bool) {
      return res.json({ message: "Already commited" });
    }

    await addVoter(commitment, username);

    const updatedUser = await UserModal.findByIdAndUpdate(id, { hasCommit: true }, { new: true });

    res.json({ message: updatedUser });
  } catch (err) {
    console.log('error')
    res.status(500).json({ message: err });
  }

}


export const getCommitments = async (req, res) => {

  const commitments = await CommitmentsModal.find();

  try {
    res.status(200).json({ group : commitments });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const createGroup = async (req, res) => {
  const {groupId, group} = req.body
  const commitments = await CommitmentsModal.create({ groupId});

  try {
    res.status(200).json({ group: commitments });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}





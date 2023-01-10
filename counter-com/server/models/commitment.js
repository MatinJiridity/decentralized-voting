import mongoose from "mongoose";
import { Group } from '@semaphore-protocol/group';

const commitmentsSchema = mongoose.Schema({
    groupId: { type: Number, default: 42 },
    group: { type: [String] },

});

export default mongoose.model("CommitmentsModal", commitmentsSchema);
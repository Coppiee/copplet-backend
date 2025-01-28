import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: Date },
    privacy: { type: String, enum: ['public', 'private'], default: 'private' },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model("Note", noteSchema);
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  priority: String,
  title: String,
  message: String,
  time: String,
  sender: String,
  subject: String,
}, { timestamps: true });

// ⚠️ Remove any unique index if previously created
NotificationSchema.index({ id: 1 }, { unique: false });

export default mongoose.model("Notification", NotificationSchema);

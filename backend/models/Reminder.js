import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;

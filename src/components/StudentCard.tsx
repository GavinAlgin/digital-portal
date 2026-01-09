import type { FC } from "react";
import { motion } from "framer-motion";
import moodlelogo from "../assets/cropped-flyer-02102024-133x133.png"
import type { User } from "../hooks/types";

interface StudentCardProps {
  user: User;
}

const StudentCard: FC<StudentCardProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-[340px] aspect-[1.586] rounded-xl bg-gray-200 text-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <img src={moodlelogo} alt="Institute Logo" className="w-10 h-10 object-contain" />
          <span className="font-semibold text-lg">Listec</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
        </svg>
      </div>

      {/* Middle spacer */}
      <div className="flex-1"></div>

      {/* Student Info */}
      <div className="p-4 flex flex-col space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>
        <h2 className="text-sm text-gray-700">STU NUMBER: {user.studentNumber}</h2>
        <p className="text-sm text-gray-700">FACULTY OF {user.faculty.toUpperCase()}</p>
        <p className="text-sm text-gray-600">{user.course.toUpperCase()}</p>
        {/* <p className="text-sm text-gray-600">{user.campus}</p> */}
      </div>
    </motion.div>
  );
};

export default StudentCard;

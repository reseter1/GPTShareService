import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { APP_NAME } from "../data"

const Notification = ({ message = "Hello, this is a notification from the server" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <img 
            src="https://openfxt.vercel.app/images/favicon.png" 
            alt="GPT Share Logo" 
            className="w-20 h-20 mx-auto rounded-full p-2 shadow-xl"
          />
          <h1 className="mt-2 text-2xl font-bold text-black">{APP_NAME}</h1>
        </motion.div>

        <motion.h3 className="text-2xl font-extrabold text-gray-900" variants={itemVariants}>
          Notification
        </motion.h3>

        <motion.p className="text-gray-600" variants={itemVariants}>
          {message}
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Notification

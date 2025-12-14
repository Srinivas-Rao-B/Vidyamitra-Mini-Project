import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-vidya-light-pink overflow-hidden relative">
      {/* Background shapes */}
      <motion.div
        className="absolute top-10 -left-20 w-72 h-72 bg-vidya-pink/20 rounded-full filter blur-xl"
        initial={{ y: -20, x: -10, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 0.7 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-10 -right-20 w-80 h-80 bg-vidya-blue/20 rounded-full filter blur-xl"
        initial={{ y: 20, x: 10, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 0.7 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      />

      <div className="text-center z-10 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <div className="p-5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
            <GraduationCap className="h-16 w-16 text-vidya-dark-pink" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-vidya-dark-pink tracking-tight">
            Vidyamitra
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 text-lg text-vidya-gray-700 max-w-2xl mx-auto"
          >
            "The beautiful thing about learning is that no one can take it away from you."
            <span className="block text-sm mt-1 font-medium">- B.B. King</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/login" className="mt-10 inline-block">
              <Button variant="outline" size="lg" className="bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300 ease-in-out group">
                Continue <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;

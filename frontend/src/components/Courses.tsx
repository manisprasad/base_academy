// import React from 'react';
// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// // import CourseCard from './CourseCard';
// import { coursesData } from '../data/coursesData';

// const Courses: React.FC = () => {
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   return (
//     <section id="courses" className="section bg-gray-50 rounded-lg border-2 mt-1 " >
//       <div className="container-custom">
//         <motion.div 
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
//             Our Courses
//           </span>
//           <h2 className="text-4xl font-bold mb-4 text-gray-900">
//             Featured Learning Paths
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Explore our most popular courses designed to help you master in-demand skills 
//             and advance your career in the digital economy.
//           </p>
//         </motion.div>

//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//           ref={ref}
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//         >
//           {coursesData.map((course, index) => (
//             // <CourseCard key={course.id} course={course} index={index} />
//           ))}
//         </motion.div>

//         <motion.div 
//           className="text-center mt-12"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           // viewport={{ once: true }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//         >
//           <motion.button
//             className="btn-outline"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             View All Courses
//           </motion.button>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Courses;
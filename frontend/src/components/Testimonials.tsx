// import React, { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
// import { testimonialsData } from '../data/testimonialsData';

// const Testimonials: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });
  
//   const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const goToPrev = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
//     );
//   };

//   const goToTestimonial = (index: number) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <section 
//       id="testimonials" 
//       className="section relative"
//       style={{
//         background: 'linear-gradient(180deg, #fff 0%, #f0f9ff 100%)',
//       }}
//       ref={ref}
//     >
//       <div className="container-custom">
//         <motion.div 
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 20 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//         >
//           <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
//             Testimonials
//           </span>
//           <h2 className="text-4xl font-bold mb-4 text-gray-900">
//             What Our Students Say
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Hear from our students who have transformed their careers and lives through our courses.
//           </p>
//         </motion.div>

//         <div className="relative max-w-4xl mx-auto">
//           <div className="overflow-hidden rounded-2xl">
//             <div 
//               className="flex transition-transform duration-500 ease-in-out"
//               style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//             >
//               {testimonialsData.map((testimonial, idx) => (
//                 <div 
//                   key={testimonial.id}
//                   ref={el => testimonialRefs.current[idx] = el as HTMLDivElement}
//                   className="min-w-full p-8 md:p-12"
//                 >
//                   <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 relative">
//                     <Quote className="absolute top-6 left-6 text-primary-100 w-12 h-12" />
//                     <div className="relative z-10">
//                       <p className="text-gray-700 mb-6 text-lg italic relative z-10">
//                         "{testimonial.content}"
//                       </p>
                      
//                       <div className="flex items-center">
//                         <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
//                           <img 
//                             src={testimonial.avatar} 
//                             alt={testimonial.name} 
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
//                           <p className="text-gray-600 text-sm">{testimonial.role}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Navigation controls */}
//           <div className="flex justify-between mt-10">
//             <div className="flex items-center">
//               <motion.button
//                 className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300 mr-4"
//                 onClick={goToPrev}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </motion.button>
              
//               <motion.button
//                 className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300"
//                 onClick={goToNext}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </motion.button>
//             </div>
            
//             <div className="flex gap-2">
//               {testimonialsData.map((_, idx) => (
//                 <button
//                   key={idx}
//                   className={`w-3 h-3 rounded-full transition-all ${
//                     idx === currentIndex ? 'bg-primary-600 w-6' : 'bg-gray-300'
//                   }`}
//                   onClick={() => goToTestimonial(idx)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;


const Testimonials = () =>{
  return(
    <div>Testimonal goes here</div>
  )
}

export default Testimonials;
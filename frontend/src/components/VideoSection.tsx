import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const VideoSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section 
      id="about" 
      ref={ref}
      className={cn(
        "relative py-16 md:py-24 lg:py-32",
        "bg-gradient-to-b from-background to-muted/50"
      )}
    >
      <div className={cn(
        "container-custom px-4 sm:px-6 lg:px-8",
        "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      )}>
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-sm font-medium mb-4",
            "bg-secondary/10 text-secondary-foreground"
          )}>
            About Us
          </span>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-6",
            "text-foreground"
          )}>
            Learn from the Best <br />
            <span className="text-primary">Teachers for Every Stream</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            Our expert-led tuition programs for classes 6–12 are designed to build strong academic foundations with personalized attention, structured learning, and practical exam strategies for Commerce, Science, and Arts streams.
          </p>
          
          <ul className="space-y-3 mb-8">
            {[
              'Experienced subject-wise faculty',
              'Handwritten notes and weekly test series',
              'Stream-specific mentoring (Science, Commerce, Humanities)',
              'Doubt-solving sessions and parent feedback',
              'Board exam preparation and study planning',
            ].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <svg 
                  className="w-5 h-5 text-green-500 mt-1 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-muted-foreground">{item}</span>
              </motion.li>
            ))}
          </ul>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="text-base">
              Learn More About Our Classes
            </Button>
          </motion.div>
        </motion.div>

        {/* Video Thumbnail Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="relative rounded-xl overflow-hidden">
            <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/7535022/pexels-photo-7535022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Classroom video thumbnail" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button 
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center shadow-lg",
                    "bg-background text-primary"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-8 h-8 ml-1" />
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className={cn(
              "absolute -bottom-5 -right-5 shadow-lg rounded-lg p-4 flex gap-4",
              "bg-background border"
            )}>
              <div className="text-center px-3">
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-xs text-muted-foreground">Tutors</p>
              </div>
              <div className="text-center px-3 border-l">
                <p className="text-2xl font-bold text-secondary">4.5k+</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="text-center px-3 border-l">
                <p className="text-2xl font-bold text-accent">98%</p>
                <p className="text-xs text-muted-foreground">Exam Success</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className={cn(
              "absolute -top-4 -left-4 w-20 h-20 rounded-full blur-xl",
              "bg-secondary/20"
            )}></div>
            <div className={cn(
              "absolute -bottom-6 right-20 w-16 h-16 rounded-full blur-xl",
              "bg-primary/20"
            )}></div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
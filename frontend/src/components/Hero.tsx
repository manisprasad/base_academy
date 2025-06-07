import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

const Hero: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  const containerVariants = { 
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section 
      id="home" 
      className={cn(
        "relative min-h-screen flex items-center justify-center pt-10 pb-32 overflow-hidden",
        "bg-gradient-to-br from-background to-muted/50"
      )}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={cn(
            "absolute top-20 right-10 w-64 h-64 rounded-full",
            "bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl",
            "hidden md:block" // Hide on mobile
          )}
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={cn(
            "absolute bottom-20 left-10 w-80 h-80 rounded-full",
            "bg-gradient-to-r from-accent/20 to-primary/20 blur-3xl",
            "hidden md:block" // Hide on mobile
          )}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <motion.div
            className="text-center lg:text-left w-full max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className={cn(
                "inline-block px-4 py-1.5 rounded-full text-sm font-medium",
                "bg-primary/10 text-primary"
              )}>
                Welcome to Base Academy
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="font-bold mb-6 text-4xl sm:text-5xl lg:text-6xl leading-tight"
            >
              <span className="block">Base <span className="text-primary">Academy</span></span>
              <span className="text-2xl sm:text-3xl text-muted-foreground">
                Empowering your <span className="text-green-500">Future</span>
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg sm:text-xl text-muted-foreground mb-8"
            >
              Crush classes 6-12 with lit courses! 🔥 Master Math, Science, English + level up in Commerce, Humanities, or Science streams. Your future, your flex. 💯
            </motion.p>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button asChild size="lg" className="text-lg">
                  <Link to={"/courses"}>
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={(prev) => setShow(!prev)}
                  // onClick={() => document.getElementById('contact-modal')?.classList.remove('hidden')}
                >
                  Get in Touch
                </Button>
              </motion.div>
            </motion.div>
            {
              show && <ContactModal/>
            }
            
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                  >
                    <img 
                      src={`https://images.pexels.com/photos/22${i}0453/pexels-photo-22${i}0453.jpeg?auto=compress&cs=tinysrgb&w=100`} 
                      alt="Student" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">100+</span> students already enrolled
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-md mt-12 lg:mt-0"
          >
            <div className="relative">
              <div className={cn(
                "absolute inset-0 rounded-2xl transform rotate-3",
                "bg-gradient-to-tr from-primary/20 to-secondary/20",
                "hidden lg:block" // Hide on mobile
              )}></div>
              <Card className="relative p-6 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Commerce Course" 
                  className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                  )}>
                    Top Commerce Course
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm text-muted-foreground ml-1">4.8</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">Business Accounting & Finance</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn core principles of accounting, financial statements, and business finance with real-world examples.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">$39.99</span>
                  <Button variant="link" className="p-0 h-auto">
                    View Course <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.a
          href="#courses"
          className="flex flex-col items-center text-muted-foreground hover:text-primary"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
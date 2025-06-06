'use client';

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/src/utils/motion";
import Image from "next/image";
import FeatureBox from "@/src/components/FeatureBox/FeatureBox";
import Banner from "@/src/components/Banner/Banner";

const AboutPage = () => {
  const features = [
    { id: 1, image: '/img/features/f1.png', title: 'Frontend Development' },
    { id: 2, image: '/img/features/f2.png', title: 'Backend Solutions' },
    { id: 3, image: '/img/features/f3.png', title: 'Database Design' },
    { id: 4, image: '/img/features/f4.png', title: 'Problem Solving' },
  ];

  const technologies = [
    { name: 'JavaScript/TypeScript', level: 85 },
    { name: 'React.js/Next.js', level: 80 },
    { name: 'Node.js/Express', level: 80 },
    { name: 'MongoDB/Mongoose', level: 90 },
    { name: 'PostgreSQL/Prisma', level: 65 },
    { name: 'Docker', level: 60 },
    { name: 'Redux', level: 75 },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.2)}
        className="relative h-[70vh] flex items-center justify-center bg-[#088178] text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          variants={fadeIn('up', 'spring', 0.5, 1)}
          className="text-center z-10 px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Mehedi Hasan</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Full-Stack Developer | Continuous Learner | Tech Enthusiast
          </p>
        </motion.div>
      </motion.section>

      {/* About Me Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.2)}
        className="py-20 px-10 md:px-20 lg:px-40 bg-white"
      >
        <motion.div
          variants={fadeIn('right', 'spring', 0.5, 1)}
          className="flex flex-col md:flex-row gap-10 items-center"
        >
          <div className="md:w-1/3">
            <Image
              src="/img/about/mehedi-hasan.jpg"
              alt="Mehedi Hasan"
              width={400}
              height={500}
              className="rounded-lg shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">About Me</h2>
            <p className="text-gray-600 mb-4 text-lg">
              I'm <span className="font-bold text-[#088178]">Mehedi Hasan</span>, a dedicated full-stack developer passionate about building modern web applications. Since beginning my journey in 2020, I've immersed myself in JavaScript technologies, developing a strong foundation in both frontend and backend development.
            </p>
            <p className="text-gray-600 mb-6 text-lg">
              My approach combines technical knowledge with creative problem-solving to deliver efficient, scalable solutions. I stay current with industry trends and continuously expand my skill set through hands-on projects and learning.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Email:</span>
                <a href="mailto:mmehedihasanjoyv@gmail.com" className="text-[#088178] hover:underline">mmehedihasanjoyv@gmail.com</a>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Phone:</span>
                <a href="tel:+8801601588531" className="text-[#088178] hover:underline">+880 1601 588531</a>
              </div>
            </div>
            
            <button className="bg-[#088178] text-white px-6 py-3 rounded-lg hover:bg-[#066b63] transition-colors">
              View My Projects
            </button>
          </div>
        </motion.div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.2)}
        className="py-20 px-10 md:px-20 lg:px-40 bg-gray-100"
      >
        <motion.h2
          variants={fadeIn('up', 'spring', 0.5, 1)}
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
        >
          Technical Proficiencies
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          {technologies?.map((tech) => (
            <motion.div 
              key={tech.name}
              variants={fadeIn('right', 'spring', 0.5, 1)}
              className="mb-6"
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{tech.name}</span>
                <span className="text-sm text-gray-500">{tech.level}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div 
                  className="bg-[#088178] h-2.5 rounded-full" 
                  style={{ width: `${tech.level}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Project Experience Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.2)}
        className="py-20 px-10 md:px-20 lg:px-40 bg-white"
      >
        <motion.div
          variants={fadeIn('left', 'spring', 0.5, 1)}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-gray-800">
            Development Experience
          </h2>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="border-l-4 border-[#088178] pl-6 py-2">
              <h3 className="text-xl font-bold text-gray-800">Full-Stack Development (2020 - Present)</h3>
              <p className="text-gray-600 mb-2">Personal & Learning Projects</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Built multiple full-stack applications using React, Next.js and Node.js</li>
                <li>Implemented RESTful APIs with Express.js and database integration</li>
                <li>Developed responsive UIs with modern CSS frameworks</li>
                <li>Explored containerization and deployment workflows</li>
                <li>Contributed to open-source projects and technical communities</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-[#088178] pl-6 py-2">
              <h3 className="text-xl font-bold text-gray-800">Technical Learning</h3>
              <p className="text-gray-600 mb-2">Continuous Skill Development</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Completed numerous online courses and certifications</li>
                <li>Built portfolio projects to demonstrate capabilities</li>
                <li>Studied software architecture and best practices</li>
                <li>Participated in coding challenges and hackathons</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <section className="py-20 px-10 md:px-20 lg:px-40 bg-gray-100">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
        >
          What I Can Deliver
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureBox image={feature.image} title={feature.title} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <Banner
        title="Ready to Collaborate?"
        subtitle="I'm eager to take on new challenges and grow through real-world projects."
        buttonText="Get In Touch"
      />
    </div>
  );
};

export default AboutPage;
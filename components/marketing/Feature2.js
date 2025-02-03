"use client"
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaCheck } from 'react-icons/fa'

const Feature2 = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const features = [
        {
            icon: <FaCheck className="w-6 h-6 text-purple-500" />,
            title: "Universal Compatibility",
            description: "Works seamlessly with any broker, ensuring easy data importing for all users.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <FaCheck className="w-6 h-6 text-cyan-500" />,
            title: "Effortless Uploading",
            description: "Smart automation for data import, saving you precious time and effort.",
            gradient: "from-cyan-500 to-blue-500"
        },
        {
            icon: <FaCheck className="w-6 h-6 text-cyan-500" />,
            title: "Data-Driven Insights",
            description: "Gain valuable insights with advanced data visualizations and analytics.",
            gradient: "from-blue-500 to-purple-500"
        },
        {
            icon: <FaCheck className="w-6 h-6 text-purple-500" />,
            title: "Portfolio Optimization",
            description: "Analyze and combine strategies for maximum trading performance.",
            gradient: "from-purple-500 to-cyan-500"
        }
    ];

    return (
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="py-24 overflow-hidden bg-gradient-to-b from-background to-background/95"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                    {/* Left Column - Image */}
                    <motion.div 
                        variants={itemVariants}
                        className="relative col-span-6 mb-10 lg:mb-0"
                    >
                        <div className="relative">
                            {/* Background gradient effect */}
                            <div className="absolute -inset-4">
                                <div className="w-full h-full mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                            </div>
                            
                            {/* Main image container */}
                            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                                <Image 
                                    src="/screenview1.png" 
                                    width={1024} 
                                    height={1024} 
                                    alt="Strategy Dashboard"
                                    className="w-full h-auto transform hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                
                                {/* Floating action button */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute bottom-4 right-4"
                                >
                                    <div className="bg-gray-900/90 backdrop-blur-sm px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-900 transition-colors group cursor-pointer">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 font-medium">
                                            Get Started
                                        </span>
                                        <FaArrowRight className="w-4 h-4 text-cyan-500 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Content */}
                    <div className="col-span-6 lg:pl-8">
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                Showcase Your{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                                    Trading Strategies
                                </span>
                            </h2>
                        </motion.div>

                        <motion.p 
                            variants={itemVariants}
                            className="text-lg text-gray-400 mb-12"
                        >
                            Experience seamless strategy management with our intelligent platform. Import trading reports effortlessly, visualize your strategies with advanced analytics, and optimize your portfolio for maximum success.
                        </motion.p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm rounded-xl"></div>
                                    <div className="relative p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                                        <div className="flex items-center space-x-4 mb-3">
                                            {feature.icon}
                                            <h3 className="font-semibold text-lg text-white">
                                                {feature.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default Feature2
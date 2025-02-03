"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { FaFileDownload, FaCloudUploadAlt, FaCog, FaChartBar } from 'react-icons/fa'

const Steps = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
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

    const steps = [
        {
            icon: <FaFileDownload className="w-8 h-8" />,
            title: "Download Report",
            description: "Export your trading report as a CSV file from your broker's platform.",
            gradient: "from-purple-500 to-pink-500",
            delay: 0
        },
        {
            icon: <FaCloudUploadAlt className="w-8 h-8" />,
            title: "Upload to TradeTrackr",
            description: "Simply drag and drop your CSV file in the Upload Reports section.",
            gradient: "from-cyan-500 to-blue-500",
            delay: 0.2
        },
        {
            icon: <FaCog className="w-8 h-8" />,
            title: "Create Template",
            description: "Optionally create a custom template to map data fields from your broker.",
            gradient: "from-purple-500 to-cyan-500",
            delay: 0.4
        },
        {
            icon: <FaChartBar className="w-8 h-8" />,
            title: "View Analytics",
            description: "Get instant access to beautiful visualizations of your trading performance.",
            gradient: "from-blue-500 to-purple-500",
            delay: 0.6
        }
    ];

    return (
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="py-24 relative overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] -top-40 -right-40 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute w-[500px] h-[500px] -bottom-40 -left-40 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div 
                    variants={itemVariants}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-cyan-500/10 text-cyan-500">
                        <span className="mr-2">🚀</span> Quick Setup
                    </span>
                    <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Get Started in
                        <span className="relative ml-2">
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient">
                                Four Simple Steps
                            </span>
                        </span>
                    </h2>
                    <p className="mt-6 text-lg text-gray-400">
                        TradeTrackr simplifies algorithmic trading. Follow these steps to start optimizing your trading strategies today.
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            {/* Step number */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                            </div>

                            {/* Card */}
                            <div className="relative h-full">
                                {/* Gradient border on hover */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                
                                {/* Content */}
                                <div className="relative h-full p-8 rounded-2xl bg-gray-900/90 backdrop-blur-sm border border-gray-800 group-hover:border-gray-700 transition-colors">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.gradient} p-3 mb-6`}>
                                        <div className="w-full h-full text-white">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Text content */}
                                    <h3 className="text-xl font-semibold text-white mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400">
                                        {step.description}
                                    </p>

                                    {/* Connection line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-gray-700"></div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}

export default Steps
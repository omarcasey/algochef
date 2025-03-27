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
            icon: <FaFileDownload className="w-6 h-6" />,
            title: "Download Report",
            description: "Export your trading report as a CSV file from your broker's platform.",
            gradient: "from-purple-500 to-pink-500",
            delay: 0
        },
        {
            icon: <FaCloudUploadAlt className="w-6 h-6" />,
            title: "Upload to AlgoChef",
            description: "Simply drag and drop your CSV file in the Upload Reports section.",
            gradient: "from-cyan-500 to-blue-500",
            delay: 0.2
        },
        {
            icon: <FaCog className="w-6 h-6" />,
            title: "Create Template",
            description: "Optionally create a custom template to map data fields from your broker.",
            gradient: "from-purple-500 to-cyan-500",
            delay: 0.4
        },
        {
            icon: <FaChartBar className="w-6 h-6" />,
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

            <style jsx global>{`
                .step-card {
                    position: relative;
                    border-radius: 1rem;
                    background: rgba(17, 17, 17, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    z-index: 1;
                }

                .step-card::before,
                .step-card::after {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: inherit;
                    padding: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(6, 182, 212, 0.7) 2%,
                        transparent 4%
                    );
                    -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .step-card::after {
                    background: linear-gradient(
                        90deg,
                        transparent 96%,
                        rgba(139, 92, 246, 0.7) 98%,
                        transparent 100%
                    );
                }

                .step-card:hover::before {
                    opacity: 1;
                    animation: rotate 3s linear infinite;
                }

                .step-card:hover::after {
                    opacity: 1;
                    animation: rotate 3s linear infinite reverse;
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .step-connector {
                    position: absolute;
                    top: 50%;
                    right: -30px;
                    height: 2px;
                    width: 60px;
                    background: linear-gradient(to right, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5));
                    transform: translateY(-50%);
                    z-index: 0;
                }

                .step-connector::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: -4px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: linear-gradient(to right, rgba(139, 92, 246, 1), rgba(6, 182, 212, 1));
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.6; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .step-number {
                    position: absolute;
                    top: -15px;
                    left: -15px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: linear-gradient(to right, rgba(139, 92, 246, 1), rgba(6, 182, 212, 1));
                    color: white;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
                    z-index: 2;
                }

                .step-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    background-size: 200% 200%;
                    color: white;
                    animation: gradientAnimation 4s ease infinite;
                }

                @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative"
                        >
                            {/* Step number */}
                            <div className="step-number">
                                {index + 1}
                            </div>

                            {/* Step connector */}
                            {index < steps.length - 1 && (
                                <div className="step-connector hidden lg:block"></div>
                            )}

                            {/* Card */}
                            <div className="step-card relative h-full p-6">
                                {/* Icon */}
                                <div className={`step-icon bg-gradient-to-r ${step.gradient} mb-5`}>
                                    {step.icon}
                                </div>

                                {/* Text content */}
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div variants={itemVariants} className="mt-16 text-center">
                    <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
                        Start Now
                    </button>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Steps
"use client"
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { FaBell, FaChartLine, FaRobot, FaShieldAlt, FaChartBar, FaLightbulb } from 'react-icons/fa'

const Feature = () => {
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

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const features = [
        {
            icon: <FaBell className="w-5 h-5 text-cyan-500" />,
            title: "Real-Time Signals",
            description: "Get instant notifications for trading opportunities across multiple strategies."
        },
        {
            icon: <FaChartLine className="w-5 h-5 text-purple-500" />,
            title: "Performance Analytics",
            description: "Track and analyze your trading performance with advanced metrics."
        },
        {
            icon: <FaRobot className="w-5 h-5 text-cyan-500" />,
            title: "AI-Powered Insights",
            description: "Leverage machine learning for strategy optimization and risk management."
        },
        {
            icon: <FaShieldAlt className="w-5 h-5 text-purple-500" />,
            title: "Risk Management",
            description: "Advanced risk assessment and position sizing recommendations."
        },
        {
            icon: <FaChartBar className="w-5 h-5 text-cyan-500" />,
            title: "Market Analysis",
            description: "Comprehensive market analysis tools and indicators."
        },
        {
            icon: <FaLightbulb className="w-5 h-5 text-purple-500" />,
            title: "Strategy Ideas",
            description: "Discover and explore new trading strategies from our community."
        }
    ];

    return (
        <motion.section 
            id="features"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="relative py-24 overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] -top-40 -left-40 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute w-[500px] h-[500px] -bottom-40 -right-40 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <style jsx global>{`
                .feature-card {
                    position: relative;
                    border-radius: 0.75rem;
                    background: rgba(17, 17, 17, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }

                .feature-card::before,
                .feature-card::after {
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

                .feature-card::after {
                    background: linear-gradient(
                        90deg,
                        transparent 96%,
                        rgba(139, 92, 246, 0.7) 98%,
                        transparent 100%
                    );
                }

                .feature-card:hover::before {
                    opacity: 1;
                    animation: rotate 3s linear infinite;
                }

                .feature-card:hover::after {
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
            `}</style>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                    {/* Left Column - Content */}
                    <div className="col-span-6 mb-12 lg:mb-0">
                        <motion.div variants={itemVariants}>
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-500/10 text-purple-500">
                                <span className="mr-2">✨</span> Smart Trading Signals
                            </span>
                        </motion.div>

                        <motion.h2 
                            variants={itemVariants}
                            className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold"
                        >
                            Receive Intelligent{" "}
                            <span className="relative">
                                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient">
                                    Trading Signals
                                </span>
                            </span>
                        </motion.h2>

                        <motion.p 
                            variants={itemVariants}
                            className="mt-6 text-lg text-gray-400 max-w-2xl"
                        >
                            Stay ahead of the market with our advanced signal system. Get real-time notifications, analyze performance metrics, and make data-driven decisions to optimize your trading strategies.
                        </motion.p>

                        {/* Feature Cards */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="feature-card group p-4"
                                >
                                    <div className="relative flex items-start space-x-4">
                                        <div className="p-2 rounded-lg bg-gray-800">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-400">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Images */}
                    <div className="relative col-span-6">
                        <motion.div 
                            variants={imageVariants}
                            className="relative"
                        >
                            {/* Main image stack */}
                            <div className="relative">
                                {/* First image */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="relative z-20 ml-auto w-4/5"
                                >
                                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-1 rounded-2xl shadow-2xl">
                                        <div className="bg-gray-900 rounded-2xl overflow-hidden">
                                            <Image
                                                src="/screenview2.png"
                                                width={1024}
                                                height={1024}
                                                alt="Trading Dashboard"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Second image */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="absolute top-1/4 -left-1/4 w-4/5 z-10"
                                >
                                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-1 rounded-2xl shadow-2xl">
                                        <div className="bg-gray-900 rounded-2xl overflow-hidden">
                                            <Image
                                                src="/summarypage.png"
                                                width={1024}
                                                height={1024}
                                                alt="Performance Summary"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating stats card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="absolute bottom-8 -left-8 z-30"
                                >
                                    <div className="bg-gray-900/90 backdrop-blur-sm p-4 rounded-xl border border-gray-800 shadow-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-white">Live Trading Signals</span>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                                            +28.5%
                                        </div>
                                        <div className="text-xs text-gray-400">Monthly Performance</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default Feature
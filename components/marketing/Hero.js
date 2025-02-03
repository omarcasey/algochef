"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const Hero = () => {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const statsVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative pt-20 pb-16 overflow-hidden sm:pt-24 sm:pb-20 lg:pb-24 xl:pb-28"
        >
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left Column - Content */}
                    <div className="relative z-10">
                        <motion.div variants={itemVariants} className="relative">
                            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-500 bg-cyan-500/10 rounded-full">
                                <span className="w-2 h-2 mr-2 bg-cyan-500 rounded-full animate-pulse"></span>
                                New Feature: AI-Powered Strategy Analysis
                            </span>
                        </motion.div>

                        <motion.h1 
                            variants={itemVariants}
                            className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
                        >
                            Transform Your 
                            <span className="relative whitespace-nowrap">
                                <span className="relative bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                    Trading Journey
                                </span>
                            </span>
                            with Data
                        </motion.h1>

                        <motion.p 
                            variants={itemVariants}
                            className="mt-6 text-lg text-gray-400 sm:text-xl"
                        >
                            Turn your trading data into actionable insights. Track performance, analyze strategies, and make data-driven decisions with our comprehensive trading analytics platform.
                        </motion.p>

                        <motion.div 
                            variants={itemVariants}
                            className="mt-8 space-x-4"
                        >
                            <button
                                onClick={() => router.push('/login')}
                                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Get Started Free
                                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                onClick={() => router.push('/demo')}
                                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                Watch Demo
                            </button>
                        </motion.div>

                        {/* Stats Section */}
                        <motion.div 
                            variants={itemVariants}
                            className="grid grid-cols-3 gap-6 mt-12 sm:mt-16"
                        >
                            <motion.div 
                                variants={statsVariants}
                                className="flex flex-col"
                            >
                                <dt className="text-sm font-medium text-gray-400">Active Traders</dt>
                                <dd className="text-2xl font-bold text-white">10,000+</dd>
                            </motion.div>
                            <motion.div 
                                variants={statsVariants}
                                className="flex flex-col"
                            >
                                <dt className="text-sm font-medium text-gray-400">Trades Analyzed</dt>
                                <dd className="text-2xl font-bold text-white">1M+</dd>
                            </motion.div>
                            <motion.div 
                                variants={statsVariants}
                                className="flex flex-col"
                            >
                                <dt className="text-sm font-medium text-gray-400">Success Rate</dt>
                                <dd className="text-2xl font-bold text-white">85%</dd>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column - Image/Dashboard Preview */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative lg:ml-4"
                    >
                        <div className="relative">
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                            
                            {/* Main image */}
                            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                                <Image
                                    src="/strategyplaceholder2.png"
                                    width={1240}
                                    height={701}
                                    alt="TradeTrackr Dashboard"
                                    className="w-full h-auto"
                                    priority
                                />
                                
                                {/* Floating elements */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-white">Live Trading Data</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] -top-40 -left-40 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="absolute w-[500px] h-[500px] -bottom-40 -right-40 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>
        </motion.section>
    )
}

export default Hero
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

    const backgroundDecorationVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1, 
            scale: 1,
            transition: { 
                duration: 1.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative pt-28 pb-24 overflow-hidden sm:pt-32 lg:pb-32"
        >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div 
                    variants={backgroundDecorationVariants}
                    className="absolute w-[600px] h-[600px] -top-40 -left-40 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"
                ></motion.div>
                <motion.div 
                    variants={backgroundDecorationVariants}
                    className="absolute w-[600px] h-[600px] -bottom-40 -right-40 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"
                ></motion.div>
                <motion.div 
                    variants={backgroundDecorationVariants}
                    className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
                ></motion.div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url(/grid-pattern.svg)] bg-center opacity-10"></div>
            </div>

            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
                <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left Column - Content */}
                    <div className="relative z-10">
                        <motion.div variants={itemVariants} className="relative">
                            <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/20">
                                <span className="w-2 h-2 mr-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse"></span>
                                New Feature: AI-Powered Strategy Analysis
                            </span>
                        </motion.div>

                        <motion.h1 
                            variants={itemVariants}
                            className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
                        >
                            Transform Your
                            <span className="block mt-2">
                                <span className="relative inline-block">
                                    <span className="relative bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient bg-300">
                                        Trading Journey
                                    </span>
                                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-70 rounded-full blur-sm"></span>
                                </span>
                            </span>
                        </motion.h1>

                        <motion.p 
                            variants={itemVariants}
                            className="mt-6 text-xl text-gray-300 max-w-2xl leading-relaxed"
                        >
                            Turn your trading data into actionable insights. Track performance, analyze strategies, and make data-driven decisions with our comprehensive trading analytics platform.
                        </motion.p>

                        <motion.div 
                            variants={itemVariants}
                            className="mt-10 flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                onClick={() => router.push('/login')}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <span>Get Started Free</span>
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                onClick={() => router.push('/demo')}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-gray-700 bg-gray-900/80 backdrop-blur-sm rounded-xl hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-cyan-500 group-hover:text-purple-500 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Watch Demo
                            </button>
                        </motion.div>

                        {/* Stats Section */}
                        <motion.div 
                            variants={itemVariants}
                            className="grid grid-cols-3 gap-6 mt-14"
                        >
                            <motion.div 
                                variants={statsVariants}
                                className="py-4 px-4 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <dd className=" px-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400">10,000+</dd>
                                <dt className="mt-1 text-sm font-medium text-gray-400">Uploaded Strategies</dt>
                            </motion.div>
                            <motion.div 
                                variants={statsVariants}
                                className="py-4 px-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <dd className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-400">1M+</dd>
                                <dt className="mt-1 text-sm font-medium text-gray-400">Trades Analyzed</dt>
                            </motion.div>
                            <motion.div 
                                variants={statsVariants}
                                className="py-4 px-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <dd className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">85%</dd>
                                <dt className="mt-1 text-sm font-medium text-gray-400">Success Rate</dt>
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
                            {/* Rings decoration around the image */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-70 blur-md animate-pulse-slow"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-[18px] opacity-50 blur-md"></div>
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-[20px] opacity-30 blur-md"></div>
                            
                            {/* Main image */}
                            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 border border-gray-800">
                                {/* Noise texture overlay */}
                                <div className="absolute inset-0 bg-[url(/noise.png)] mix-blend-overlay opacity-10"></div>
                                
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
                                    className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-xl rounded-lg p-3 shadow-lg border border-gray-800"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-white">Live Trading Data</span>
                                    </div>
                                </motion.div>

                                {/* Performance card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.5 }}
                                    className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-xl rounded-lg p-3 shadow-lg border border-gray-800"
                                >
                                    <span className="text-xs text-gray-400">Monthly Return</span>
                                    <div className="flex items-center mt-1">
                                        <span className="text-xl font-bold text-green-500">+23.5%</span>
                                        <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Floating gradient orbs */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 filter blur-md"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 1.7, duration: 1 }}
                            className="absolute -bottom-4 left-1/4 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 filter blur-md"
                        ></motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}

export default Hero
"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const Hero = () => {
    const router = useRouter();

    return (
        <section className="py-12 sm:pb-16 lg:pb-20 xl:pb-24">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl xl:max-w-[100rem]">
                <div className="flex">
                    <div className="w-2/5 flex flex-col pr-12 items-start">
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-sm text-gray-400 tracking-widest"
                        >
                            Get Started
                        </motion.p>
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mt-6 mb-14 text-4xl text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl text-center lg:text-left font-semibold"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 relative z-10">Visualize Data</span>
                            with AlgoChef
                        </motion.h1>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex"
                        >
                            <div className="flex flex-col">
                                <p className="text-xl text-white mb-4 mt-1 font-semibold">Streamline Your Trading Experience</p>
                                <p className="text-gray-400">Follow and Learn Proven Algo Strategies, Receive Signals & Portfolio Insights.</p>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex mt-10"
                        >
                            <div className="flex flex-col">
                                <p className="text-xl text-white mb-4 mt-1 font-semibold">Data-Driven Trading Insights</p>
                                <p className="text-gray-400">Upload Reports, Visualize Performance, Combine Strategies & Simulate Future Outcomes.</p>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="w-full mt-12 h-[2px] bg-gray-400/20"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1 }}
                            className="relative inline-flex items-center justify-center mt-8 sm:mt-12 group"
                        >
                            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                            <a onClick={() => router.push('/login')} className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full" role="button"> Sign In </a>
                        </motion.div>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="w-3/5 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-3xl p-12"
                    >
                        <Image className="h-full max-w-none rounded-xl shadow-xl contrast-125" src='/strategyplaceholder2.png' width={1240} height={701} alt="drake" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero
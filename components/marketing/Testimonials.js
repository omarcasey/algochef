"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'

const Testimonials = () => {
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

    const testimonials = [
        {
            name: "Sarah Johnson",
            title: "Day Trader",
            image: "/avatar1.png", // Placeholder - replace with actual avatar
            rating: 5,
            text: "AlgoChef completely transformed my trading workflow. The real-time signals and analytics have improved my win rate by 23% in just three months. The interface is intuitive and the strategy recommendations are spot-on."
        },
        {
            name: "Michael Chen",
            title: "Algorithmic Trader",
            image: "/avatar2.png", // Placeholder - replace with actual avatar
            rating: 5,
            text: "As someone who relies heavily on data for trading decisions, I'm impressed by the depth of analytics AlgoChef provides. The portfolio optimization tools and risk management features are particularly valuable for my strategy development."
        },
        {
            name: "Emily Rodriguez",
            title: "Swing Trader",
            image: "/avatar3.png", // Placeholder - replace with actual avatar
            rating: 4,
            text: "I've tried several trading platforms, but AlgoChef stands out for its combination of powerful features and ease of use. The backtesting capabilities have helped me refine my strategies without risking capital. Worth every penny."
        }
    ];

    return (
        <motion.section
            id="testimonials"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="relative py-24 overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] -top-40 right-0 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute w-[500px] h-[500px] -bottom-40 -left-20 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section heading */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mx-auto mb-16 max-w-2xl"
                >
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-cyan-500/10 text-cyan-500 mb-4">
                        <span className="mr-2">⭐</span> Trusted by Traders
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500">Users Say</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Join thousands of traders who have elevated their trading with AlgoChef's powerful tools and analytics.
                    </p>
                </motion.div>

                {/* Testimonial cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative"
                        >
                            <div className="relative h-full p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl">
                                <div className="absolute -top-3 -left-3">
                                    <FaQuoteLeft className="text-3xl text-cyan-500/20" />
                                </div>
                                
                                {/* Rating */}
                                <div className="flex items-center mb-6">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <FaStar key={i} className="text-yellow-500 w-4 h-4" />
                                    ))}
                                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                                        <FaStar key={i} className="text-gray-600 w-4 h-4" />
                                    ))}
                                </div>
                                
                                {/* Testimonial content */}
                                <p className="text-gray-300 mb-6 text-lg italic">"{testimonial.text}"</p>
                                
                                {/* User info */}
                                <div className="flex items-center mt-auto">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-500 p-0.5">
                                        <div className="absolute inset-0.5 bg-gray-900 rounded-full"></div>
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full w-full h-full object-cover relative z-10"
                                            
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-400">{testimonial.title}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats and social proof */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 text-center"
                >
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">10,000+</span>
                        <span className="text-gray-400 text-sm">Active Users</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">98%</span>
                        <span className="text-gray-400 text-sm">Customer Satisfaction</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">4.9/5</span>
                        <span className="text-gray-400 text-sm">Average Rating</span>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Testimonials; 
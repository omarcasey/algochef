"use client"
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'

const Pricing = () => {
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

    const plans = [
        {
            name: "Basic",
            description: "Essential tools for individual traders. Access 5 Algo Trading Strategies, real-time signals, and basic data visualization.",
            price: "$9",
            features: [
                "Access to 5 Algo Trading Strategies",
                "Real-time Buy/Sell Signals & Notifications",
                "Upload and Process: 5 Trading Reports per Month",
                "Basic Data Visualization: Equity Graphs & Drawdown Analysis",
                "Limited Portfolio Analysis (Up to 2 Strategies)"
            ],
            isPopular: false
        },
        {
            name: "Standard",
            description: "Comprehensive trading experience. 15 strategies, advanced data visualization, and portfolio analysis for up to 5 strategies.",
            price: "$19",
            features: [
                "Access to 15 Algo Trading Strategies",
                "Real-time Buy/Sell Signals & Notifications",
                "Upload and Process: 15 Trading Reports per Month",
                "Advanced Data Visualization: Equity Graphs, Drawdown Analysis & Risk Metrics",
                "Comprehensive Portfolio Analysis (Up to 5 Strategies)"
            ],
            isPopular: true
        },
        {
            name: "Premium",
            description: "Ultimate advantage for pros. Unlimited strategies, advanced data visualization, and in-depth portfolio analysis with Monte Carlo simulations.",
            price: "$29",
            features: [
                "Unlimited Access to All Algo Trading Strategies",
                "Real-time Buy/Sell Signals & Notifications",
                "Upload and Process: Unlimited Trading Reports",
                "Advanced Data Visualization with Performance Heatmaps",
                "In-Depth Portfolio Analysis with Monte Carlo Simulations"
            ],
            isPopular: false
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
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-500/10 text-purple-500">
                        <span className="mr-2">💎</span> Pricing Plans
                    </span>
                    <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Choose the Perfect
                        <span className="relative ml-2">
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient">
                                Trading Plan
                            </span>
                        </span>
                    </h2>
                    <p className="mt-6 text-lg text-gray-400">
                        Select a plan that best suits your trading needs. All plans include a 14-day free trial to test our features.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            {/* Popular badge */}
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full px-4 py-1">
                                        <span className="text-sm font-medium text-white">Most Popular</span>
                                    </div>
                                </div>
                            )}

                            {/* Card */}
                            <div className={`relative h-full ${plan.isPopular ? 'bg-gradient-to-r from-cyan-500 to-purple-500 p-[1px] rounded-2xl' : ''}`}>
                                <div className={`h-full p-8 rounded-2xl bg-gray-900 backdrop-blur-sm border ${plan.isPopular ? 'border-transparent' : 'border-gray-800'} hover:border-gray-700 transition-colors`}>
                                    {/* Header */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-gray-400 text-sm">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline mb-8">
                                        <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                                        <span className="ml-2 text-gray-400">/month</span>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start">
                                                <div className="flex-shrink-0 p-1">
                                                    <FaCheck className={`w-4 h-4 ${plan.isPopular ? 'text-cyan-400' : 'text-purple-500'}`} />
                                                </div>
                                                <span className="ml-3 text-sm text-gray-400">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <div className="mt-auto">
                                        <Link href="/signup" className="block w-full">
                                            <div className={`group relative rounded-xl ${plan.isPopular ? 'bg-white hover:bg-gray-100' : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90'} transition-all duration-200`}>
                                                <div className="relative px-6 py-3 text-center">
                                                    <span className={`text-sm font-semibold ${plan.isPopular ? 'text-gray-900' : 'text-white'}`}>
                                                        Start 14-Day Free Trial
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Money-back guarantee */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 text-center"
                >
                    <p className="text-sm text-gray-400">
                        30-day money-back guarantee. No questions asked.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Pricing
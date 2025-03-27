"use client"
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { FaCheck, FaArrowRight } from 'react-icons/fa'

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
            isPopular: false,
            gradient: "from-purple-500 to-indigo-600",
            hoverGradient: "from-purple-600 to-indigo-700",
            accentColor: "purple"
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
            isPopular: true,
            gradient: "from-cyan-500 to-blue-600",
            hoverGradient: "from-cyan-600 to-blue-700",
            accentColor: "cyan"
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
            isPopular: false,
            gradient: "from-fuchsia-500 to-purple-600",
            hoverGradient: "from-fuchsia-600 to-purple-700",
            accentColor: "fuchsia"
        }
    ];

    return (
        <motion.section 
            id="pricing"
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
                .pricing-card {
                    position: relative;
                    border-radius: 1.5rem;
                    background: rgba(17, 17, 17, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    transform: translateY(0);
                }
                
                .pricing-card:hover {
                    transform: translateY(-10px);
                }

                .card-popular {
                    background: rgba(17, 17, 17, 0.9);
                    box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);
                }

                .popular-badge {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(to right, #06b6d4, #3b82f6);
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                    padding: 0.5rem 1.5rem;
                    border-radius: 9999px;
                    box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.3);
                    z-index: 10;
                    transition: all 0.3s ease;
                }

                .card-wrapper {
                    position: relative;
                }

                .card-wrapper:hover .popular-badge {
                    transform: translateX(-50%) translateY(-10px);
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                .feature-check {
                    margin-right: 0.75rem;
                    color: currentColor;
                    flex-shrink: 0;
                }

                .purple-check {
                    color: rgba(139, 92, 246, 1);
                }

                .cyan-check {
                    color: rgba(6, 182, 212, 1);
                }

                .fuchsia-check {
                    color: rgba(192, 38, 211, 1);
                }

                .price-value {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                }

                .price-period {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .cta-button {
                    display: inline-block;
                    width: 100%;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .cta-button span {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cta-button svg {
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                    margin-left: 0.5rem;
                }

                .cta-button:hover svg {
                    opacity: 1;
                    transform: translateX(0);
                }
            `}</style>

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative card-wrapper"
                        >
                            {/* Popular badge */}
                            {plan.isPopular && (
                                <div className="popular-badge">
                                    Most Popular
                                </div>
                            )}

                            {/* Card */}
                            <div className={`pricing-card ${plan.isPopular ? 'card-popular' : ''} p-8 h-full flex flex-col`}>
                                {/* Plan Name & Description */}
                                <div className="mb-6">
                                    <div className={`text-${plan.accentColor}-500 text-sm font-semibold uppercase tracking-wide mb-2`}>
                                        {plan.name}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {plan.name === "Basic" ? "Get Started" : plan.name === "Standard" ? "Grow Faster" : "Go Professional"}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className={`price-value text-transparent bg-clip-text bg-gradient-to-r ${plan.gradient}`}>
                                        {plan.price}
                                    </div>
                                    <div className="price-period">per month</div>
                                </div>

                                {/* Features */}
                                <div className="mb-8 flex-grow">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="feature-item">
                                                <FaCheck className={`feature-check ${plan.accentColor}-check w-4 h-4`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <div className="mt-auto">
                                    <Link href="/signup" className="block">
                                        <div className={`cta-button bg-gradient-to-r ${plan.gradient} hover:bg-gradient-to-r hover:${plan.hoverGradient}`}>
                                            <span className="text-white">
                                                Start 14-Day Free Trial
                                                <FaArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </Link>
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
                    <div className="inline-flex items-center px-6 py-3 rounded-full border border-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-400">
                            30-day money-back guarantee. No questions asked.
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default Pricing
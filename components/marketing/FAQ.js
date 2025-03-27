"use client"
import { useState } from "react";
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

// Custom Accordion Component
const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-800 last:border-b-0">
            <button
                className="flex justify-between items-center w-full py-4 px-5 text-left focus:outline-none"
                onClick={onClick}
            >
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <FaChevronDown 
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
                />
            </button>
            <div 
                className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-5 pb-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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

    // FAQ data
    const faqItems = [
        {
            title: "What is AlgoChef?",
            content: "AlgoChef is an innovative web application designed for traders to streamline their trading experience. It allows users to access and subscribe to proven algorithmic trading strategies, receive real-time buy/sell signals, and gain valuable insights into their portfolios' performance."
        },
        {
            title: "How do I subscribe to trading strategies on AlgoChef?",
            content: "Subscribing to trading strategies on AlgoChef is simple. After registering and logging in, visit the \"Strategies\" section to explore a variety of trading strategies. Click on your preferred strategy to view more details and click the \"Subscribe\" button to start receiving signals and notifications."
        },
        {
            title: "Can I upload my trading reports to AlgoChef?",
            content: "Yes! AlgoChef enables you to upload your trading reports in CSV format. Simply go to the \"Upload Reports\" section, follow the instructions to upload your data, and AlgoChef will process it to provide you with comprehensive visualizations and analysis."
        },
        {
            title: "What kind of visualizations can I expect for my trading data?",
            content: "AlgoChef offers a range of data visualizations, including equity graphs, drawdown graphs, and other performance metrics. These interactive charts allow you to gain deeper insights into your trading strategies and portfolio performance over time."
        },
        {
            title: "Can I combine multiple strategies into a portfolio?",
            content: "Absolutely! AlgoChef allows you to create and analyze portfolios consisting of multiple trading strategies. The platform calculates the combined performance of the portfolio, helping you assess the potential synergy of your chosen strategies."
        },
        {
            title: "What is Monte Carlo analysis, and how does AlgoChef use it?",
            content: "Monte Carlo analysis is a simulation technique that generates multiple possible outcomes based on historical data. AlgoChef leverages this method to provide users with insights into future portfolio performance under various market scenarios, assisting in risk assessment and decision-making."
        },
        {
            title: "What markets and assets are supported on AlgoChef?",
            content: "AlgoChef supports a wide range of markets and assets, including stocks, forex, cryptocurrencies, and more. The available trading strategies cover various markets to cater to different trading preferences."
        },
        {
            title: "Is AlgoChef suitable for beginners and experienced traders alike?",
            content: "Yes, AlgoChef caters to traders of all levels of expertise. For beginners, the platform offers educational resources to understand trading strategies better. Experienced traders can benefit from data-driven insights and advanced portfolio analysis tools."
        }
    ];

    return (
        <motion.section 
            id="faq" 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className='relative py-24 overflow-hidden'
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] -top-40 -left-40 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute w-[500px] h-[500px] -bottom-40 -right-40 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    variants={itemVariants} 
                    className='flex flex-col justify-center items-center mb-16 text-center'
                >
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-500/10 text-purple-500 mb-4">
                        <span className="mr-2">🤔</span> Questions & Answers
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500">Questions</span>
                    </h2>
                    <p className='mt-4 text-lg text-gray-400 max-w-2xl'>
                        Find answers to common questions about AlgoChef. If you need further assistance, our support team is always ready to help.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                        {faqItems.map((item, index) => (
                            <AccordionItem
                                key={index}
                                title={item.title}
                                isOpen={openIndex === index}
                                onClick={() => handleToggle(index)}
                            >
                                <p className="text-gray-300">{item.content}</p>
                            </AccordionItem>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-400 mb-6">Still have questions?</p>
                    <a href="/contact" className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 transition-all duration-300">
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default FAQ
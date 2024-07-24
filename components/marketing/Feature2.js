import Image from 'next/image'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'

const Feature2 = () => {
    return (
        <section className='py-12 sm:pb-16 lg:pb-20 xl:pb-24 text-foreground'>
            <div className='max-w-7xl xl:max-w-[90rem] mx-auto'>
                <div className='flex'>
                    <div className='w-1/3 h-auto m-5 mr-20 relative border border-gray-700'>
                        <Image src='/screenview1.png' width={1024} height={1024} className='w-full h-full' />
                        <div className='absolute bottom-0 right-0 z-20'>
                            <div className='bg-black px-4 py-2 flex items-center justify-center'>
                                <p className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500'>Get Started </p>
                                <FaArrowRight className='ml-3 w-4 h-4 fill-cyan-500' />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-2/3'>
                        <h1 className='text-5xl font-bold mb-5'>Showcase Your Strategies</h1>
                        <p className='text-lg tracking-wide'><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 relative z-10">Designed by Traders.</span> For Traders.</p>
                        <p className='text-gray-400 pr-24 mt-7 tracking-wide mb-10'>Experience seamless strategy management with TradeTrackr! Our platform offers intelligent uploading, allowing you to import trading reports from any broker effortlessly. Visualize your strategies with advanced data analytics and optimize your portfolio for success.</p>
                        <div className='w-full h-[1px] bg-gray-700 mb-10'></div>
                        <div className='flex flex-wrap text-sm'>
                            <div className='flex w-1/2 p-5 items-center justify-center'>
                                <FaCheck className='w-10 h-10 fill-purple-500 mr-4' />
                                <p className='text-foreground'>Universal Compatibility: TradeTrackr works with any broker, ensuring easy data importing for all users.</p>
                            </div>
                            <div className='flex w-1/2 p-5 items-center justify-center'>
                                <FaCheck className='w-10 h-10 fill-cyan-500 mr-4' />
                                <p>Effortless Uploading: Our smart method automates data import, saving you time and effort.</p>
                            </div>
                            <div className='flex w-1/2 p-5 items-center justify-center'>
                                <FaCheck className='w-10 h-10 fill-cyan-500 mr-4' />
                                <p>Data-Driven Insights: Gain valuable insights with advanced data visualizations.</p>
                            </div>
                            <div className='flex w-1/2 p-5 items-center justify-center'>
                                <FaCheck className='w-10 h-10 fill-purple-500 mr-4' />
                                <p>Optimize Your Portfolio: Analyze and combine strategies for peak performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Feature2
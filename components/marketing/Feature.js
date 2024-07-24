import Image from 'next/image'
import React from 'react'

const Feature = () => {
    return (
        <section className='py-12 sm:pb-16 lg:pb-20 xl:pb-24 text-foreground'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center justify-center'>
                    <div className='flex flex-col w-1/2'>
                        <h1 className='mb-7 text-5xl font-bold'>Receive Trading Signals</h1>
                        <p><span className="tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 relative z-10 text-lg">Discover the power of TradeTrackr&apos;s seamless strategy management.</span></p>
                        <p className='text-gray-400 pr-24 mt-7 tracking-wide'>Experience the convenience of receiving real-time trading signals and stay informed with monthly notifications for a diverse selection of available strategies. Leverage advanced data analytics to visualize and optimize your portfolio, ensuring a path to trading success.</p>
                    </div>
                    <div className='flex flex-col w-1/2 relative'>
                        <div className="absolute top-0 left-0 w-full h-full z-50">
                            <div className='w-80 h-80 bg-gray-900 rounded-lg shadow-xl ml-16 mt-5 relative'>
                                <Image src='/screenview2.png' width={1024} height={1024} className='rounded-lg' />
                                <div className="absolute top-0 left-0 w-full h-full z-50">
                                    <div className='w-80 h-80 ml-32 mt-24 bg-gradient-to-br from-cyan-500 to-purple-500 p-[2px] rounded-lg'>
                                        <div className='w-full h-full rounded-lg bg-gray-900'>
                                            <Image src='/summarypage.png' width={1024} height={1024} className='rounded-lg' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-1/3'></div>
                            <div className='bg-cyan-500 w-1/3 blur-3xl h-48'></div>
                        </div>
                        <div className='flex'>
                            <div className='bg-purple-500 w-1/3 blur-3xl h-48'></div>
                            <div className='w-2/3'></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Feature
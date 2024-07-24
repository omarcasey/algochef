import React from 'react'
import { MdPeopleOutline } from 'react-icons/md'

const Steps = () => {
    return (
        <section className='py-12 sm:pb-16 lg:pb-20 xl:pb-24'>
            <div className='max-w-[90rem] mx-auto'>
                <div className='flex flex-col items-center justify-center max-w-3xl mx-auto'>
                    <h1 className='mb-20'>How We work</h1>
                    {/* <p className='text-gray-400 text-lg mb-20 text-center'>TradeTrackr simplifies algorithmic trading. Effortlessly integrate data from any broker, receive real-time signals, and stay updated on monthly strategies. With advanced analytics, make informed decisions for trading success. Embrace the future of trading with TradeTrackr!</p> */}
                </div>
                <div className='flex space-x-5 justify-center'>
                    <div className='bg-gray-900 w-80 h-80 rounded-lg flex flex-col justify-between p-6 px-8'>
                        <MdPeopleOutline className='w-10 h-10 fill-purple-500' />
                        <p className='text-gray-400 text-lg'>Download your trading report as a CSV file from your broker&apos;s platform.</p>
                    </div>
                    <div className='bg-gray-900 w-80 h-80 rounded-lg flex flex-col justify-between p-6 px-8 mt-10'>
                        <MdPeopleOutline className='w-10 h-10 fill-cyan-500'/>
                        <p className='text-gray-400 text-lg'>Upload the CSV file to TradeTrackr through the &quot;Upload Reports&quot; section.</p>
                    </div>
                    <div className='bg-gray-900 w-80 h-80 rounded-lg flex flex-col justify-between p-6 px-8'>
                        <MdPeopleOutline className='w-10 h-10 fill-purple-500'/>
                        <p className='text-gray-400 text-lg'>Optionally, help TradeTrackr learn to process files from your broker effortlessly by creating a custom template to map data fields.</p>
                    </div>
                    <div className='bg-gray-900 w-80 h-80 rounded-lg flex flex-col justify-between p-6 px-8 mt-16'>
                        <MdPeopleOutline className='w-10 h-10 fill-cyan-500'/>
                        <p className='text-gray-400 text-lg'>Sit back and relax as TradeTrackr processes your data and generates beautiful charts and visualizations showcasing your trading performance and strategies.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Steps
import Image from "next/image"


const Testimonial = () => {
    return (
        <section className="py-12 sm:pb-16 lg:pb-20 xl:pb-24">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl xl:max-w-[100rem]">
                <div className="flex flex-col items-center">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 uppercase text-xl mb-4">2K+ Happy Customers</p>
                    <h1 className="text-center text-4xl font-light text-white sm:text-5xl xl:w-[48rem] mb-12">
                        Users love TradeTrackr
                    </h1>
                    <div className="mb-12">
                        <div className="flex gap-x-6 mb-6 mr-12">
                            <div className="flex bg-[#18181b] rounded-[3.5rem] p-6 items-center">
                                <Image className="h-16 w-16 rounded-full mr-4" src='/new logo transparent.png' width={1024} height={1024} />
                                <p className="text-white italic">&quot;TradeTrackr has transformed my trading game. The real-time signals and portfolio analysis help me stay on top of my strategies. It&apos;s an indispensable tool for any trader.&quot;</p>
                            </div>
                            <div className="flex bg-[#18181b] rounded-[3.5rem] p-6 items-center">
                                <Image className="h-16 w-16 rounded-full mr-4" src='/new logo transparent.png' width={1024} height={1024} />
                                <p className="text-white italic">&quot;As an investor, TradeTrackr&apos;s Premium Plan is a game-changer. The unlimited strategies and data visualizations provide deep insights into my portfolio&apos;s performance.&quot;</p>
                            </div>
                            <div className="flex bg-[#18181b] rounded-[3.5rem] p-6 items-center">
                                <Image className="h-16 w-16 rounded-full mr-4" src='/new logo transparent.png' width={1024} height={1024} />
                                <p className="text-white italic">&quot;I subscribed to TradeTrackr&apos;s Basic Plan to follow crypto trading strategies. It&apos;s simple to use, and the signals have significantly improved my trading decisions.&quot;</p>
                            </div>
                        </div>
                        <div className="flex gap-x-6 mb-4 ml-12">
                            <div className="flex bg-[#18181b] rounded-[3.5rem] p-6 items-center">
                                <Image className="h-16 w-16 rounded-full mr-4" src='/new logo transparent.png' width={1024} height={1024} />
                                <p className="text-white italic">&quot;TradeTrackr&apos;s Standard Plan has exceeded my expectations. The advanced data visualization helps me analyze my forex trades like never before.&quot;</p>
                            </div>
                            <div className="flex bg-[#18181b] rounded-[3.5rem] p-6 items-center">
                                <Image className="h-16 w-16 rounded-full mr-4" src='/new logo transparent.png' width={1024} height={1024} />
                                <p className="text-white italic">&quot;Thanks to TradeTrackr, I can now effortlessly combine options trading strategies to optimize my portfolio. Highly recommended for options traders!&quot;</p>
                            </div>
                            <div className="flex bg-[#18181b] rounded-[3.5rem] p-6 items-center">
                                <Image className="h-16 w-16 rounded-full mr-4" src='/new logo transparent.png' width={1024} height={1024} />
                                <p className="text-white italic">&quot;TradeTrackr&apos;s Basic Plan is perfect for me. It gives me access to multiple stock trading strategies, and the visualizations are easy to understand.&quot;</p>
                            </div>
                        </div>
                    </div>
                    <div className="gradient-underline">
                        <p className="text-white text-xl">Read All Reviews</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonial
"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

const Hero = () => {
    const router = useRouter();

    return (
        <section className="py-12 sm:pb-16 lg:pb-20 xl:pb-24">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl xl:max-w-[100rem]">
                <div className="flex">
                    <div className="w-2/5 flex flex-col pr-12 items-start">
                        <p className="text-sm text-gray-400 tracking-widest">
                            Get Started
                        </p>
                        <h1 className="mt-6 mb-14 text-4xl text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl text-center lg:text-left font-semibold">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 relative z-10">Visualize Data</span>
                            with TradeTrackr
                        </h1>
                        <div className="flex">
                            {/* <Image className="h-12 w-12 mr-4 bg-[#18181b] rounded-full p-2" src='/new logo transparent.png' width={1024} height={1024} alt="rando" /> */}
                            <div className="flex flex-col">
                                <p className="text-xl text-white mb-4 mt-1 font-semibold">Streamline Your Trading Experience</p>
                                <p className="text-gray-400">Follow and Learn Proven Algo Strategies, Receive Signals & Portfolio Insights.</p>
                            </div>
                        </div>
                        <div className="flex mt-10">
                            {/* <Image className="h-12 w-12 mr-4 bg-[#18181b] rounded-full p-2" src='/new logo transparent.png' width={1024} height={1024} alt="rando" /> */}
                            <div className="flex flex-col">
                                <p className="text-xl text-white mb-4 mt-1 font-semibold">Data-Driven Trading Insights</p>
                                <p className="text-gray-400">Upload Reports, Visualize Performance, Combine Strategies & Simulate Future Outcomes.</p>
                            </div>
                        </div>
                        <div className="w-full mt-12 h-[2px] bg-gray-400/20"></div>
                        <div className="relative inline-flex items-center justify-center mt-8 sm:mt-12 group">
                            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                            <a onClick={() => router.push('/login')} className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full" role="button"> Sign In </a>
                        </div>
                    </div>
                    <div className="w-3/5 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-3xl p-12">
                        <Image className="h-full max-w-none rounded-xl shadow-xl contrast-125" src='/strategyplaceholder2.png' width={1240} height={701} alt="drake" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
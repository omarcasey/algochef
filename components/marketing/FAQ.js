"use client"
import { Collapse } from '@nextui-org/react';

const FAQ = () => {
    return (
        <section className='py-12 sm:pb-16 lg:pb-20 xl:pb-24'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col justify-center items-center'>
                    <h1>Frequently Asked Questions</h1>
                    <p className='text-gray-400 text-lg mb-10'>FAQ: Answers to Common Questions. Reach out for personalized support.</p>
                </div>
                <Collapse.Group>
                    <Collapse title="What is TradeTrackr?">
                        <p>
                            TradeTrackr is an innovative web application designed for traders to streamline their trading experience. It allows users to access and subscribe to proven algorithmic trading strategies, receive real-time buy/sell signals, and gain valuable insights into their portfolios&apos; performance.
                        </p>
                    </Collapse>
                    <Collapse title="How do I subscribe to trading strategies on TradeTrackr?">
                        <p>
                            Subscribing to trading strategies on TradeTrackr is simple. After registering and logging in, visit the &quot;Strategies&quot; section to explore a variety of trading strategies. Click on your preferred strategy to view more details and click the &quot;Subscribe&quot; button to start receiving signals and notifications.
                        </p>
                    </Collapse>
                    <Collapse title="Can I upload my trading reports to TradeTrackr?">
                        <p>
                            Yes! TradeTrackr enables you to upload your trading reports in CSV format. Simply go to the &quot;Upload Reports&quot; section, follow the instructions to upload your data, and TradeTrackr will process it to provide you with comprehensive visualizations and analysis.
                        </p>
                    </Collapse>
                    <Collapse title="What kind of visualizations can I expect for my trading data?">
                        <p>
                            TradeTrackr offers a range of data visualizations, including equity graphs, drawdown graphs, and other performance metrics. These interactive charts allow you to gain deeper insights into your trading strategies and portfolio performance over time.
                        </p>
                    </Collapse>
                    <Collapse title="Can I combine multiple strategies into a portfolio?">
                        <p>
                            Absolutely! TradeTrackr allows you to create and analyze portfolios consisting of multiple trading strategies. The platform calculates the combined performance of the portfolio, helping you assess the potential synergy of your chosen strategies.
                        </p>
                    </Collapse>
                    <Collapse title="What is Monte Carlo analysis, and how does TradeTrackr use it?">
                        <p>
                            Monte Carlo analysis is a simulation technique that generates multiple possible outcomes based on historical data. TradeTrackr leverages this method to provide users with insights into future portfolio performance under various market scenarios, assisting in risk assessment and decision-making.
                        </p>
                    </Collapse>
                    <Collapse title="What markets and assets are supported on TradeTrackr?">
                        <p>
                            TradeTrackr supports a wide range of markets and assets, including stocks, forex, cryptocurrencies, and more. The available trading strategies cover various markets to cater to different trading preferences.
                        </p>
                    </Collapse>
                    <Collapse title="Is TradeTrackr suitable for beginners and experienced traders alike?">
                        <p>
                            Yes, TradeTrackr caters to traders of all levels of expertise. For beginners, the platform offers educational resources to understand trading strategies better. Experienced traders can benefit from data-driven insights and advanced portfolio analysis tools.
                        </p>
                    </Collapse>
                </Collapse.Group>
            </div>
        </section>
    )
}

export default FAQ
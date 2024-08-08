
const PerformanceSummaryReport = ({ data }) => {
    const strategy = data;

    const formatValue = (key, value) => {
        if (typeof value === 'number') {
            if (['Total Net Profit', 'Gross Profit', 'Gross Loss', 'Avg. Trade Net Profit', 'Avg. Winning Trade', 'Avg. Losing Trade', 'Largest Win', 'Largest Loss', 'Max Runup $',
                'Max Drawdown $', 'Initial Capital', 'Avg. Monthly Return', 'Std. Deviation of Monthly Return', 'Max Runup'].includes(key)) {
                const absValue = Math.abs(value);
                const formattedValue = absValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

                if (value < 0) {
                    return <span className='text-red-500'>({formattedValue})</span>;
                } else if (value > 0) {
                    return <span className='text-green-500'>{formattedValue}</span>;
                } else {
                    return <span className='text-white'>{formattedValue}</span>;
                }
            }
            if (['% Profitable', 'Max Drawdown %', 'Return on Initial Capital', 'Annual Rate of Return', '% Profitable Months'].includes(key)) {
                return `${value.toFixed(2)}%`
            }
            if (['Profit Factor', 'Ratio Avg Win:Avg Loss', 'Sharpe Ratio', 'Efficiency Factor', 'Recovery Factor', 'NP/MaxDD'].includes(key)) {
                return `${value.toFixed(3)}`
            }
        }
        return value;
    }


    if (!strategy) {
        return <div></div>;
    }

    return (
        <div className='flex flex-col space-y-4 items-center py-10'>
            {/* <h1 className='text-4xl font-bold pb-4 tracking-wider'>Performance Summary</h1>
            <h1 className='text-3xl pb-16'>{strategy.name}</h1> */}
            <div className='w-2/3 flex'>
                <div className='space-y-1 w-1/2 items-center'>
                    <div className='flex'>
                        <p className='w-1/2'>Total Net Profit: </p>
                        <p className='w-1/2'>{formatValue('Total Net Profit', strategy.metrics['Total Net Profit'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Gross Profit: </p>
                        <p className='w-1/2'>{formatValue('Gross Profit', strategy.metrics['Gross Profit'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Gross Loss: </p>
                        <p className='w-1/2'>{formatValue('Gross Loss', strategy.metrics['Gross Loss'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Profit Factor: </p>
                        <p className='w-1/2'>{formatValue('Profit Factor', strategy.metrics['Profit Factor'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Total Trades: </p>
                        <p className='w-1/2'>{formatValue('Total Trades', strategy.metrics['Total Trades'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Winning Trades: </p>
                        <p className='w-1/2'>{formatValue('Winning Trades', strategy.metrics['Winning Trades'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Losing Trades: </p>
                        <p className='w-1/2'>{formatValue('Losing Trades', strategy.metrics['Losing Trades'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Even Trades: </p>
                        <p className='w-1/2'>{formatValue('Even Trades', strategy.metrics['Even Trades'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>% Profitable: </p>
                        <p className='w-1/2'>{formatValue('% Profitable', strategy.metrics['% Profitable'])}</p>
                    </div>
                    <div className='flex pt-10'>
                        <p className='w-1/2'>Avg. Trade Net Profit: </p>
                        <p className='w-1/2'>{formatValue('Avg. Trade Net Profit', strategy.metrics['Avg. Trade Net Profit'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Avg. Winning Trade: </p>
                        <p className='w-1/2'>{formatValue('Avg. Winning Trade', strategy.metrics['Avg. Winning Trade'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Avg. Losing Trade: </p>
                        <p className='w-1/2'>{formatValue('Avg. Losing Trade', strategy.metrics['Avg. Losing Trade'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Ratio Avg Win:Avg Loss: </p>
                        <p className='w-1/2'>{formatValue('Ratio Avg Win:Avg Loss', strategy.metrics['Ratio Avg Win:Avg Loss'])}</p>
                    </div>
                    <div className='flex pt-10'>
                        <p className='w-1/2'>Largest Win: </p>
                        <p className='w-1/2'>{formatValue('Largest Win', strategy.metrics['Largest Win'])}</p>
                    </div>
                    <div className='flex'>
                        <p className=' w-1/2'>Largest Loss: </p>
                        <p className='w-1/2'>{formatValue('Largest Loss', strategy.metrics['Largest Loss'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Max Consecutive Wins: </p>
                        <p className='w-1/2'>{formatValue('Max Consecutive Wins', strategy.metrics['Max Consecutive Wins'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Max Consecutive Losses: </p>
                        <p className='w-1/2'>{formatValue('Max Consecutive Losses', strategy.metrics['Max Consecutive Losses'])}</p>
                    </div>
                    <div className='flex pt-10'>
                        <p className='w-1/2'>Trading Period: </p>
                        <p className='w-1/2'>{formatValue('Trading Period', strategy.metrics['Trading Period'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Total Trading Days: </p>
                        <p className='w-1/2'>{formatValue('Total Trading Days', strategy.metrics['Total Trading Days'])}</p>
                    </div>
                    <div className='flex'>
                        <p className=' w-1/2'>Longest Flat Period: </p>
                        <p className='w-1/2'>{formatValue('Longest Flat Period', strategy.metrics['Longest Flat Period'])}</p>
                    </div>
                    <div className='flex pt-10'>
                        <p className=' w-1/2'>Max Futures Contracts: </p>
                        <p className='w-1/2'>{formatValue('Max Futures Contracts', strategy.metrics['Max Futures Contracts'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Max Forex Contracts: </p>
                        <p className='w-1/2'>{formatValue('Max Forex Contracts', strategy.metrics['Max Forex Contracts'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Max Shares: </p>
                        <p className='w-1/2'>{formatValue('Max Shares', strategy.metrics['Max Shares'])}</p>
                    </div>
                </div>
                <div className='space-y-1 w-1/2 items-center'>
                    <div className='flex'>
                        <p className='w-1/2'>Max Drawdown: </p>
                        <p className='w-1/2'>{formatValue('Max Drawdown $', strategy.metrics['Max Drawdown $'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>As % of Initial Equity: </p>
                        <p className='w-1/2'>{formatValue('Total Net Profit', strategy.metrics['Total Net Profi'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>As % of Total Equity: </p>
                        <p className='w-1/2'>{formatValue('Max Drawdo', strategy.metrics['Max Drawwn %'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Max Drawdown Date: </p>
                        <p className='w-1/2'>{formatValue('Total Net Profit', strategy.metrics['Total Net Proit'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Longest Drawdown: </p>
                        <p className='w-1/2'>{formatValue('Longest Drawdown', strategy.metrics['Longest Drawdown'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Recovery Factor: </p>
                        <p className='w-1/2'>{formatValue('Recovery Factor', strategy.metrics['Recovery Factor'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>NP/MaxDD: </p>
                        <p className='w-1/2'>{formatValue('Recovery Factor', strategy.metrics['Recovery Factor'])}</p>
                    </div>
                    <div className='flex pt-10'>
                        <p className='w-1/2'>Max Runup: </p>
                        <p className='w-1/2'>{formatValue('Max Runup', strategy.metrics['Max Runup'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>As % of Initial Equity: </p>
                        <p className='w-1/2'>{formatValue('Total Net Profit', strategy.metrics['Total Net Prfit'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>As % of Total Equity: </p>
                        <p className='w-1/2'>{formatValue('Total Net Profit', strategy.metrics['Total Net Prfit'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Max Runup Date: </p>
                        <p className='w-1/2'>{formatValue('Total Net Profit', strategy.metrics['Total Net Prfit'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Longest Runup: </p>
                        <p className='w-1/2'>{formatValue('Longest Runup', strategy.metrics['Longest Runup'])}</p>
                    </div>
                    <div className='flex pt-10'>
                        <p className='w-1/2'>Initial Capital: </p>
                        <p className='w-1/2'>{formatValue('Initial Capital', strategy.metrics['Initial Capital'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Margin Requirements: </p>
                        <p className='w-1/2'>{formatValue('Initial Ctial', strategy.metrics['Initial Ctial'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Return on Initial Capital: </p>
                        <p className='w-1/2'>{formatValue('Return on Initial Capital', strategy.metrics['Return on Initial Capital'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Annual Rate of Return: </p>
                        <p className='w-1/2'>{formatValue('Annual Rate of Return', strategy.metrics['Annual Rate of Return'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Avg. Monthly Return: </p>
                        <p className='w-1/2'>{formatValue('Avg. Monthly Return', strategy.metrics['Avg. Monthly Return'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Std. Deviation of Monthly Return: </p>
                        <p className='w-1/2'>{formatValue('Std. Deviation of Monthly Return', strategy.metrics['Std. Deviation of Monthly Return'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>% Profitable Months: </p>
                        <p className='w-1/2'>{formatValue('% Profitable Months', strategy.metrics['% Profitable Months'])}</p>
                    </div>
                    <div className='flex pt-10'>
                        <p className='w-1/2'>Sharpe Ratio: </p>
                        <p className='w-1/2'>{formatValue('Sharpe Ratio', strategy.metrics['Sharpe Ratio'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Sortino Ratio: </p>
                        <p className='w-1/2'>{formatValue('Sortino Ratio', strategy.metrics['Sortino Ratio'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Sterling Ratio: </p>
                        <p className='w-1/2'>{formatValue('Sterling Ratio', strategy.metrics['Sterling Ratio'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>MAR Ratio: </p>
                        <p className='w-1/2'>{formatValue('MAR Ratio', strategy.metrics['MAR Ratio'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Efficiency Factor: </p>
                        <p className='w-1/2'>{formatValue('Efficiency Factor', strategy.metrics['Efficiency Factor'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Total Commission: </p>
                        <p className='w-1/2'>{formatValue('Total Commission', strategy.metrics['Total Commission'])}</p>
                    </div>
                    <div className='flex'>
                        <p className='w-1/2'>Total Slippage: </p>
                        <p className='w-1/2'>{formatValue('Total Slippage', strategy.metrics['Total Slippage'])}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PerformanceSummaryReport;
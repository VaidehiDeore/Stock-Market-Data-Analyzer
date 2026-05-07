"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Zap,
  MoreHorizontal,
  Upload,
  Eye,
  Wallet,
} from "lucide-react";

export default function Home() {
  const [ticker, setTicker] = useState("AAPL");
  const [start, setStart] = useState("2024-01-01");
  const [end, setEnd] = useState("2026-05-07");

  const [investmentAmount, setInvestmentAmount] = useState("10000");
  const [watchlistSymbol, setWatchlistSymbol] = useState("TSLA");
  const [alertPrice, setAlertPrice] = useState("300");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function fetchStockData() {
    try {
      setLoading(true);

      const response = await axios.get("http://127.0.0.1:8000/analyze", {
        params: { ticker, start, end },
      });

      setData(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch stock data. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStockData();
  }, []);

  const chartData = data?.chart_data || [];

  const recentReturns = chartData.slice(-40).map((item: any, index: number) => ({
    name: index + 1,
    returnValue: Number((item.daily_return * 100).toFixed(2)),
    volume: Number((item.volume / 10000000).toFixed(2)),
  }));

  const radarData = [
    {
      metric: "Return",
      value: Math.min(Math.abs(data?.summary?.overall_return_percent || 0), 100),
    },
    {
      metric: "Risk",
      value: Math.min(data?.summary?.volatility_percent || 0, 100),
    },
    {
      metric: "Trend",
      value: data?.summary?.trend === "Bullish" ? 85 : 35,
    },
    {
      metric: "Signal",
      value:
        data?.summary?.signal === "Buy"
          ? 90
          : data?.summary?.signal === "Sell"
          ? 30
          : 55,
    },
    {
      metric: "Backtest",
      value: Math.min(Math.abs(data?.backtest?.roi_percent || 0), 100),
    },
  ];

  const riskGauge = [
    {
      name: "Risk",
      value: Math.min(data?.summary?.volatility_percent || 0, 100),
      fill: "#8b5cf6",
    },
  ];

  const simulatedShares =
    data?.summary?.latest_close && Number(investmentAmount) > 0
      ? Number(investmentAmount) / data.summary.latest_close
      : 0;

  return (
    <main className="min-h-screen bg-[#11111d] text-white px-6 py-6">
      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5"
        >
          <div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white">
              Stock Market Data Analyzer
            </h1>
            <p className="text-[#b8b5d6] mt-2 text-lg">
              Premium fintech dashboard for market trends, risk, returns and
              backtesting.
            </p>
          </div>

          <div className="bg-[#242342] border border-[#38365f] rounded-[22px] px-5 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#35e895] animate-pulse" />
              <p className="text-sm text-[#d8d5ff] font-semibold">
                Live Analysis Engine Active
              </p>
            </div>
          </div>
        </motion.div>

        {/* Real Input Panel */}
        <motion.section
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#242342] border border-[#38365f] rounded-[22px] p-6 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black">Market Control Panel</h2>
              <p className="text-[#b8b5d6] text-sm mt-1">
                Enter custom stock details, simulate investment and configure
                alerts.
              </p>
            </div>

            <div className="bg-[#18182b] border border-[#3d3a66] rounded-xl px-4 py-2 text-sm text-[#d8d5ff]">
              Dynamic Inputs Enabled
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
            <InputBox
              label="Stock Ticker"
              value={ticker}
              onChange={(value: string) => setTicker(value.toUpperCase())}
              placeholder="AAPL"
            />

            <DateInput label="Start Date" value={start} onChange={setStart} />

            <DateInput label="End Date" value={end} onChange={setEnd} />

            <InputBox
              label="Investment Amount"
              value={investmentAmount}
              onChange={setInvestmentAmount}
              placeholder="10000"
              type="number"
            />

            <InputBox
              label="Watchlist Symbol"
              value={watchlistSymbol}
              onChange={(value: string) => setWatchlistSymbol(value.toUpperCase())}
              placeholder="TSLA"
            />

            <InputBox
              label="Alert Price"
              value={alertPrice}
              onChange={setAlertPrice}
              placeholder="300"
              type="number"
            />

            <div className="flex flex-col justify-end">
              <button
                onClick={fetchStockData}
                className="bg-gradient-to-r from-[#7c4dff] to-[#9f67ff] hover:opacity-90 rounded-xl py-4 font-bold text-lg shadow-xl flex items-center justify-center gap-2"
              >
                <Search size={19} />
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <SmallInputCard
              icon={<Wallet size={20} />}
              title="Portfolio Simulation"
              value={
                data
                  ? `${simulatedShares.toFixed(2)} estimated shares`
                  : "Enter amount to simulate"
              }
            />

            <div className="bg-[#18182b] border border-[#3d3a66] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[#b8b5d6] text-sm mb-3">
                <Upload size={18} />
                CSV Upload Option
              </div>
              <input
                type="file"
                className="block w-full text-sm text-[#d8d5ff] file:mr-4 file:rounded-lg file:border-0 file:bg-[#7c4dff] file:px-3 file:py-2 file:text-white"
              />
            </div>

            <SmallInputCard
              icon={<Eye size={20} />}
              title="Watchlist Preview"
              value={`${ticker}, ${watchlistSymbol}, MSFT, TSLA`}
            />
          </div>
        </motion.section>

        {data && (
          <>
            {/* Metric Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <MetricCard
                title="Latest Price"
                value={`$${data.summary.latest_close}`}
                subtitle="Current market close"
                icon={<DollarSign />}
                color="text-[#35e895]"
              />
              <MetricCard
                title="Overall Return"
                value={`${data.summary.overall_return_percent}%`}
                subtitle="Selected period gain/loss"
                icon={
                  data.summary.overall_return_percent >= 0 ? (
                    <TrendingUp />
                  ) : (
                    <TrendingDown />
                  )
                }
                color="text-[#ff7a59]"
              />
              <MetricCard
                title="Volatility"
                value={`${data.summary.volatility_percent}%`}
                subtitle={`${data.summary.risk_level} risk level`}
                icon={<Activity />}
                color="text-[#45c7ff]"
              />
              <MetricCard
                title="Signal"
                value={data.summary.signal}
                subtitle={`${data.summary.trend} market trend`}
                icon={<Zap />}
                color="text-[#ffcc3d]"
              />
            </section>

            {/* Top Dashboard Row */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <DashboardCard className="xl:col-span-5" title="Weekly Analysis">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-[#ff735c] text-3xl font-black">
                      ${data.summary.latest_close}
                    </p>
                    <p className="text-[#b8b5d6] text-sm mt-1">
                      Price movement with SMA 20 and SMA 50 trend lines.
                    </p>
                  </div>
                  <MoreHorizontal className="text-[#b8b5d6]" />
                </div>

                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={chartData.slice(-120)}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#4a486f" />
                    <XAxis dataKey="date" stroke="#b8b5d6" fontSize={10} />
                    <YAxis stroke="#b8b5d6" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        background: "#1d1d35",
                        border: "1px solid #6d5dfc",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#ff735c"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="sma_20"
                      stroke="#35e895"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="sma_50"
                      stroke="#45c7ff"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </DashboardCard>

              <DashboardCard className="xl:col-span-4" title="Risk Gauge">
                <div className="h-[250px] flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="55%"
                      innerRadius="60%"
                      outerRadius="95%"
                      barSize={22}
                      data={riskGauge}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={20}
                        background
                        fill="#8b5cf6"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>

                  <div className="absolute text-center mt-16">
                    <p className="text-4xl font-black">
                      {data.summary.volatility_percent}%
                    </p>
                    <p className="text-[#b8b5d6] text-sm">
                      {data.summary.risk_level} Risk
                    </p>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard className="xl:col-span-3" title="Daily Trends">
                <div className="space-y-3 mb-4">
                  <CheckRow label="Trend analysis" active />
                  <CheckRow label="Return tracking" active />
                  <CheckRow
                    label="Risk monitoring"
                    active={data.summary.risk_level !== "High"}
                  />
                </div>

                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={recentReturns}>
                    <defs>
                      <linearGradient
                        id="returnGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#6d5dfc" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6d5dfc" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#b8b5d6" fontSize={10} />
                    <YAxis stroke="#b8b5d6" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        background: "#1d1d35",
                        border: "1px solid #6d5dfc",
                        borderRadius: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="returnValue"
                      stroke="#35e895"
                      fill="url(#returnGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </DashboardCard>
            </section>

            {/* Middle Dashboard Row */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <DashboardCard className="xl:col-span-3" title="Analysis">
                <div className="space-y-5">
                  <ProgressCircle
                    label="Return"
                    value={Math.min(Math.abs(data.summary.overall_return_percent), 100)}
                    color="#45c7ff"
                  />
                  <ProgressCircle
                    label="Volatility"
                    value={Math.min(data.summary.volatility_percent, 100)}
                    color="#35e895"
                  />
                  <ProgressCircle
                    label="ROI"
                    value={Math.min(Math.abs(data.backtest.roi_percent), 100)}
                    color="#ff735c"
                  />
                </div>
              </DashboardCard>

              <DashboardCard className="xl:col-span-6" title="Performance Analysis">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={recentReturns}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#4a486f" />
                    <XAxis dataKey="name" stroke="#b8b5d6" />
                    <YAxis stroke="#b8b5d6" />
                    <Tooltip
                      contentStyle={{
                        background: "#1d1d35",
                        border: "1px solid #6d5dfc",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="returnValue"
                      stroke="#ff735c"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#ffcc3d"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </DashboardCard>

              <DashboardCard className="xl:col-span-3" title="Parameters">
                <Parameter
                  label="Return Strength"
                  value={Math.min(Math.abs(data.summary.overall_return_percent), 100)}
                  color="#35e895"
                />
                <Parameter
                  label="Risk Level"
                  value={Math.min(data.summary.volatility_percent, 100)}
                  color="#ff735c"
                />
                <Parameter
                  label="Backtest ROI"
                  value={Math.min(Math.abs(data.backtest.roi_percent), 100)}
                  color="#ffcc3d"
                />
                <Parameter
                  label="Trend Score"
                  value={data.summary.trend === "Bullish" ? 85 : 35}
                  color="#8b5cf6"
                />
                <Parameter
                  label="Signal Score"
                  value={
                    data.summary.signal === "Buy"
                      ? 90
                      : data.summary.signal === "Sell"
                      ? 30
                      : 55
                  }
                  color="#45c7ff"
                />
              </DashboardCard>
            </section>

            {/* Bottom Dashboard Row */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <DashboardCard className="xl:col-span-4" title="Market Summary">
                <div className="grid grid-cols-2 gap-4">
                  <MiniStat label="Highest Price" value={`$${data.summary.highest_price}`} />
                  <MiniStat label="Lowest Price" value={`$${data.summary.lowest_price}`} />
                  <MiniStat
                    label="Max Drawdown"
                    value={`${data.summary.max_drawdown_percent}%`}
                  />
                  <MiniStat
                    label="Avg Daily Return"
                    value={`${data.summary.average_daily_return_percent}%`}
                  />
                </div>
              </DashboardCard>

              <DashboardCard className="xl:col-span-5" title="Annual Analytics">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.slice(-12)}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#4a486f" />
                    <XAxis dataKey="date" stroke="#b8b5d6" fontSize={10} />
                    <YAxis stroke="#b8b5d6" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        background: "#1d1d35",
                        border: "1px solid #6d5dfc",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="volume" fill="#35e895" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </DashboardCard>

              <DashboardCard className="xl:col-span-3" title="Portfolio Radar">
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#4a486f" />
                    <PolarAngleAxis dataKey="metric" stroke="#b8b5d6" fontSize={11} />
                    <Radar
                      dataKey="value"
                      stroke="#35e895"
                      fill="#35e895"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </DashboardCard>
            </section>

            {/* Backtest Cards */}
            <section className="grid grid-cols-1 xl:grid-cols-4 gap-5">
              <BacktestCard title="Initial Capital" value={`$${data.backtest.initial_capital}`} />
              <BacktestCard title="Final Value" value={`$${data.backtest.final_value}`} />
              <BacktestCard title="Profit / Loss" value={`$${data.backtest.profit_loss}`} />
              <BacktestCard title="ROI" value={`${data.backtest.roi_percent}%`} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function InputBox({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-[#b8b5d6] mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#18182b] border border-[#3d3a66] rounded-xl px-4 py-4 outline-none text-white focus:border-[#8b5cf6]"
      />
    </div>
  );
}

function DateInput({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-[#b8b5d6] mb-2">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#18182b] border border-[#3d3a66] rounded-xl px-4 py-4 outline-none text-white focus:border-[#8b5cf6]"
      />
    </div>
  );
}

function SmallInputCard({ icon, title, value }: any) {
  return (
    <div className="bg-[#18182b] border border-[#3d3a66] rounded-2xl p-4">
      <div className="flex items-center gap-2 text-[#b8b5d6] text-sm mb-3">
        <span className="text-[#35e895]">{icon}</span>
        {title}
      </div>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function DashboardCard({ title, children, className = "" }: any) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`relative bg-[#242342] border border-[#38365f] rounded-[18px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">{title}</h2>
          <button className="bg-[#6d5dfc] px-3 py-1 rounded-lg text-xs font-semibold">
            More
          </button>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#242342] border border-[#38365f] rounded-[18px] p-5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#b8b5d6] text-sm">{title}</p>
        <div className={color}>{icon}</div>
      </div>
      <h3 className="text-3xl font-black">{value}</h3>
      <p className="text-[#b8b5d6] text-xs mt-2">{subtitle}</p>
    </motion.div>
  );
}

function CheckRow({ label, active }: any) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#d8d5ff]">
      <span
        className={`w-4 h-4 rounded border flex items-center justify-center ${
          active ? "bg-[#35e895] border-[#35e895]" : "border-[#b8b5d6]"
        }`}
      >
        {active ? "✓" : ""}
      </span>
      {label}
    </div>
  );
}

function ProgressCircle({ label, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative w-20 h-20 rounded-full border-[12px] border-[#46436f] flex items-center justify-center">
        <div
          className="absolute inset-[-12px] rounded-full border-[12px]"
          style={{
            borderColor: `${color} transparent transparent ${color}`,
            transform: "rotate(45deg)",
          }}
        />
        <span className="text-lg font-bold">{Math.round(value)}%</span>
      </div>
      <p className="text-[#d8d5ff]">{label}</p>
    </div>
  );
}

function Parameter({ label, value, color }: any) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[#d8d5ff]">{label}</span>
        <span className="font-bold">{Math.round(value)}%</span>
      </div>
      <div className="h-3 bg-[#46436f] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: any) {
  return (
    <div className="bg-[#18182b] border border-[#3d3a66] rounded-2xl p-4">
      <p className="text-[#b8b5d6] text-xs mb-2">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function BacktestCard({ title, value }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#242342] border border-[#38365f] rounded-[18px] p-5 shadow-xl"
    >
      <p className="text-[#b8b5d6] text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </motion.div>
  );
}